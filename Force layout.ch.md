# D3-force

*`D3-force-layout (力布局)`*模块利用`velocity Verlet`算法 实现了一个用于模拟粒子上物理力的数值积分器。当然内部的模拟做了简化, 假设每个`step(步骤)`的时间单位步长*Δt* = 1 ，所有粒子质量  *m* = 1。因此，作用在粒子上的力 *F* 等效于在时间间隔 Δ *t上的恒定加速度*  a，可以通过简单的方式将其与粒子的速度相加来模拟，然后将其添加到粒子的位置。

通俗简单来说` D3 -force -layout`基于一定的物理规则来定位可视化元素`(nodes and edges)`。

D3 的力布局使用基于**物理的模拟器**来定位视觉元素。

可以在元素之间设置`force(力)`，例如：

- `elements(所有元素)`都可以配置为与其他元素相互排斥
- `elements(所有元素)`可以被吸引到`center(重心)`, 通俗来说就是所有节点的平均位置靠近`center`。
- `linked elements (链接元素)` 可以设置为`fixed distance(固定距离)`
- 利用`collision detection(碰撞检测)`, `elements(元素)`可以配置为避免相互交叉

通过配置, `force-layout`从而帮助我们以<u>特定方式</u>来进行定位元素。



本文主要讲如何使用` D3-force-layout`以及如何使用它来创建**网络可视化(*network visualisations*),集群(clusters)**展示。



请看下面这个`force-layout`的例子：假设我们有许多`circle`, 且这些`circles`分为3类(通过`category`字段区分) ，然后我们添加`forces`：

- `circles`之间相互吸引（将`circles`聚集在一起）
- 碰撞检测（避免`circles`重叠）
- `circles`被三个重心之一吸引（`category`字段 :`A`，`B`或`C`）

![image-20220829141644227](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220829141644227.png)

> https://codepen.io/wantnocode/pen/jOzjXqB?editors=1111

`force-layout`比其他布局算法需要更多的计算量，因为算法内部的实现是迭代式的。逐步达到最优效果。 

### force simulation

一般来说，设置力模拟有 4 个步骤：

- 创建**对象数组**(`nodes and edges`)  
- 调用`forceSimulation`，传入对象数组 (`nodes`)
- 添加一个或多个`force functions(力函数)`（例如`forceManyBody`, `forceCenter`）
- 设置回调函数, `each tick (每次迭代)`后更新元素的位置。

看个简单的例子：

```
let width = 300, height = 300
let nodes = [{}, {}, {}, {}, {}]

let simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter(width / 2, height / 2))
  .on('tick', ticked);
```

我们在这里创建了一个由 5 个对象组成的简单数组，并添加了两个力函数`forceManyBody`和`forceCenter`。（其中第一个使元素相互排斥，而第二个将元素吸引到中心点。）

每次模拟迭代时，`ticked`都会调用该函数。此函数将`nodes`数组连接到`circle`元素并更新它们的位置：

```
function ticked() {
  var u = d3.select('svg')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 5)
    .attr('cx', function(d) {
      return d.x
    })
    .attr('cy', function(d) {
      return d.y
    });
}
```

![image-20220829151808204](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220829151808204.png)

> https://codepen.io/wantnocode/pen/qBozLjv

`force simulations`力模拟的强大功能和灵活性集中在`force functions`**力函数**上，这些函数可以调整元素的位置和速度，以实现吸引、排斥和碰撞检测等多种效果。

D3 内置了很多有用的函数：

- `forceCenter`（用于设置系统的重心）
- `forceManyBody`（用于使元素相互吸引或排斥）
- `forceCollide`（用于防止元素重叠）
- `forceX`和`forceY`（用于将元素吸引到给定点）
- `forceLink`（用于在连接元素之间创建固定距离）

通过`.force()`将`force functions (力函数)`添加到模拟中，第一个参数是定义的 id，第二个参数是`force functions(力函数)`：

```
simulation.force('charge', d3.forceManyBody())
```

下面我们展开看一下内置的`force functions(力函数)`。

### forceCenter

`forceCenter`对于将元素作为一个整体围绕`centering`居中是有用的。如果不设置默认坐标是 [0, 0]。

可以直接设置位置`[x,y]`初始化：

```
d3.forceCenter(100, 100)
```

或使用配置功能`.x()`和`.y()`：

```
d3.forceCenter().x(100).y(100)
```

然后使用以下方法将其添加到模拟中：

```
simulation.force('center', d3.forceCenter(100, 100))
```

### forceManyBody

`forceManyBody`使所有元素相互吸引或排斥。可以设置吸引或排斥的强度，`.strength()`其中正值导致元素相互吸引，而负值将导致元素相互排斥。默认值为`-30`。

```
simulation.force('charge', d3.forceManyBody().strength(-20))
```

![image-20220829151814539](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220829151814539.png)

> 在创建网络图时，通常配置元素相互排斥。但对于元素聚集在一起的需求，则需要配置元素的吸引(引力)。
>
> https://codepen.io/wantnocode/pen/qBozLjv

### forceCollide

`forceCollide`用于避免元素(此处是`circle`)重叠，并且可以将`circle`“聚集”在一起。

元素的`半径r`是通过将访问器函数`.radius`方法来传递给`forceCollide`'的,。此函数的第一个参数`d`是用来`data join`，可以从中得到`半径r`。

例如：

```
let numNodes = 100
let nodes = d3.range(numNodes).map(function(d) {
  return {radius: Math.random() * 25}
})

let simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(5))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide().radius(function(d) {
    return d.radius
  }))
```

![image-20220829155113093](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220829155113093.png)

> https://codepen.io/wantnocode/pen/GRxbzMM

> `forceManyBody`将所有节点聚集到一起，并将节点保持在容器的中心 ，`forceCollide`避免节点重叠。

### forceX 和 forceY

`forceX`和`forceY`设置元素**吸引到**指定的位置。我们可以对所有元素使用一个中心，也可以为每个元素的基础上添加。同时使用 `.strength()` 配置引力，进行配合。

例如，假设您有许多元素，每个元素都有一个`category`具有 value`0`或`1`的属性`2`。您可以添加一个`forceX`力函数基于元素的`category`分别将元素吸引到 x 坐标`100`，`300`或`500`的地方：

```
let xCenter = [100, 300, 500];

let simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(5))
  .force('x', d3.forceX().x(function(d) {
    return xCenter[d.category];
  }))
  .force('collision', d3.forceCollide().radius(function(d) {
    return d.radius;
  }));
```

![image-20220829141644227](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220829141644227.png)

> https://codepen.io/wantnocode/pen/jOzjXqB

> `forceManyBody`将所有节点聚集到一起，然后`forceX`将节点吸引到特定的 x 坐标。`forceCollide`避免(组织)节点相交。

如果我们的数据具有相关坐标信息，当然也可以同时使用`forceX`或`forceY`去定位元素。

```
...
.force('x', d3.forceX().x(function(d) {
    return d.x;
  }))
.force('y', d3.forceY().y(function(d) {
   return d.y;
}))
...
```



### forceLink

`forceLink`将链接的元素移动到一个**固定的距离(distance)**。它需要**links(一组链接)**来指定将哪些元素链接在一起。每个链接对象指定一个`source`(源)元素和`target`（目标)元素，其中值是元素的**标识id** (`如果没有id可以用数组的索引`)：

```
let links = d3.range(nodes.length - 1).map(function(i) {
    return {
    	source: Math.floor(Math.sqrt(i)),
    	target: i + 1,
    };
});
let links = [
  {source: 0, target: 1},
  ...
]
```

然后，使用`.links()`方法将`links(链接数组)`传递给`forceLink`函数：

```
let simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-100))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('link', d3.forceLink().links(links));
```

![image-20220829170154037](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220829170154037.png)



> https://codepen.io/wantnocode/pen/QWmXYqZ?editors=1111

> `forceManyBody`将节点分开，`forceCenter`使节点与画布容器保持居中，`forceLink`保持链接节点之间的固定距离。


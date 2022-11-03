# D3 Hierarchies

![image-20220823162654765](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220823162654765.png)

*如何使用 D3.js 可视化分层数据（树形数据）。本文展示了如何从数据数组创建分层数据结构。然后使用 D3进行可视化，布局展示形式包括`Tree,Cluster,Treemap,Pack,Partition`*。

分析或可视化数据时的一种重要步骤就是将数据先进行处理 比如: **分组**

下面假设 我们有一个部门组织架构数据(<u>非常简单的一个数据集</u>)：

| name      | boss |
| :-------- | :--- |
| 老王下属1 | 老王 |
| 老王下属2 | 老王 |
| 老王下属3 | 老王 |
| 老李下属1 | 老李 |
| 老李下属2 | 老李 |
| 老李下属3 | 老李 |
| 老李下属4 | 老李 |

例如，这里有一些电影数据：

可以按照**boss**进行分组，统计每个boss下面的下属人数：

| boss | 下属人数 |
| :--- | :------- |
| 老李 | 4        |
| 老王 | 3        |



数据如何具有层次结构。顶层(`top level`)是`boss`(这里是老王,老李);下面一层是各自的下属;

可以将层次结构视为树状结构，其中根节点(这里定义为CEO), 拆分为顶层（这里是boss）。每个顶级节点拆分为二级节点组（这里是下属），依此类推：

![image-20220824113057496](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824113057496.png)

> 最顶层的元素（**节点**）称为`root node`(**根节点**)。最底部的项目称为**叶子**或**叶子节点**。

> 当然不同的数据, 可以按不同的方式聚合（汇总）组。



下面会通过几种方法进行可视化分层数据，包括**Tree,Cluster,Treemap,Pack,Partition**



## 将数组格式的数据创建hierarchy(层次结构)

就拿上面的示例数据来说：

```
let Structure = [
	{
		"name":"老王下属1",
		"boss":"老王",
	},
	{
		"name":"老王下属2",
		"boss":"老王",
	},
	{
		"name":"老王下属3",
		"boss":"老王",
	},
	{
		"name":"老李下属1",
		"boss":"老李",
	},
	{
		"name":"老李下属2",
		"boss":"老李",
	},
	{
		"name":"老李下属3",
		"boss":"老李",
	},
]
```

> 可以使用 ![image-20220824113524559](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824113524559.png)函数按任何分类属性对数据进行分组。

第一个参数`.rollup`要分组的数据 （可迭代的数组）。

下一个参数是一个**reduce**函数。这是一个接受值数组并输出单个值的函数。它会遍历数组，对其中一个属性进行求和。

后续的参数都是指定要分组的属性的函数。(**依次分组**)

让我们对每个组中的项目进行分组`boss`和`name`;求和`length`

```
let groups = d3.rollup(Structure,
					   function(d) { return d.length; },// 此处length就是1;
					   function(d) { return d.boss; },
					   function(d) { return d.name; },
```

![image-20220824114112940](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824114112940.png)

在上面的示例中，按和`d3.rollup`分组。

`d3.rollup`返回一个嵌套的`Map`对象。

`Map`可以通过`.get`去进行获取元素：

```
groups.get("老王");
// Map(3) {'老王下属1' => 1, '老王下属2' => 1, '老王下属3' => 1}
groups.get("老王").get("老王下属1")
// 1  返回了求和数
```



## d3.hierarchy(层次结构)

D3 内部有一个生成层次结构数据结构的函数。

通过调用`d3.hierarchy`并传入`d3.rollup`生成成的`Map`对象来创建:

```
let groups = d3.rollup(Structure,
					   function(d) { return d.length; },
					   function(d) { return d.boss; },
					   function(d) { return d.name; },
					  );
let root = d3.hierarchy(groups);
```



![image-20220824114727198](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824114727198.png)

>  在一个基础常规的 JavaScript 对象，并在其上定义了各种提供附加功能的属性和方法。其中每个节点都有属性：`data`、`children`、`depth`和。`height``parent`

`data`是一个`Map`, 传入`d3.hierarchy`。通常，不需要访问该值，因为`hierarchy(层次结构)`通过其`children`和`value`属性使该数据可用。

`children`是一个包含节点子节点的数组。

`depth`和`height`指示层次结构中节点的深度和高度。（根节点的深度为零，叶节点的高度为零。）

`parent`是当前节点的父节点。

叶节点看起来像：

![image-20220824133328933](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824133328933.png)

可以看到该`data`属性包含汇总的值。如果汇总的值是总和或计数，则可以使用层次结构的`.sum`方法将其返回给`root`：

```
let groups = d3.rollup(Structure,
                function(d) { return d.length; },
                function(d) { return d.boss; },
                function(d) { return d.name; },
                );
let root = d3.hierarchy(groups);

root.sum(function(d) {
	return d[1];
});
```

<iframe class="db center" src="https://www.d3indepth.com/examples-merged/arrays/rollup-hierarchy-with-sum/" marginwidth="0" marginheight="0" scrolling="yes" style="border: none; margin-top: 2em; display: block; margin-left: auto; margin-right: auto; color: rgba(0, 0, 0, 0.7); font-family: -apple-system, BlinkMacSystemFont, &quot;avenir next&quot;, avenir, &quot;helvetica neue&quot;, helvetica, ubuntu, roboto, noto, &quot;segoe ui&quot;, arial, sans-serif; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; width: 400px; height: 0px;"></iframe>

> 该`.sum`方法采用一个访问器函数，其第一个参数是节点的`data`属性。访问器函数返回要求和的值。



观察每个叶节点现在将具有`value`与其汇总值等效的属性。例如：

![image-20220824133711480](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824133711480.png)

非叶节点还将具有一个`value`属性，即其子节点的值之和。

![image-20220824133730511](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824133730511.png)



>  D3 层次结构中的每个节点都有方便的方法，例如`.descendants`、`.ancestors`和`.links`。

`.descendants`返回一个包含节点及其子节点的数组。

`.ancestors`返回一个包含节点及其父级的数组（一直到根节点）。

`.links`返回一个对象数组，表示节点与其子节点之间的连接，一直到叶子节点。

## Visualising  hierarchy(层次结构进行可视化)

有几种布局方法可以可视化层次结构，包括：

`Tree`

![image-20220824141237713](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824141237713.png)

> https://codepen.io/wantnocode/pen/BarEdxY

`Treemap`

![image-20220824154122632](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824154122632.png)

> https://codepen.io/wantnocode/pen/gOeyxJe?editors=1111

`Pack `：

![image-20220824151902200](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824151902200.png)

> https://codepen.io/wantnocode/pen/dymLVaj

`partition`：



![image-20220824153940570](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824153940570.png)

> https://codepen.io/wantnocode/pen/MWVROgJ

**D3 使用layout(布局)功能**满足上面所说的可视化形式。这些采用`d3.hierarchy`结构并向其添加**视觉渲染变量，比如位置和大小**。

例如, 树布局向每个节点添加`x`和`y`值，使得节点形成树状形状。

在本章中，我们将了解、`tree`、`cluster``treemap``pack``partition`布局。



### Tree Layout (树形布局)

**布局以树状排列方式排列**层次结构的节点。

![image-20220824141237713](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824141237713.png)

> https://codepen.io/wantnocode/pen/BarEdxY

首先使用创建树布局函数`d3.tree()`：

```
var treeLayout = d3.tree();
```

> d3.tree() 返回一个布局函数，您可以将层次结构对象传递给该函数。

可以使用以下命令配置树的大小`.size`：

```
treeLayout.size([700, 200]);
```

然后，可以调用`treeLayout`，传入上面定义的层次结构对象`root`：

```
treeLayout(root);
```

这将会在每个节点上写入`x`和`y`值。

绘制节点：

- 用于`root.descendants()`获取所有节点的数组
- 将此数组`join`圆（或任何其他类型的 SVG 元素）
- 使用`x`和`y`定位圆圈

要绘制链接：

- 用于`root.links()`获取所有链接的数组
- 将数组连接到`line`（或`path`）元素
- 使用`x`和`y`链接的`source`和`target`属性来定位`line`

> `root.links()`返回一个数组，其中每个元素都是一个包含两个属性的对象`source`，`target`分别代表链接的源节点和目标节点。

```
// Links
d3.select('svg g')
	.selectAll('line')
	.data(root.links())
	.join('line')
	.attr('x1', function(d) {return d.source.x;})
	.attr('y1', function(d) {return d.source.y;})
	.attr('x2', function(d) {return d.target.x;})
	.attr('y2', function(d) {return d.target.y;});

// Nodes
d3.select('svg g')
	.selectAll('circle')
	.data(root.descendants())
	.join('circle')
	.attr('cx', function(d) {return d.x;})
	.attr('cy', function(d) {return d.y;})
	.attr('r', 4);

```



### Cluster Layout(集群布局)

布局与`cluster`布局非常相似，`tree`主要区别在于**所有叶节点都放置在相同的深度**。

```
var clusterLayout = d3.cluster()
  .size([400, 200]);

var root = d3.hierarchy(data);

clusterLayout(root);
```

![image-20220824141301367](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824141301367.png)

> https://codepen.io/wantnocode/pen/rNdbzvX?editors=1111

### Treemap Layout (树状图布局)

![image-20220824155635775](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824155635775.png)

通过调用创建树图布局函数`d3.treemap()` ：

```
var treemapLayout = d3.treemap();
```

和以前一样，您可以配置布局：

```
treemapLayout
  .size([400, 200])
  .paddingOuter(10);
```

在将此布局应用于您的层次结构之前，**您必须`.sum()`在层次结构上**运行。这将遍历树并`.value`在每个节点上设置为其子节点的总和：

```
root.sum(function(d) {
  return d.value;
});
```

> 请注意，已将访问器函数传入`.sum()`以指定要求和的属性。

您现在可以调用`treemapLayout`，传入`root`之前定义的层次结构对象：

```
treemapLayout(root);
```

树形图布局函数向每个节点添加 4 个属性`x0`、和`x1`，它们指定树形图中每个矩形的尺寸。`y0``y1`

现在您可以将节点连接到`rect`元素并更新每个的`x`、`y`和属性：`width``height``rect`

```
d3.select('svg g')
  .selectAll('rect')
  .data(root.descendants())
  .join('rect')
  .attr('x', function(d) { return d.x0; })
  .attr('y', function(d) { return d.y0; })
  .attr('width', function(d) { return d.x1 - d.x0; })
  .attr('height', function(d) { return d.y1 - d.y0; })
```

![image-20220824141941296](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824141941296.png)

如果您想在每个矩形中添加标签，您可以将`g`元素加入数组并添加`rect`和`text`元素到每个`g`：

```
var nodes = d3.select('svg g')
  .selectAll('g')
  .data(rootNode.descendants())
  .join('g')
  .attr('transform', function(d) {return 'translate(' + [d.x0, d.y0] + ')'})

nodes
  .append('rect')
  .attr('width', function(d) { return d.x1 - d.x0; })
  .attr('height', function(d) { return d.y1 - d.y0; })

nodes
  .append('text')
  .attr('dx', 4)
  .attr('dy', 14)
  .text(function(d) {
    return d.data.name;
  })
```

![image-20220824154122632](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824154122632.png)

> https://codepen.io/wantnocode/pen/gOeyxJe?editors=1111

`treemap`可以通过多种方式配置布局：

- 可以使用设置节点子节点周围的填充`.paddingOuter`

- 兄弟节点之间的填充可以使用`.paddingInner`

- 可以使用同时设置外部和内部填充`.padding`

- `.paddingTop`外部填充也可以使用,`.paddingBottom`和`.paddingLeft`进行微调`.paddingRight`。

  

>  树形图有不止一种排列矩形的策略。D3 有一些内置的，例如`treemapBinary`, `treemapDice`,和 .`treemapSlice``treemapSliceDice``treemapSquarify`

`treemapBinary`力求水平和垂直分区之间的平衡，水平分区，垂直分区，水平和垂直分区`treemapDice`之间`treemapSlice`的`treemapSliceDice`交替，并`treemapSquarify`允许矩形的纵横比受到影响。

您可以使用以下方法选择平铺策略`.tile`：

```
treemapLayout.tile(d3.treemapDice)
```

![image-20220824154155985](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824154155985.png)

![image-20220824154207555](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824154207555.png)

> https://codepen.io/wantnocode/pen/RwMOLaM

### Pack Layout (包围布局）

`Pack`布局类似于`Tree`布局，但**圆圈**用于表示节点。

![image-20220824155621105](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824155621105.png)

使用以下命令创建`Pack`布局函数`d3.pack()`：

```
var packLayout = d3.pack();
```

和以前一样，可以通过将数组传递`[width, height]`给`.size`方法来配置其大小：

```
packLayout.size([300, 300]);
```

与`treemap`一样,  必须在应用布局**之前调用**`.sum()`:

```
rootNode.sum(function(d) {
  return d.value;
});

packLayout(rootNode);
```

`pack`布局为每个节点添加,`x`和`y`属性。

现在可以将`circle`元素连接到 `root`的子节点：

```
d3.select('svg g')
  .selectAll('circle')
  .data(rootNode.descendants())
  .join('circle')
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })
  .attr('r', function(d) { return d.r; })
```



可以通过`g`为每个子节点创建元素来添加标签：

```
var nodes = d3.select('svg g')
  .selectAll('g')
  .data(rootNode.descendants())
  .join('g')
  .attr('transform', function(d) {return 'translate(' + [d.x, d.y] + ')'})

nodes
  .append('circle')
  .attr('r', function(d) { return d.r; })

nodes
  .append('text')
  .attr('dy', 4)
  .text(function(d) {
    return d.children === undefined ? d.data.name : '';
  })
```

![image-20220824151749759](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824151749759.png)

可以使用`.padding()`配置每个圆圈周围的填充：

```
packLayout.padding(20);
```

> 注意配置放在应用布局`packLayout()`之前;

![image-20220824151902200](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824151902200.png)

> https://codepen.io/wantnocode/pen/dymLVaj

### Partition layout  (分区布局)

`partition`布局将一个矩形空间细分为层，每个层代表层次结构中的一个层。对于层中的每个节点，每一层进一步细分：

![img](https://www.d3indepth.com/img/layouts/partition.png)

使用以下命令创建分区布局函数`d3.partition()`：

```
var partitionLayout = d3.partition();
```

和前面一样，可以通过将数组传递`[width, height]`给`.size`方法来配置其大小：

```
partitionLayout.size([400, 200]);
```

与`treemap`一样必须在应用布局之前调用`.sum()`:

```
rootNode.sum(function(d) {
  return d.value;
});

partitionLayout(rootNode);

```

现在可以将`rect`元素连接到`root`的每个子节点：

```
d3.select('svg g')
  .selectAll('rect')
  .data(rootNode.descendants())
  .join('rect')
  .attr('x', function(d) { return d.x0; })
  .attr('y', function(d) { return d.y0; })
  .attr('width', function(d) { return d.x1 - d.x0; })
  .attr('height', function(d) { return d.y1 - d.y0; });
```

![image-20220824153116688](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824153116688.png)

可以使用以下方法在节点之间添加填充`.padding()`：

```
partitionLayout.padding(2);
```

![image-20220824153042215](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824153042215.png)

> https://codepen.io/wantnocode/pen/WNzWZWv

如果想更改分区布局的方向，以便图层从左到右运行，可以在定义元素时交换`x0`和交换：`y0``x1``y1``rect`

```
  .attr('x', function(d) { return d.y0; })
  .attr('y', function(d) { return d.x0; })
  .attr('width', function(d) { return d.y1 - d.y0; })
  .attr('height', function(d) { return d.x1 - d.x0; });
```

![image-20220824153503496](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824153503496.png)

> https://codepen.io/wantnocode/pen/ZExZXde

还可以将`x`映射到旋转角度, `y`映射到半径以创建旭日形分区：



```
d3.arc()
	.startAngle(function(d) { return d.x0; })
	.endAngle(function(d) { return d.x1; })
	.innerRadius(function(d) { return d.y0; })
	.outerRadius(function(d) { return d.y1; });
```



![image-20220824153940570](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220824153940570.png)

> https://codepen.io/wantnocode/pen/MWVROgJ
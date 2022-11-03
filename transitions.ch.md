# D3 Transitions

**`D3 Transitions`帮助图表在不同状态切换切换平滑制作动画**。本文展示了如何给`选择元素(Selection)`添加`Transitions`、`过渡持续时间(duraition)`、`交错过渡(staggered transitions)`、`缓动函数(easing function)`、`链接过渡(chain transitions)`。

比如将一个数组连接到 `SVG-circle`，单击`update`按钮时，数据随机改变使得`circle`会跳转到新位置, 首先看不加`Transitions`的效果:

![transition1](https://user-images.githubusercontent.com/32726183/199651816-642cbd80-6a92-4798-ad43-422916f85f84.gif)


如果我们向圆圈添加过渡，圆圈会平滑地移动到它们的新位置：

![tranisition2](https://user-images.githubusercontent.com/32726183/199651825-6fa14363-67ae-420f-82ff-4b33dd634a79.gif)


此外，**entering circles**（新创建的`circle`）和**exiting circles**（要删除的`circle`）可以通过特定的方式进行过渡。在此示例中，`entering`采取`fade In(淡入)` `exiting `采取 `drop Down（下降离开)`：

![transition3](https://user-images.githubusercontent.com/32726183/199651841-1c190d66-cafe-445c-b467-2063d9375234.gif)


## 创建 D3 transition

使用 D3 创建`basic transition(基础过渡)`非常简单。将几个随机数据的数组连接到`circle`元素：

```
let data = [];

function updateData() {
  data = [];
  for(let i=0; i<5; i++) {
    data.push(Math.random() * 800);
  }
}

function update() {
  d3.select('svg')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cy', 50)
    .attr('r', 40)
    .attr('cx', function(d) {
      return d;
    });
}

function updateAll() {
  updateData(); 
  update();
}

updateAll(); // 单击按钮时调用
```



单击按钮时，数据会发生改变(**主要就是x坐标信息**) 然后重新加载，圆圈会跳转到新位置：

![transition1](https://user-images.githubusercontent.com/32726183/199651865-0265c769-ed70-4d98-8beb-0368b393e0f8.gif)


然后, 只需要在`attr()`前面添加一个``.transition()``即可添加默认过渡效果:

```
function update() {
  d3.select('svg')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cy', 50)
    .attr('r', 40)
    .transition()
    .attr('cx', function(d) {
      return d;
    });
}
```



![tranisition2](https://user-images.githubusercontent.com/32726183/199651884-f273513a-25ee-45d1-a41d-7b574c4269a1.gif)


> 该`.transition`方法返回一个`transition selection`。与普通的 `D3 Selection`基本相同，除了`.attr`和`.style`方法对属性和样式进行动画处理。过渡选择还有其他方法`.tween`。

一旦调用了该`.transition`方法，后续调用`.attr`和`.style`将分别为属性和样式设置动画。

例如，让我们随机配置每个圆的一些属性和样式：

```

function random(x) {return Math.floor(Math.random() * x);}// 随机数并取整

function updateData() {
	data = [];
	for(let i=0; i < 5; i++) {
		data.push({
			x: random(750),
			r: random(50),
			fill: d3.rgb(random(255), random(255), random(255)),
            opacity:Math.random()
		});
	}
}
```

在`update`函数中，我们在`.transition`后更新圆的属性样式：

```
function update() {
	d3.select('svg')
		.selectAll('circle')
		.data(data)
		.join('circle')
		.attr('cy', 50)
		.transition()
		.attr('cx', function(d) {
			return d.x;
		})
		.attr('r', function(d) {
			return d.r;
		})
        .style('opacity', function(d) {
			return d.opacity;
		})
		.style('fill', function(d) {
			return d.fill;
		});
}
```

现在，当数据更新时，每个圆的**位置**、**半径**、**透明度**和**颜色都会发生变化：**

![transition4](https://user-images.githubusercontent.com/32726183/199651904-66bee116-fc2c-4479-980d-e86ff949a787.gif)


> https://codepen.io/wantnocode/pen/rNdgNzY?editors=1111

## Entering and exiting elements 进入和退出元素

可以给**进入**和**退出**元素定义特定的`tranistion`。（进入元素是新创建的元素，退出元素是即将被删除的元素。）

例如**entering circles**（新创建的`circle`）和**exiting circles**（要删除的`circle`）可以通过特定的方式进行过渡，`entering`采取`fade In(淡入)` `exiting `采取 `drop Down（下降离开)`：

![transition3](https://user-images.githubusercontent.com/32726183/199651911-8eca1020-5e50-4337-b037-5a993b92ff04.gif)


要定义进入和退出`tranistion`，需要将**三个函数**传递给该`.join`方法。

```
.join(
  function(enter) {
    ...
  },
  function(update) {
    ...
  },
  function(exit) {
    ...
  }
)
```

第一个、第二个和第三个函数分别负责行为是**enter**、**update**和**exit**。

### Entering elements 进入元素

`enter` 函数参数为`Selection`的每个元素。

我们可以设置输入元素**的样式和属性**，这使得在任何`tranistion`触发之前**元素初始化的效果。**

让我们初始化`cy`, `cx`,`r`和`opacity`：

```
.join(
  function(enter) {
    return enter
      .append('circle')
      .attr('cy', 50)
      .attr('cx', function(d) {
        return d;
      })
      .attr('r', 40)
      .style('opacity', 0);
  },
  function(update) {
    return update;
  },
  function(exit) {
    return exit.remove();
  }
)
```

初始化进入圆圈的初始 x 和 y 坐标，以便圆圈出现在适当的位置（而不是从原点滑入）。

初始化输入圆的初始半径，使圆出现的半径为 40。

最后，进入圆圈的不透明度被初始化为 0，以便进入的圆圈淡入。（稍后我们将设置最终的不透明度。）

### Exiting elements 退出元素

`exit` 函数会移除退出选择中的元素：

```
.join(
  ...
  function(exit) {
    return exit.remove();
  }
)
```

> 注意:  如果不调用`.remove`退出选择，则元素将保留在页面上。

`.transition`可以通过调用`exit selection`向退出元素添加过渡。假如要为现有元素有一个`down`的效果脱离页面，那么就是将其属性设置`cy`为较大的值：

```
.join(
  function(enter) { ... },
  function(update) { ... },
  function(exit) {
    return exit
      .transition()
      .attr('cy', 500)
      .remove();  //移出元素
  }
)
```

`tranistion selection`的`.remove`方法在`tranistion(过渡)`结束时删除选择的元素。

### Updating elements 更新元素

`updating` 换个简单角度理解 其实就是进入元素最终呈现的结果,  退出元素的过渡的开始呈现结果。

比如 让我们给`Entering elements(Entering elements 进入元素)`添加`.transition`的最终呈现效果 : 也就是`opacity` 和 `cx`俩个属性(样式):

```
d3.select('svg')
  .selectAll('circle')
  .data(data)
  .join(
    function(enter) { ... },
    function(update) { ... },
    function(exit) { ... }
  )
  .transition()
  .attr('cx', function(d) {
    return d;
  })
  .style('opacity', 0.75);
```

这具有以下效果：

- 当数据改变时，`circle`过渡到新位置（`.attr('cx')`）
- 创建`circle`时，它们会淡入



**下面看完整的例子:** 

- `circle`淡入
- `circle`过渡到新位置
- `circle`退出时从页面上掉下来

```
function update() {
	d3.select('svg')
		.selectAll('circle')
		.data(data)
		.join(
			function(enter) {
				return enter
					.append('circle')
					.attr('cy', 50)
          .attr('cx', function(d) {
						return d;
					})
					.attr('r', 40)
          .style("fill","blue")
					.style('opacity', 0.1);
			},
			function(update) {
				return update;
			},
			function(exit) {
				return exit
					.transition()
					.duration(1000)  // 过渡持续时间
					.attr('cy', 500)
					.remove();
			}
		)
		.transition()
		.duration(1000) // 过渡持续时间
		.attr('cx', function(d) {
			return d;
		})
		.style('opacity', 0.75);
}
```

![transition3](https://user-images.githubusercontent.com/32726183/199651952-cca50dc4-3320-49c4-bb85-b13bc0915a4e.gif)






## Duration and delay 持续时间和延迟

可以通过调用`.duration`后设置`.transition`转换的持续时间。该`.duration`方法接受一个参数，该参数以毫秒为单位指定持续时间：

```
d3.select('svg')
		.selectAll('circle')
		.data(data)
		.join(
			...
		)
		.transition()
		.duration(2000) // 过渡持续时间
		.attr('cx', function(d) {
			return d;
		})
		.style('opacity', 0.75);
```

比如我们将`进入元素`的`duration`设置为 2000 毫秒：

![transition5](https://user-images.githubusercontent.com/32726183/199651966-61fd2537-756b-4b87-ad00-762560c4e39d.gif)


> https://codepen.io/wantnocode/pen/RwMmNLG

我们还可以指定`transition`开始之前的`delay(延迟)`：

```
...
  .transition()
  .delay(2000)
  .attr('cx', function(d) {
    return d;
  });
```

`delay`通常用于将`Selection`中的每个元素赋值不同的量。比如根据索引给到每个元素不同的延迟`.delay * i` :(达到一个一个缓动效果)

```
d3.select('svg')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cy', 50)
    .attr('r', 20)
    .transition()
    .delay(function(d, i) {
    	return i * 100;
    })
    .attr('cx', function(d) {
    	return d;
    });
```

![transition6](https://user-images.githubusercontent.com/32726183/199651975-ba6e8623-1591-4e09-a71b-50301aa27ff6.gif)


> https://codepen.io/wantnocode/pen/wvmbBjp?editors=1111

## Easing functions

**Easing functions (缓动函数)**定义了元素在过渡期间的速度变化,可以

D3 有许多内置的缓动函数([需要了解easing functions 相关介绍可以参考](https://github.com/d3/d3-ease#ease_ease)):

```
["easeBack","easeBackIn","easeBackInOut","easeBackOut","easeBounce","easeBounceIn","easeBounceInOut","easeBounceOut","easeCircle","easeCircleIn","easeCircleInOut","easeCircleOut","easeCubic","easeCubicIn","easeCubicInOut","easeCubicOut","easeElastic","easeElasticIn","easeElasticInOut","easeElasticOut","easeExp","easeExpIn","easeExpInOut","easeExpOut","easeLinear","easePoly","easePolyIn","easePolyInOut","easePolyOut","easeQuad","easeQuadIn","easeQuadInOut","easeQuadOut","easeSin","easeSinIn","easeSinInOut","easeSinOut"]
```

![transition7](https://user-images.githubusercontent.com/32726183/199652015-ff609cb1-4f3c-453a-9ba2-5d5aa3114fac.gif)




> https://codepen.io/wantnocode/pen/GRxaJKO?editors=1111

> 一般来说，“in”是指运动的开始，“out”是指运动的结束。因此，`easeBounceOut`指的是元素在过渡**结束时`bounce（反弹）`。**`easeBounceInOut`使元素在过渡的**开始和结束时反弹。**

> 通常最好在元素开始快速移动并放慢速度的情况下使用缓动。例如`easeCubicOut`，一个常用的缓动函数，元素首先移动很快，然后变慢。D3 的默认缓动函数`easeCubic`相当于`easeCubicInOut`. 这会导致元素开始缓慢，加速，然后缓慢结束。

## Chained transitions 链式转换

`transition`可以通过添加多个调用拼在一起(`也就是链式调用`)。每个`transitions`都将会进行。（**进行顺序: 当第一个过渡结束时，第二个将开始，依此类推。**）

例如，让我们将俩个`transition`链接起来使用。第一个设置`cx`属性，第二个设置`r`属性（并使用`easeElastic`）：

```
d3.select('svg')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cy', 50)
    .style("fill","blue")
    .transition()
    .attr('cx', function(d) {
    	return d.x;
    })
    .transition()
    .duration(1000)
    .ease(d3. easeElastic)
    .attr('r', function(d) {
    	return d.r;
    });
```

当图表更新时，`circle`移动到新坐标，然后`r`发生变化：



![transition8](https://user-images.githubusercontent.com/32726183/199652031-de499fc0-34f5-40d1-b48f-2d20a6ea5d90.gif)



> https://codepen.io/wantnocode/pen/wvmbazY?editors=1112

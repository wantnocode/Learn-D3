# D3 Selections(选择)

![img](https://www.showdoc.com.cn/server/api/attachment/visitFile?sign=0a7907301af52dca3aa381f9588554ec)

如何使用 `D3 Selction`来选择 HTML 和 SVG 元素。本文展示了如何`selecting Elements` , `modifying Elements` ,  `Handling Events`, `Control Flow`... <u>(`joining Data`单独有一篇讲解)</u>，除此之外还有`Chaining `链式调用 `filter sort`等函数对元素的处理。



`D3 Selection`可以选择一些 HTML 或 SVG 元素并更改它们的样式和/或属性。

例如 设置P元素的样式 `.attr `添加一个`class`, `.style`更改样式

```
d3.selectAll("p")
    .attr("class", "p1")
    .style("color", "red");
```

![image-20220815162838211](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220815162838211.png)

例如，如果index.html`文件包含几个` circle`元素：

```
<svg width="600" height="100">
  <g transform="translate(60, 60)">
    <circle cx="50" />
   ...
  </g>
</svg>
```

可以使用`d3.selectAll`选择circle然后`.style`更改它们的`fill(填充色)`,`.attr`更改它们的`r(半径)`：

```
d3.selectAll('circle')
	.style('fill', 'red')
	.attr('r', function() {
		return 20;
	}); 
```

![image-20220815162758018](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220815162758018.png)

> [在codepen中尝试编辑上面示例](https://codepen.io/wantnocode/pen/bGvmQLO)

### Selecting Elements (选择元素)

D3 有两个函数方法来进行选择`d3.select`和`d3.selectAll`。

`d3.select`选择第一个匹配元素，`d3.selectAll`选择所有匹配元素。

这两个函数都将字符串作为其唯一参数。该字符串指定要选择的元素，并采用 CSS 选择器字符串的形式（例如`div.item`，`#my-chart`或`g:first-child`）。

（如果您不熟悉 CSS 选择器，请查看[W3C-CSS 部分](https://www.w3school.com.cn/css/css_selectors.asp)。）

```javascript
const a = d3.select("a"); // 匹配第一个元素
const a = d3.selectAll("a"); // 匹配全部元素
const b = d3.selectAll("p").selectAll("b"); //匹配P下面所有的b元素
const items = d3.selectAll(".item");  // 匹配class名为.item的所有元素
```

### Modifying Elements (修改元素)

选择元素后，您可以使用以下函数修改其中的元素：

| name        | behaviour       | example                                                      |
| :---------- | :-------------- | :----------------------------------------------------------- |
| `.attr`     | 更新属性        | `d3.selectAll('rect').attr('width', 10)`                     |
| `.classed`  | 添加/删除类属性 | `d3.select('.item').classed('selected', true)`               |
| `.style`    | 更新样式        | `d3.selectAll('circle').style('fill', 'red')`                |
| `.property` | 更新元素的属性  | `d3.selectAll('.checkbox').property('checked', false)`       |
| `.text`     | 更新文本内容    | `d3.select('div.title').text('My new book')`                 |
| `.html`     | 更改html内容    | `d3.select('.legend').html('<div class="block"></div><div>0 - 10</div>')` |

无论使用`.select`还是`.selectAll`，选择中的所有元素都会被修改。

以下是所有这些函数的使用示例：

![image-20220815164349719](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220815164349719.png)

> [在codepen中尝试编辑上面示例](https://codepen.io/wantnocode/pen/WNzaLxb)

#### Modifying Elements with functions (通过函数形式修改元素)

除了将常量值传递给固定函数`.style`, `.attr`, `.classed`, `.property`,`.text`，`.html` 之外, 您还可以传入一个函数。例如：

```
d3.selectAll('circle')
    .attr('r', function(d, i) {
    	return i * 10;
    });
```

该函数接受两个参数，通常命名为`data`和`index` (简写为d,i)。第一个参数`d`是**Joined data (连接数据**)，`i`是选择中元素的**index (索引)**。

如果要根据选择中的位置更新选择中的元素，可以使用`i`参数。例如 要调整`circle`的`x`坐标：

```
d3.selectAll('circle')
    .attr('cx', function(d, i) {
    	return i * 10;
    });
```

![image-20220815165357083](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220815165357083.png)![image-20220815165409977](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220815165409977.png)

在传入函数的大多数情况下，使用匿名函数。但是，您也可以使用命名函数。例如：

```
function changePosition(d, i) {
  return i * 10;
}

d3.selectAll('circle')
  .attr('cx', changePosition);
```

> [在codepen中尝试编辑上面示例](https://codepen.io/wantnocode/pen/jOzeXBW)

### Inserting and removing elements插入和删除元素

通过`.append .insert `方法可以将元素添加到选择元素中。

`.append`将一个元素附加到选择中的每个元素。如果元素已经有子元素，则新元素将成为最后一个子元素。第一个参数指定元素的类型。



通过``.remove`` 方法可以删除元素。



例如: 下面有 3 个`g`元素，每个元素都包含一个`circle`：

```
<g transform="translate(0, 0)">
  <circle r="40" />
</g>
<g transform="translate(120, 0)">
  <circle r="40" />
</g>
<g transform="translate(240, 0)">
  <circle r="40" />
</g>
```

您可以使用`append`方法给每个`g`元素附加一个`text`元素：

```
d3.selectAll('g')
  .append('text')
  .text('A');
```

导致一个`text`元素被添加到每个`g.item`：

```
<g transform="translate(0, 0)">
  <circle r="40" />
  <text>A</text>
</g>
...
```

![image-20220815171113940](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220815171113940.png)

> [在codepen中尝试编辑上面示例](https://codepen.io/wantnocode/pen/eYMPbME)

`.insert`也是添加元素, 它允许我们指定第二个参数，该参数指定在哪个元素之前插入新元素。

在上面那个例子中改为`.insert`，第二个参数设置为`'circle'`：

```
d3.selectAll('g.item')
  .insert('text', 'circle')
  .text('A');
```

![image-20220815171917840](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220815171917840.png)

> [在codepen中尝试编辑上面示例](https://codepen.io/wantnocode/pen/ExEdGRE)

`.remove`从页面中删除选择中的所有元素。例如: 删除图中所有圆

```
d3.selectAll('circle')
  .remove();
```

![image-20220815172305125](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220815172305125.png)

![image-20220815172312667](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220815172312667.png)

> [在codepen中尝试编辑上面示例](https://codepen.io/wantnocode/pen/MWVPZPv)

### Event handling事件处理

您可以使用`.on`该方法将事件处理程序添加到选定元素上。

此方法有两个参数：

- 第一个是指定事件类型的字符串 `typenames`
- 第二个是触发事件时调用的函数（“回调函数”）。此回调函数有两个参数，通常命名为`e`和`d`。`e`是 DOM 事件对象并且`d`是连接数据。`listener`

**D3 version5+，回调函数被传递了 data`d`和 index `i`。**

最常见的事件包括（有关详细信息，请参阅[MDN 事件参考](https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events)）：

| 活动名称     | 描述               |
| :----------- | :----------------- |
| `click`      | 元素已被点击       |
| `mouseenter` | 鼠标已移动到元素上 |
| `mouseleave` | 鼠标已移开元素     |

在事件回调函数中，`this`变量绑定到触发事件的 DOM 元素。这使我们能够执行以下操作：

```
d3.selectAll('circle')
  .on('click', function(e, d) {
    d3.select(this)
      .style('fill', 'orange');
  });
```

![image-20220815174327573](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220815174327573.png)

请注意，这`this`是一个 DOM 元素，而不是 D3 选择，因此您想使用 D3 修改它，您必须首先使用**`d3.select(this)`.**

> [在codepen中尝试编辑上面示例](https://codepen.io/wantnocode/pen/XWExOWY)

### Chaining 链式调用

大多数选择方法`(Selection methods)`的返回值是选择本身。这意味着诸如 和 类的选择方法`.style`可以`.attr`链式`.on`起来。例如：

```
d3.selectAll('circle')
	.style('fill', '#000')
	.attr('r', 20)
	.on('click', function(e, d) {
		d3.select(this)
			.style('fill', 'orange');
	});
```

![image-20220815174708732](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220815174708732.png)

### Control Flow

### .each

`.each`方法允许您为**选择的每个元素**调用一个函数。

回调函数有两个参数，通常命名为`d`和`i`。第一个参数`d`是**连接数据**（或“数据”），`i`是选择中元素的**索引**。`this`关键字是指选择中的当前` HTML` 或` SVG `元素。

这是一个示例，`.each`用于为每个选择的元素调用函数。该函数计算索引是奇数还是偶数，并相应地修改圆：

```
d3.selectAll('circle')
  .each(function(d, i) {
    var odd = i % 2 === 1; // 判断是否为偶数

    d3.select(this)
      .style('fill', odd ? 'red' : '#000')
      .attr('r', odd ? 40 : 20);
  });
  
```

![image-20220815175047627](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220815175047627.png)

> [在codepen中尝试编辑上面示例](https://codepen.io/wantnocode/pen/yLKRZYp)

### .call

`.call`方法允许调用一个函数，将**选择的本身**作为第一个参数传递给该函数。

例如，`colorAll`获取一个选区并将选区元素的填充设置为橙色：

```
function colorAll(selection) {
    selection
        .style('fill', 'red');
}

d3.selectAll('circle')
    .call(colorAll);
```

![image-20220815175331928](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220815175331928.png)

> [在codepen中尝试编辑上面示例](https://codepen.io/wantnocode/pen/BarGKpL)

还有`empty()`如果选择不包含（非空）元素，则返回 true,`nodes()`,`node()`... [参考D3-control-flow](https://github.com/d3/d3-selection#control-flow)

### Filtering , sorting selections 选择元素的筛选 排序

您可以使用 D3 的`.filter`方法过滤选择。第一个参数是一个函数，它返回`true`是否应该包含元素。过滤的选择由该`filter`方法返回，因此您可以继续链接选择方法。

在此示例中，您过滤偶数元素并将它们着色为橙色：

```
d3.selectAll('circle')
  .filter(function(d, i) {
    return i % 2 === 0;
  })
  .style('fill', 'orange');
```

![image-20220816100111200](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220816100111200.png)

> [在codepen中尝试编辑上面示例](https://codepen.io/wantnocode/pen/xxWQVgM)

您可以通过调用`.sort`和传入比较器函数对选择中的元素进行排序。比较器函数有两个参数，通常是`a`和`b`，它们代表被比较的两个元素的数据。如果比较器函数返回负数，`a`将放在前面`b`，如果是正数，`a`将放在后面`b`。

因此，如果您将以下数据加入到选择中：

```javascript
[
  {
    "name": "A",
    "score": 35
  },
  {
    "name": "B",
    "score": 40
  },
  {
    "name": "C",
    "score": 30
  }
];
```

您可以使用以下方式进行排序`score`：

```
  d3.selectAll('.person')
    .sort(function(a, b) {
      return b.score - a.score;
    });
```

![image-20220816100644393](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220816100644393.png)

![image-20220816100653868](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220816100653868.png)

> [在codepen中尝试编辑上面示例](https://codepen.io/wantnocode/pen/KKorzWy)
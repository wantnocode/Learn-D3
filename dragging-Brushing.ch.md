# D3-drag

D3 有一个用于向元素添加拖动行为的模块。拖动是将鼠标悬停在元素上，按下鼠标按钮，移动指针，然后释放鼠标按钮 进行移动元素。D3 的拖动模块也支持触摸手势。

> 如果日常开发中不需要为图表添加`drag`事件 那么本章不重要，可以跳过。

使 HTML/SVG 元素可拖动需要三个步骤：

- 通过`d3.drag()`创建**拖动行为**函数
- 添加一个在拖动事件发生时调用的事件处理程序。事件处理程序接收一个事件对象，您可以使用它来更新拖动元素的位置
- 将拖动行为附加到要使其可拖动的元素

调用`d3.drag()`会创建拖动行为：

```
let drag = d3.drag();
```

> 拖动行为是一种将事件侦听器添加到元素的函数。它也有方法，如在`.on`其上定义的。

`.on`您可以通过调用该方法将事件处理程序附加到拖动行为。这接受两个参数：

- 事件类型 ( `'drag'`,`'start'`或`'end'`)
- 事件处理函数的名称

```
function handleDrag(e) {
 // update the dragged element with its new position
}

let drag = d3.drag()
  .on('drag', handleDrag);
```

> 事件类型`'drag'`是`'start'`和`'end'`。`'drag'`表示拖拽。`'start'`指示拖动的开始（例如，用户按下了鼠标按钮）。`'end'`表示拖动结束（例如，用户已释放鼠标按钮）。

`handleDrag`接收单个参数`e`，该参数是表示拖动事件的对象。拖动事件对象有几个属性，其中最有用的是：

| 属性名称    | 描述                                                         |
| :---------- | :----------------------------------------------------------- |
| `.subject`  | 被拖动元素（或[后备对象](https://github.com/d3/d3-drag/tree/v3.0.0#drag_subject)）的连接数据 |
| `.x`&`.y`   | 被拖动元素的新坐标                                           |
| `.dx`&`.dy` | 被拖动元素的新坐标，相对于之前的坐标                         |

> [可以在官方文档](https://github.com/d3/d3-drag/tree/v3.0.0#drag-events)中查看拖动事件属性的完整列表。

如果拖动的元素是由[数据连接](https://www.d3indepth.com/datajoins)创建的，并且连接的数据具有`x`和`y`属性，则计算拖动事件对象的 和 属性，以保持元素和指针的`x`相对**位置**。（这可以防止元素的中心“捕捉”到指针位置。）否则和是**相对于被拖动元素的父元素**的指针位置。`y``x``y`

通过选择元素并将拖动行为传递给[`.call`方法]()，可以将拖动行为附加到元素。

例如向`circle`元素添加拖动行为：

```
d3.select('svg')
  .selectAll('circle')
  .call(drag);
```

> 拖动行为是一个在选定元素（上例中的每个元素）上设置事件侦听器的函数`circle`。当拖动事件发生时，事件处理程序（`handleDrag`在上面的例子中）被调用。

### 例子

在下面代码中，随机坐标数组与`circle`元素关联。

使用元素创建拖动行为`d3.drag()`并将其附加到`circle`元素 ( `initDrag`)。

当一个`circle`元素被拖动时，`handleDrag`被调用并且一个事件对象`e`作为第一个参数传入。`e.subject`表示被拖动元素的连接数据。连接数据的`x`和`y`属性更新为`e.x`和`e.y`。`update`然后调用以更新`circle`的位置。

```
let data = [], width = 600, height = 400, numPoints = 10;

let drag = d3.drag()
  .on('drag', handleDrag);

function handleDrag(e) {
  e.subject.x = e.x;
  e.subject.y = e.y;
  update();
}

function initDrag() {
  d3.select('svg')
    .selectAll('circle')
    .call(drag);
}

function updateData() {
  data = [];
  for(let i=0; i<numPoints; i++) {
    data.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height
    });
  }
}

function update() {
  d3.select('svg')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
    .attr('r', 40);
}

updateData();
update();
initDrag();

```

![drag](https://user-images.githubusercontent.com/32726183/199651629-952b4bd6-0dbe-4d0e-8840-52ea8a3f0275.gif)


>  https://codepen.io/wantnocode/pen/VwXgvwZ



## D3-Brushing

Brushing允许用户**指定一个区域**（通过按下鼠标按钮，移动鼠标，然后框选），例如，选择一组元素。

D3具有将`Brush`行为添加到一个元素（或多个元素）的模块。

将`Brush`行为添加到HTML或SVG元素有三个步骤：

- `call d3.brush()`创建**`Brush`**函数
- 添加一个事件触发时调用的`function(处理程序)`。`function`负责接收`Brush`范围，然后可以使用该范围选择元素，定义`Zoom`区域等。
- 将`Brush`行为添加到元素（或多个元素）

`call d3.brush()`创建`Brush`行为：

```
let brush = d3.brush();
```

> `Brush`行为是具有`.on`在其上定义的方法的函数。该函数本身将侦听器添加到元素以及其他元素（主要是`rect`元素），以呈现Brush范围。

`.on`可以通过调用该方法将事件处理程序附加到画笔行为。这接受两个参数：

- 事件类型（ `'brush','start','end'`)
- 处理程序函数`(function)`

```
function handleBrush(e) {
 // 得到了范围 可以进行选择元素
}

let brush = d3.brush()
  .on('brush', handleBrush);
```

> 事件类型`'brush'`是`'start'`和`'end'`。`'brush'`表示范围已更改。`'start'`表示Brush已经开始（例如用户按下了鼠标按钮）。`'end'`指示Brush的结束（例如，用户已松开了鼠标按钮）。

`handleBrush`接收单个参数`e`，该参数是表示画笔事件的对象。画笔事件中最有用的属性是将画笔`.selection`的范围表示为一个数组`[[x0, y0], [x1, y1]]`，其中`x0, y0`和`x1, y1`是画笔的对角。通常`handleBrush`会计算哪些元素在画笔范围内并相应地更新它们。

通过选择元素并将画笔行为传递给[`.call`方法]()，可以将画笔行为附加到元素：

```
d3.select('svg')
  .call(brush);
```

### 例子

在下面的示例中，使用`d3.brush()`创建`Brush`。使用`.on`方法将事件处理程序`handleBrush`添加到`Brush`交互行为。

`handleBrush`每当`Brush`开始（`'start'`事件类型）或范围改变（`'brush'`事件类型）时调用。

`Brush`通过`call`添加到`svg`元素上。

```
let brush = d3.brush()
  .on('start brush', handleBrush);

function handleBrush(e) {
  // Use the brush extent e.selection to compute, for example, which elements to select
}

function initBrush() {
  d3.select('svg')
    .call(brush);
}

initBrush();
```



请看下面完整的示例，通过`updateData`和`update`将一系列随机坐标连接到`circle`元素。当`brush`(鼠标光标)处于活动状态时，`brush`范围内的`circle`元素将变为红色。

`initBrush`初始化`brush`。

当`brush`触发时,`handleBrush`被调用。将接收一个`brush`事件对象(`下面的e`)，该对象具有`selection`定义`brush`范围的属性。然后将其保存到变量`brushExtent`中, 在调用`update`中使用。

`update`如果数据在`brushExtent`定义的范围内，则进行`data join`(将`circle`元素变成红色)：

```
let data = [], width = 600, height = 400, numPoints = 100;

let brush = d3.brush()
  .on('start brush', handleBrush);

let brushExtent;

function handleBrush(e) {
  brushExtent = e.selection;
  update();
}

function initBrush() {
  d3.select('svg g')
    .call(brush);
}

function updateData() {
  data = [];
  for(let i=0; i<numPoints; i++) {
    data.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height
    });
  }
}

function isInBrushExtent(d) {
  return brushExtent &&
    d.x >= brushExtent[0][0] &&
    d.x <= brushExtent[1][0] &&
    d.y >= brushExtent[0][1] &&
    d.y <= brushExtent[1][1];
}

function update() {
  d3.select('svg')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', 4)
    .style('fill', function(d) {
      return isInBrushExtent(d) ? 'red' : null;
    });
}

initBrush();
updateData();
update();
```
![Brush](https://user-images.githubusercontent.com/32726183/199651652-f3fe6a1e-367d-4489-b2e0-db2dba8443b1.gif)


> https://codepen.io/wantnocode/pen/WNzmRad

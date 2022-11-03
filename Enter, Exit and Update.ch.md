# D3 enter exit update

*本文展示了如何使用 D3 的进入和退出方法来实现对进入和退出元素行为的细粒度控制。这在处理过渡元素时特别有用。*

本章解释了如何额外控制 HTML 和 SVG 元素在创建、更新或删除时的行为方式。当您使用[过渡](https://www.d3indepth.com/transitions)并想要特定效果（例如元素淡入和淡出）时，它特别相关。

如果你是 D3 的新手，你可以安全地跳过这一章！

[数据连接](https://www.d3indepth.com/datajoins)章节中的示例以相同的方式更新 HTML/SVG 元素，无论它们是刚刚创建、已经在页面上还是即将被删除。

（刚刚创建的 HTML/SVG 元素被称为**进入**元素，即将被移除的元素被称为**退出**元素。）

在某些情况下，区别对待进入和退出元素很有用。在处理转换时尤其如此。例如，如果您希望新元素淡入，您需要将它们的初始不透明度设置为零。同样，如果您希望它们在被移除之前淡出，您需要在每个退出元素上设置一个过渡，以便它们的不透明度逐渐降低到零。

> D3 版本 4 及以下版本要求您使用选择`.enter`和`.exit`方法。然而，从版本 5 开始，该`.join`方法隐藏了进入和退出的复杂性。如果您仍在使用第 4 版，您仍然可以查看[有关 enter 和 exit 的原始章节](https://www.d3indepth.com/v4/enterexit/)。

您可以通过将函数传递给方法来区别对待进入和退出元素`.join`：

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

第一个、第二个和第三个函数分别命名为**enter**、**update**和**exit**函数。

每个函数都有一个参数::

- enter函数的参数`enter`是表示需要创建的元素的**enter selection**
- 更新函数的参数`update`是一个包含已经存在的元素的选择（并且没有退出）
- exit 函数的参数`exit`是**退出选择**，包含需要移除的元素

该`.join`方法返回一个包含**进入和现有元素**的选择（它不包含退出元素）。通常，您的大多数样式和属性更新都将遵循该`.join`方法。

请注意，进入、更新和退出函数**必须返回 selection**。

### 输入功能

通常，enter 函数必须将一个元素附加到 enter 选择的每个元素。（输入选择由代表需要添加的元素的“占位符”元素组成。）

例如：

```
.join(
  function(enter) {
    return enter.append('circle');
  }
)
```

这相当于`.join('circle')`.

您还可以调用常用的选择方法，例如`.style`和`.attr`输入选择。这允许您修改输入元素的样式和属性。

例如：

```
.join(
  function(enter) {
    return enter
      .append('circle')
      .style('opacity', 0);
  }
)
```

### 更新功能

更新功能是可选的，可以让您更新**已经存在**的元素。例如：

```
.join(
  function(enter) {
    return enter
      .append('circle')
      .style('opacity', 0);
  },
  function(update) {
    return update.style('opacity', 1);
  }
)
```

这会将输入圆圈的不透明度设置为零，将现有圆圈的不透明度设置为 1。

### 退出功能

**exit 函数是可选的，它处理需要移除的**HTML/SVG 元素。一般来说，您需要删除退出选择中的元素：

```
.join(
  function(enter) {
    return enter
      .append('circle')
      .style('opacity', 0);
  },
  function(update) {
    return update
      .style('opacity', 1);
  },
  function(exit) {
    return exit.remove();
  }
)
```

## 例子

如果您不使用过渡，则很少需要上述技术。但是，如果您使用过渡并且想要控制元素如何进入和退出页面，则需要上述技术。有关使用转换的示例，请参阅[转换](https://www.d3indepth.com/transitions)章节。

现在，为了帮助您理解，下面是一个将输入节点的不透明度设置为 0.25 的示例：

```
function getData() {
  let data = [];
  let numItems = Math.ceil(Math.random() * 5);

  for(let i=0; i<numItems; i++) {
    data.push(40);
  }

  return data;
}

function update(data) {
  d3.select('.chart')
    .selectAll('circle')
    .data(data)
    .join(
      function(enter) {
        return enter.append('circle')
          .style('opacity', 0.25);
      },
      function(update) {
        return update.style('opacity', 1);
      }
    )
    .attr('cx', function(d, i) {
      return i * 100;
    })
    .attr('cy', 50)
    .attr('r', function(d) {
      return 0.5 * d;
    })
    .style('fill', 'orange');
}

function updateAll() {
	let myData = getData();
	update(myData);
}

updateAll();

d3.select("button")
	.on("click", updateAll);
```

<iframe class="db center" src="https://www.d3indepth.com/examples-merged/datajoins/enter-exit/" marginwidth="0" marginheight="0" scrolling="yes" style="border: none; margin-top: 2em; display: block; margin-left: auto; margin-right: auto; width: 889.594px; height: 140px;"></iframe>

enter 函数将 a 附加`circle`到 enter 选择中的每个元素，并将其不透明度设置为 0.25。更新函数将现有圆的不透明度设置为1。方法后面的`.attr`和方法适用于进入和现有元素。`.style``.join`

现在刚刚进入页面的圆圈是假的，而已经存在的圆圈是实心的。

上面的示例并不能很好地代表您在实践中如何使用 enter、exit 和 update 函数。有关更具代表性的示例，请参见[转换](https://www.d3indepth.com/transitions)。
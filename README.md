# Learn-D3-Introduction
d3相关学习 包含简易demo

1. D3内部模块的深入讲解 有一个系统整体认知 
2. Analysis- examples 分析场景的例子
3. Observable D3团队分享示例的环境介绍 (待定)

> 第一点作为重点, 本系列会完整涵盖 D3 概念, 比如:选择、连接、数据请求、缩放函数、事件处理和转换。

## D3-Introduction
![image](https://user-images.githubusercontent.com/32726183/199635367-f20ab5c9-7d00-4830-b2fb-41f291da967f.png)
[D3.js](https://d3js.org/)是一个 JavaScript 库，用于在 Web 上创建**定制**的**交互式**图表。

*D3全称 Data-Driven Documents 3个D开头的单词也是它D3简写的由来。*

大多数图表库（例如:[Echarts](https://github.com/apache/echarts)）提供的都是现成的图表，而 D3 由很多**基础构建块**组成，可以使用这些构建块构建自定义图表或地图。
![image](https://user-images.githubusercontent.com/32726183/199635477-4f36dc67-040b-4614-b3af-3c9ecf05215e.png)


>  [在codepen中尝试编辑上面示例](https://codepen.io/wantnocode/pen/MWVNJwW?editors=1111)

使用 `echarts.js` 创建上面的条形图只需[几行代码](https://codepen.io/createwithdata/pen/axgoaQ),

但是使用**D3** 创建上面的图表就会复杂一些，因为它提供的方法更底层 (粒度更细一些)。并且需要有一些**JavaScript**, **HTML**, **SVG**和 **CSS**.的经验。

如果我们的需求只是标准条形图、折线图或饼图，应该考虑使用`Echarts`等库。但是，如果需要定制图表或有非常精确的需求，则应考虑 `D3js`。



## D3 的优势 功能到底有哪些？

- 非常受欢迎(上亿次的下载和上10万的star),社区活跃 有大量开发的资源( D3团队发布为主)。
- 超级灵活, 专注于图表组合的基础元素,例如`scales`,`shapes`。
- 提供数据驱动修改HTML 和 SVG 元素 。
- 各种标准数据加载 数据处理（例如 CSV 数据）。
- 生成复杂图表的助手，例如树形图、网络图。
- 在不同图表状态之间制作动画的强大转换效果。(非常多的内置函数)
- 强大的用户交互支持，包括平移、缩放和拖动。



## D3 内部到底有哪些模块？ 
![image](https://user-images.githubusercontent.com/32726183/199635490-5233ce32-d3bf-43f0-a52f-a9619ab1c924.png)

上面就是`D3`所有的`repositories`(仓库), 大概分为几类:

- 经常使用的, 基础的(带五角星的,本系列也会讲解)。例如: `shapes` `selection`
- 工具类的 例如: `time format timer`
- 废弃的 很长时间不更新的。`bundler  request`

> 注意本系列不会涉及到源码的讲解。 后续如果有需要会补充。



## 本系列contents(内容)


![image](https://user-images.githubusercontent.com/32726183/199635507-e0571aa8-c214-49b3-92f5-b0fd55ef6e01.png)


上面就是本系列内容的大纲, 简单拿几个展开说说:

**Selection & data joins**

`Selection`支持以**数据驱动的**方式添加、删除和修改 `HTML` 和 `SVG `元素。。包含了非常多函数对元素的处理，例如:`selecting Elements` , `modifying Elements` ...

`data joins`支持将数据与元素进行绑定(也就是数据连接)。 

都是D3的基础模块。



**data requests**

可以帮助从给定的 URL 请求文件并将文件数据转换为 JavaScript 数组 例如(CSV)。使得后面处理真实数据变得非常容易。

支持CSV JSON TXT非常多的格式。



**force layout**

通过特定物理规则模拟，帮助我们特定方式展示元素信息。提供现成的内置力函数,并且支持拓展。

![image](https://user-images.githubusercontent.com/32726183/199635526-cc3e195f-8c9a-42fb-a325-bbf092b70780.png)


**transitions**

`transitions`可以在不同图表状态平滑转换,制作动画。例如，有一些`circle`元素, 当用户点击`update data`时 平滑过渡到新的坐标位置。为图表增加了视觉吸引力。

![6c98e31c0e24358988942c787c79282f535e03788fa4482978f3c2d8a41f100ea740763315cc3c526724204a30ddea7cca6d5db8e2076b03c97ad2886d1279962f77d976d4f6f39750d512c331276b3ea9a7428848d7758b5978d8b1baf007488f76600a386bcc5c71816352c24e8e1](https://user-images.githubusercontent.com/32726183/199635756-65787cba-6038-4c92-980d-dbf3a60aae1d.gif)



# 最后

D3一直以来都是JavaScript最重要的数据可视化库之一，在创建者`Mike Bostock`的维护下，前途无量，至少现在没有**能打**的。换句话说 学习数据可视化过程中, 即便出发点不同 无论是渲染库，算法库,  工具类库 甚至工程架构。 D3这座大山是必须攀登的。

然后当您读到这里说明对上面的内容很感兴趣 那么让我们开始具体模块的学习吧。


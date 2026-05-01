# 介绍

[`Snap Ui`](https://snap-ui.cn) 是一款基于uniapp vue3的一款拖拽排序组件，该组件支持`H5、微信小程序拖拽排序`，同时支持拖拽元素的`增`、`删`、`固定`，以及`触底自动滚动`、`长按拖拽`、`API拖拽`、`单列或多列拖拽`等功能，并且具有`高自由度`、`高性能`、`体积小`、`无外部依赖`等特点。
本组件打包后大小仅有`16kb`，且无繁杂外部依赖或配置，安装即用。

## 扫码体验
<img src="http://snap-ui.cn/assets/erweima.Cyz-nWQI.png" alt="小程序二维码" width="200" style="margin-left: 0;"/>

# 基本用法
[查看文档](https://snap-ui.cn)，基本的拖拽排序代码，复制运行后可直观的看到效果，复杂样式直接自己需求编写item样式即可

## 长按拖拽
`v-model`绑定需拖拽集合，`columns`为集合显示列数，`item-height`为拖拽元素高度 单位是`px`，`item-margin`为元素之间的空隙，`custom-class`为自定义item的class，同时绑定了`@start、@update、@end`事件，分别在拖拽开始时、拖拽发生改变时、拖拽结束时触发。

 >`v-model`绑定的对象数组内需包含唯一标识，默认为id，如需更换则指定`item-key`即可。

```html
<template>
	<su-drag
		v-model="dataList"  
		:columns="4" 
		:item-height="100"
		item-margin="2px"
		custom-class="custom-class"
		@start="start"
		@update="update"
		@end="end"
	>
		<template #default={data}>
			{{data.name}}
		</template>
	</su-drag>
</template>
<script setup>
	import { ref, watch } from 'vue';
	
	const dataList = ref([
		{id: 1, name: 'a'},
		{id: 2, name: 'b'},
		{id: 3, name: 'c'},
		{id: 4, name: 'd'},
		{id: 5, name: 'e'},
		{id: 6, name: 'f'},
		{id: 7, name: 'g'},
		])

	function start(event, index) {
		console.log("start", event, index);
	}
	function update(event, index) {
		console.log("update", event, index);
		
	}
	function end(event, index) {
		console.log("end", event, index);
	}
</script>
<style lang="scss" scoped>
	:deep() {
		.custom-class {
			background-color: greenyellow;
			text-align: center;
			line-height: 100px;
		}
	}
</style>
```

## API控制拖拽
添加	`touch-dragging`调整为触摸拖拽，然后可通过	`switchDragging()`方法可实时控制拖拽的开启与关闭

```html
<template>
	<view style="margin: 10px; display: flex; align-items: center; justify-content: space-around;">
		<text style="font-size: 18px;">API启用/关闭拖拽: </text>
		<button v-if="dragging" type="warn" @click="triggerDrag(false)" size="mini">关闭拖拽</button>
		<button v-else type="primary" @click="triggerDrag(true)" size="mini">开启拖拽</button>
	</view>
	
	<su-drag ref="sudrag"
		v-model="dataList"  
		:columns="4" 
		:item-height="100"
		item-margin="2px"
		custom-class="custom-class"
		touch-dragging
	>
		<template #default={data}>
			{{data.name}}
		</template>
	</su-drag>
</template>
<script setup>
	import { ref, watch } from 'vue';
	const dragging = ref(false)
	const sudrag = ref(null)
	
	const dataList = ref([
		{id: 1, name: 'a'},
		{id: 2, name: 'b'},
		{id: 3, name: 'c'},
		{id: 4, name: 'd'},
		{id: 5, name: 'e'},
		{id: 6, name: 'f'},
		{id: 7, name: 'g'},
	])
		
	function triggerDrag(value) {
		dragging.value = value
		sudrag.value?.switchDragging(value)
	}
</script>
<style lang="scss" scoped>
	:deep() {
		.custom-class {
			background-color: greenyellow;
			text-align: center;
			line-height: 100px;
		}
	}
</style>
```

## 固定元素
对象内包含`fixed`且等于`true`时，该元素会固定不可拖拽，且不与其他元素交换位置
```javascript
const dataList = ref([
	{id: 1, name: 'a', fixed: true},
	{id: 2, name: 'b'},
	{id: 3, name: 'c'},
	{id: 4, name: 'd'},
	{id: 5, name: 'e'},
	{id: 6, name: 'f', fixed: true},
	{id: 7, name: 'g'},
])
```

## 新增/删除元素
通过`deleteItem`与`addItem`API删除或新增元素，不可直接增删数组内元素

>`deleteItem`删除元素并非物理删除，只是给删除元素标记了`delete: true`，如果您的`dataList`在别处用到时注意过滤

```javascript
function deleteItem() {
	// sudrag.value?.deleteItem(2)
	sudrag.value?.deleteItem([2, 3])
}

function addItem(){
	sudrag.value?.addItem({id: Math.max(...dataList.value.map(item => item.id)) + 1, name: "新增"})
}
```
## Attributes

|   参数   |   说明   |   类型   |   默认值   |   备注   |
| ---- | ---- | :--- | ---- | ---- |
|   v-model   |   拖拽元素集合   |   Array   |   -   |      |
|   columns   |   列数   |   Number   |   0   |      |
|   item-height   |   元素高度   |   Number   |   0   |   单位px，不传则高度由内容撑开   |
|   item-key   |   元素唯一标识字段   |   String   |   id   |      |
| item-margin | 元素间距 | String | 0px |  |
|   sort-field   |   排序字段（排序时操作的字段）   |   String   |   sort   |      |
| custom-class | 拖拽元素class类 | String | - |  |
| custom-after-class | 拖拽元素后插槽class类 | String | - |  |
| custom-drag-class | 元素触发拖拽时的class类 | String | - |  |
| custom-fixed-class | 固定元素的class类 | String | - |  |
| touch-dragging | 关闭长按拖拽<br />使用API控制拖拽开启/关闭 | Boolean | false |  |
| scrolling-threshold | 拖拽触底/触顶滚动阈值 | Number | 85 | 单位px |

## Events

| 事件名称      | 说明                     | 参数         |
| ------------- | ------------------------ | ------------ |
| start         | 拖拽开始时               | event, index |
| update        | 元素位置发生改变时       | event, index |
| end           | 拖拽结束时               | event, index |
| height-change | 拖拽父元素高度发生改变时 | wrapHeight   |

## Slot

|   name   | 说明 |
| ---- | ---- |
| default | 默认插槽default={data}，data为当前元素里的数据 |
| after | 最后一个拖拽元素后的自定义内容，通常可用于放添加按钮 |

## API方法

| 方法名         | 参数          | 说明                                                         |
| -------------- | ------------- | ------------------------------------------------------------ |
| addItem        | {}            | 添加的元素对象                                               |
| deleteItem     | [1, 2] \| 1   | 需删除元素唯一标识/唯一标识数组                              |
| init           | -             | 重新初始化拖拽元素位置信息，在su-drag上方，如有高度不固定的元素，需在上方元素高度变化后调用该方法，重新获取位置信息 |
| switchDragging | true \| false | 开启\|关闭拖拽，长按拖拽模式下不生效                         |

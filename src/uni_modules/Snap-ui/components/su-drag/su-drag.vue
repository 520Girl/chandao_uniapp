<template>
	<!-- #ifdef H5 -->
	<view class="wrap-drag"
		:style="{ height: wrapHeight + 'px'}" 
	 >
		<view
			class="item" 
			:class="item.fixed?customFixedClass:''" 
			v-for="(item, index) in dataList"
			:data-index="index"
			:style="{ width: 100 / columns + '%', height: itemHeight ? itemHeight + 'px' : 'undefined', transform:  'translate3d(' + (item[sortField] % baseData.columns * 100) + '%,' + (Math.floor(item[sortField] / baseData.columns) * 100) + '%, 0)', position: 'absolute', transition: 'transform 0.20s', display: item.delete ? 'none' : ''}"
			:key="item[itemKey]" 
			@touchstart="longpress($event, index)"
			@touchmove="touchmove($event, index)"
			@touchend="touchend($event, index)"
			
			@mousedown="longpress($event, index)"
			@mousemove="touchmove($event, index)"
			@mouseup="touchend($event, index)"
			>
			<view style="width: 100%; height: 100%; box-sizing: border-box; " :style="{padding: itemMargin}">
				<view style="width: 100%; height: 100%;" :class="customClass">
					<slot :data="item"></slot>
				</view>
			</view>
		</view>
		<view
			class="item" 
			v-if="slots.after"
			:style="{ width: 100 / columns + '%', height: itemHeight ? itemHeight + 'px' : 'undefined', transform:  'translate3d(' + (activeDataListCount % baseData.columns * 100) + '%,' + (Math.floor(activeDataListCount / baseData.columns) * 100) + '%, 0)'}"
			>
			<view style="width: 100%; height: 100%; box-sizing: border-box; " :style="{padding: itemMargin}">
				<view style="width: 100%; height: 100%;" :class="customAfterClass">
					<slot name="after"></slot>
				</view>
			</view>
		</view>
	</view>
	<!-- #endif -->
	<!-- #ifndef H5 -->
	<view class="wrap-drag" 
		:style="{ height: wrapHeight + 'px'}" 
		:baseData="baseData"
		:change:baseData="ux.baseDataObserver"
		:list="dataList"
		:change:list="ux.listObserver"
		:scrollPositionTo="scrollPositionTo"
		:change:scrollPositionTo="ux.scrollPositionToChange"
		:draggingItem="draggingItem"
		:change:draggingItem="ux.draggingItemChange"
	 >
	 
		<view
			:style="`width: ${100 / columns}%; height: ${itemHeight ? itemHeight + 'px' : 'undefined'}; ${item.delete?'display: none;':''}`"
			class="item" 
			:class="item.fixed?customFixedClass:''"  
			v-for="(item, index) in dataList"
			:data-index="index"
			:key="item[itemKey]" 
			:d="d" 
			@longpress="ux.touchstart"
			@touchstart="ux.touchstart"
			:catchtouchmove="d?ux.touchmove:''"
			@touchend="ux.touchend"
		>
			<view style="width: 100%; height: 100%; box-sizing: border-box;" :style="{padding: itemMargin}">
				<view style="width: 100%; height: 100%;" :class="customClass">
					<slot :data="item"></slot>
				</view>
			</view>
		</view>
		<view
			class="item" 
			v-if="slots.after"
			:style="{ width: 100 / columns + '%', height: itemHeight ? itemHeight + 'px' : 'undefined', transform:  'translate3d(' + (activeDataListCount % baseData.columns * 100) + '%,' + (Math.floor(activeDataListCount / baseData.columns) * 100) + '%, 0)'}"
			>
			<view style="width: 100%; height: 100%; box-sizing: border-box; " :style="{padding: itemMargin}">
				<view style="width: 100%; height: 100%;" :class="customAfterClass">
					<slot name="after"></slot>
				</view>
			</view>
		</view>
	</view>
	<!-- #endif -->
</template>
<!-- #ifndef H5 -->
<script src="./index.wxs" lang="wxs" module="ux"></script>
<!-- #endif -->

<script setup>
	
	import { computed, ref, watch, getCurrentInstance, onMounted, useSlots  } from 'vue';
	const props = defineProps({
		columns: {type: Number, default: 5}, 
		itemHeight: {type: Number, default: 0}, 
		scrollingThreshold: {type: Number, default: 85}, 
		itemKey: {type: String, default: 'id'}, 
		sortField: {type: String, default: 'sort'},
		itemMargin: {type: String, default: '0'},
		customClass: {type: String, default: ''},
		customAfterClass: {type: String, default: ''},
		customDragClass: {type: String, default: ''},
		customFixedClass: {type: String, default: ''},
		touchDragging: {type: Boolean, default: false},
	})
	const dataList = defineModel({type: Array, required: true})
	const activeDataListCount = computed(() => dataList.value.filter(item => !item.delete).length)
	const scrollPosition = defineModel('scrollPosition', {type: Number, required: false, default: 0})
	const emit = defineEmits(['start', 'update', 'end', 'height-change'])
	
	const systemInfo = uni.getWindowInfo();
	dataList.value = dataList.value.map((item, index) => {
		let obj = {...item}
		obj[props.sortField] = obj[props.sortField] === undefined || obj[props.sortField] === null ? index : obj[props.sortField]
		return obj
	})
	const slots = useSlots();
	
	
	const baseData = ref({
		columns: props.columns,
		sortField: props.sortField,
		windowHeight: systemInfo.windowHeight,
		customDragClass: props.customDragClass,
		touchDragging: props.touchDragging,
		scrollingThreshold: props.scrollingThreshold,
		dragging: false
	})
	const wrapHeight = computed(() => Math.ceil((activeDataListCount.value + (slots.after ? 1 : 0)) / props.columns) * baseData.value.itemHeight)
	watch(wrapHeight, () => {
		setTimeout(() => {
			emit('height-change', wrapHeight.value)
		}, 0)
	})
	// const dragging = ref(true)
	//#ifndef H5
	const d = ref({value: true})
	function vibrateShort() {
		uni.vibrateShort();
	}
	//#endif
	//#ifdef H5
	const fixedItemSort = computed(() => dataList.value.filter(item => item.fixed).map(item => item[props.sortField]))
	const d = ref({value: false})
	//#endif
	
	const draggingItem = ref({index: 0, endDraggingTime: 0})
	
	function addItem(item) {
		//#ifndef H5
		d.value.value = true
		//#endif
		let obj = {...item}
		obj[props.sortField] = activeDataListCount.value
		dataList.value.push(obj)
	}
	
	function deleteItem(deleteIdList) {
		if (!(deleteIdList instanceof Array))
			deleteIdList = [deleteIdList]
		dataList.value.forEach((item, index) => {
			if (deleteIdList.includes(item[props.itemKey]))
				item.delete = true
		})
		
		const activeItems = dataList.value.filter(item => !item.delete)
			.sort((a, b) => a[props.sortField] - b[props.sortField])
		    .map((item, index) => {
				item[props.sortField] = index
				return item;
			});
		dataList.value.forEach((item, index) => {
			if (!item.delete)
				item[props.sortField] = activeItems.find(active => active.id === item.id)[props.sortField]
		})			
	}
	
	function switchDrag({value}) {
		d.value.value = !!value
		value && vibrateShort()
	} 
	//#ifndef H5
	function touchend({data, index}) {
		draggingItem.value.index = index
		draggingItem.value.endDraggingTime = Date.now()
		dataList.value = data
	}
	//#endif
	
	const instance = getCurrentInstance()
	const query = uni.createSelectorQuery().in(instance);
	let scrollTop = 0
	query.selectAll('.wrap-drag .item').fields({
		rect: true,
		size: true
	}, data => {
		baseData.value.itemWidth = data[0].width
		baseData.value.itemHeight = data[0].height
		baseData.value.left = Math.min(...data.map(item => item.left))
		baseData.value.top = Math.min(...data.map(item => item.top)) + scrollTop
	});

	function init() {
		uni.createSelectorQuery()
			.selectViewport()
		   .scrollOffset((res) => {
			 scrollTop = res.scrollTop
			 query.exec(); //执行所有请求
		   }).exec();
	}
	let scrollSetIntervalId = 0
	const scrollPositionTo = ref(0)
	//#ifndef H5
	function scrollWindow(params) {
		const mf = Math.min(Math.max(75, baseData.value.itemHeight), 300)
		const startScrollPosition = params.data
		if(scrollSetIntervalId) return;
		scrollPositionTo.value = Number(startScrollPosition)
		scrollSetIntervalId = setInterval(() => {
			scrollPositionTo.value += mf
			// scrollPositionTo.value += 10
			if (scrollPositionTo.value > wrapHeight.value + baseData.value.top)
				scrollPositionTo.value = Number(wrapHeight.value + baseData.value.top)
			if (scrollPositionTo.value > 0 && startScrollPosition < 0)
				scrollPositionTo.value = 0
			uni.pageScrollTo({
			  scrollTop: Math.abs(scrollPositionTo.value),
			  duration: 200 + mf - 75
			});
			if (scrollPositionTo.value >= wrapHeight.value + baseData.value.top - baseData.value.windowHeight || scrollPositionTo.value == 0 || (scrollPositionTo.value < 0 && Math.abs(scrollPositionTo.value) <= baseData.value.top)) {
				clearInterval(scrollSetIntervalId)
				scrollSetIntervalId = 0
			}
		}, 500 + (mf - 75) * 2)
	}
	function triggerEmit({name, event, index}) {
		emit(name, event, index);
	}
	// #endif
	// #ifdef H5
	let animationFrameId = null;
	function scrollWindow(params) {
		var startScrollPosition = params.data
		if(scrollSetIntervalId) return;
		scrollPositionTo.value = Number(startScrollPosition)
		scrollPositionTo.value += 3
		if (scrollPositionTo.value > wrapHeight.value + baseData.value.top)
			scrollPositionTo.value = Number(wrapHeight.value + baseData.value.top)
		if (scrollPositionTo.value > 0 && startScrollPosition < 0)
			scrollPositionTo.value = 0
		uni.pageScrollTo({
		  scrollTop: Math.abs(scrollPositionTo.value),
		  duration: 0
		});
		touchmove(moveEvent, moveIndex, scrollPositionTo.value)
		animationFrameId = requestAnimationFrame(() => scrollWindow({data: scrollPositionTo.value}));
		if (scrollPositionTo.value >= wrapHeight.value + baseData.value.top - baseData.value.windowHeight || scrollPositionTo.value == 0 || (scrollPositionTo.value < 0 && Math.abs(scrollPositionTo.value) <= baseData.value.top)) {
			cancelAnimationFrame(animationFrameId);
		}
	}
	// #endif
	
	function stopScrollWindow() {
		// #ifdef H5
		cancelAnimationFrame(animationFrameId);
		// #endif
		clearInterval(scrollSetIntervalId)
		scrollSetIntervalId = 0
	}
	
	
	// #ifdef H5
		let translatePageX, translatePageY, moveEvent, historySort, moveIndex;
		let isScroll = false
		function isOutRange(x1, y1, x2, y2, x3, y3) {
		  return x1 < 0 || x1 >= y1 || x2 < 0 || x2 >= y2 || x3 < 0 || x3 >= y3
		}
		let timeOutEvent = 0
		function longpress(event, index) {
			timeOutEvent && clearTimeout(timeOutEvent)
			timeOutEvent = setTimeout(() => {
				if (!baseData.value.touchDragging)
					event.type = 'longpress'
				touchstart(event, index)
			}, baseData.value.touchDragging ? 0 : 500)
		}
		
		function touchstart(event, index) {
			if ((baseData.value.touchDragging && !baseData.value.dragging) || 
				(!baseData.value.touchDragging && (event.type === 'touchstart' || event.type === 'mousedown')) ||
				dataList.value[index].fixed
			) 
				return;
			emit('start', event, index)
			d.value.value = true
			//开启拖拽
			const instance = event.instance
			const touches = event.changedTouches[0]
			if (!touches) return
			instance.addClass("drag-item " + props.customDragClass)
			let translateX = touches.clientX - (baseData.value.itemWidth / 2 + baseData.value.left)
			const translateY = touches.clientY - (baseData.value.itemHeight / 2 + baseData.value.top) + systemInfo.windowTop + baseData.value.top
			translatePageX = touches.pageX - (baseData.value.itemWidth / 2 + baseData.value.left)
			translatePageY = touches.pageY - (baseData.value.itemHeight / 2 + baseData.value.top)
			if (baseData.value.columns == 1)
				translateX = translatePageX = 0
			instance.setStyle({
			  'transform': 'translate3d(' + translateX + 'px,' + translateY +'px, 0)',
			  "position": 'fixed'
			})
		}
		function touchmove(event, index, scrollPositionToArg) {
			if(!d.value.value) {
				timeOutEvent && clearTimeout(timeOutEvent)
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			moveEvent = event
			moveIndex = index
			const instance = event.instance
			const touches = event.changedTouches[0]
			let translateX = touches.clientX - (baseData.value.itemWidth / 2 + baseData.value.left)
			const translateY = touches.clientY - (baseData.value.itemHeight / 2 + baseData.value.top) + systemInfo.windowTop + baseData.value.top
			translatePageX = touches.pageX - (baseData.value.itemWidth / 2 + baseData.value.left)
			if (baseData.value.columns == 1)
				translateX = translatePageX = 0
			if (scrollPositionToArg !== undefined && scrollPositionToArg !== null && scrollPositionToArg < 0)
				touches.pageY -= 3
			if (scrollPositionToArg !== undefined && scrollPositionToArg !== null && scrollPositionToArg > 0)
				touches.pageY += 3
			translatePageY = touches.pageY - (baseData.value.itemHeight / 2 + baseData.value.top)
			if (touches.clientY < baseData.value.scrollingThreshold && touches.pageY !== touches.clientY && !isScroll) {
				isScroll = true
				scrollWindow({data: (touches.pageY - touches.clientY) * -1})
			} else if (touches.clientY > baseData.value.windowHeight - baseData.value.scrollingThreshold && !isScroll) {
				isScroll = true
				scrollWindow({data: touches.pageY - touches.clientY})
			} else if ((touches.clientY <= baseData.value.windowHeight - baseData.value.scrollingThreshold && touches.clientY >= baseData.value.scrollingThreshold) && isScroll) {
				isScroll = false
				stopScrollWindow()
			}
			
			instance.setStyle({
			  'transform': 'translate3d(' + translateX + 'px,' + translateY +'px, 0)',
			  'width': baseData.value.itemWidth +'px',
			  "position": 'fixed'
			})
			const currentX = Math.round(translatePageX / baseData.value.itemWidth)
			const currentY = Math.round(translatePageY / baseData.value.itemHeight)
			let endSort = currentX + baseData.value.columns * currentY
			// X轴或者Y轴超出范围则返回
			if (isOutRange(currentX, baseData.value.columns, currentY, Math.ceil(activeDataListCount.value / baseData.value.columns), endSort, activeDataListCount.value)) return
			const currentSort = dataList.value[index][props.sortField]
			if (historySort == endSort)
				return;
			historySort = endSort
			emit('update', event, index)
			dataList.value[index][props.sortField] = endSort
			//移动方向
			const fx = endSort > currentSort ? -1 : 1
			dataList.value.forEach((item, itemIndex) => {
				if (itemIndex !== index && ((item[props.sortField] >= currentSort && item[props.sortField] <= endSort) || (item[props.sortField] <= currentSort && item[props.sortField] >= endSort)) && !item.fixed) {
					let sort = item[props.sortField] + fx
					if (fixedItemSort.value.includes(sort))
						sort += fx
					item[props.sortField] = sort
				}
			})
		}
		
		function touchend(event, index) {
			clearTimeout(timeOutEvent)
			stopScrollWindow()
			isScroll = false
			if (!d.value.value) return;
			d.value.value = false;
			historySort = -1;
			const touches = event.changedTouches[0]
			event.instance.removeClass("drag-item " + props.customDragClass)
			event.instance.setStyle({'transform': 'translate3d(' + translatePageX + 'px,' + translatePageY +'px, 0)', transition: 'none !important'});
			emit('end', event, index)
			setTimeout(() => {
				event.instance.setStyle({});
			}, 0)
		}
		
	// #endif
	
	onMounted(() => {
		init()
	})
	
	const switchDragging = (value) => {
		//开启触摸拖拽
		if (!props.touchDragging) return;
		baseData.value.dragging = Boolean(value)
	}
	
	// #ifdef H5
	defineExpose({
		switchDrag,
		touchend,
		scrollWindow,
		stopScrollWindow,
		switchDragging,
		addItem,
		deleteItem,
		init
	});
	// #endif
	// #ifndef H5
	defineExpose({
		switchDrag,
		touchend,
		scrollWindow,
		stopScrollWindow,
		switchDragging,
		vibrateShort,
		triggerEmit,
		addItem,
		deleteItem,
		init
	});
	// #endif
	
</script>
<style scoped lang="scss">
	.wrap-drag {
		position: relative;
		.item {
			position: absolute;
			top: 0;
			left: 0;
			transition: transform 0.20s !important;
		}
		.drag-item {
			transition: none !important;
			z-index: 999 !important;
		}
	}
</style>
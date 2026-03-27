

<template>
    <view class="flex flex-col min-h-screen pb-24 animate-in fade-in duration-500 theme-bg">
        <!-- <view class="mesh-gradient-1 serene-flow-bg "></view> -->
        <HomeBar title="云息空间" description="极 简 禅 意" :leftIcon="'icon-bell'" :messageCount="3"  titleIcon="icon-Cloudy" :handleClick="goProfile" />
        
        <!-- <view class="flex items-center justify-between px-6 pt-10 pb-4">
            <view class="flex items-center gap-4">
                <view
                    class="w-12 h-12 rounded-   full bg-white/50 flex items-center justify-center border border-[#d4af35]/10 shadow-sm">
                    <UserIcon class="text-[#d4af35]" :size="24" />
                </view>
                <view>
                    <view class="text-xl font-bold tracking-tight flex items-center gap-2">
                        <Cloud class="text-[#d4af35]" :size="20" />
                        云息空间
                    </view>
                    <view class="text-[20rpx] uppercase tracking-[0.2em] theme-color-8">极 简 禅 意</view>
                </view>
            </view>
        </view> -->
        <view class="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-6">
            <view class="absolute w-80 h-80 rounded-full blur-3xl" />
            <view class="relative z-10 text-center space-y-12">
                <view
                    class="w-56 animate-pulse h-56 mx-auto rounded-full border-2 border-[#d4af35]/10 flex items-center justify-center relative animate-bounce-slow">
                    <view class="absolute inset-4 rounded-full bg-[#d4af35]/5" />
                    <text class="iconfont icon-wind theme-color-1 text-[128rpx]" />
                </view>
                <view class="space-y-4">
                    <view class="text-2xl font-light tracking-[0.2em] animate-bounce">吸气，云卷</view>
                    <view class="text-sm text-[#d4af35]/60 italic tracking-widest animate-bounce">呼气，云舒</view>
                </view>
            </view>
        </view>
        <view class="px-6 space-y-6 mt-8">
            <view class="text-[28rpx] font-bold uppercase tracking-widest theme-color-8 px-2">场景化冥想</view>
            <view class="flex gap-6 overflow-x-auto pb-10 pt-2 px-2 snap-x no-scrollbar">
                <view v-for="(item,index) in activeList" :key="index"
                    class="relative flex-shrink-0 w-[85%] h-64 cloud-card shadow-2xl shadow-indigo-900/10 snap-center overflow-hidden">
                    <view
                        :class="item.bgClass" class="absolute inset-0 bg-gradient-to-tr to-transparent z-0" >
                    </view>
                    <view
                       :class="'bg-[url(\''+ item.imgUrl +'\')]'"class="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay">
                    </view>
                    <view class="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                        <view class="mb-3">
                            <text
                                :class="item.btnClass" class="px-3 py-1 rounded-full  text-[20rpx] font-medium tracking-widest border border-white/20">
                                {{ item.endTime }}</text>
                        </view>
                        <view :class="item.h2Class" class="text-2xl font-medium mb-3 tracking-tight ">{{ item.title }}</view>
                        <view :class="item.spanClass" class="text-xs leading-relaxed font-light mb-6">{{ item.subtitle }}</view>
                        <view class="flex items-center justify-between">
                            <button
                                @click="startMeditation(item)"
                                class="px-[48rpx] py-[20rpx] bg-theme-1 text-white rounded-full text-[20rpx] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 backdrop-blur-sm">
                                开启心流
                            </button>
                            <view class="text-[20rpx] text-white/40 tracking-widest">{{ item.totalTime }}</view>
                        </view>
                    </view>
                </view>
                <view 
                    class="relative flex-shrink-0 w-[85%] h-64 cloud-card shadow-2xl shadow-indigo-900/10 snap-center overflow-hidden">
                    <view
                        class="absolute inset-0 bg-gradient-to-tr from-indigo-950/100 via-slate-10/60 to-transparent z-0">
                    </view>
                    <view
                        class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532767153582-b1a0e5145009')] bg-cover bg-center opacity-30 mix-blend-overlay">
                    </view>
                    <view class="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                        <view class="mb-3">
                            <text
                                class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl  text-[20rpx] font-medium tracking-widest border border-white/20">
                                22:00
                                今晚</text>
                        </view>
                        <view class="text-2xl font-medium mb-3 tracking-tight text-white">深夜觉察</view>
                        <view class="text-xs text-white/60 leading-relaxed font-light mb-6">静坐于此，观照情绪如深夜之云悄然飘过。</view>
                        <view class="flex items-center justify-between">
                            <button
                                class="px-[48rpx] py-[10rpx] bg-theme-1 text-white rounded-full text-[20rpx] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 backdrop-blur-sm">
                                开启心流
                            </button>
                            <view class="text-[20rpx] text-white/40 tracking-widest">12 MINS</view>
                        </view>
                    </view>
                </view>
                <view
                    class="relative flex-shrink-0 w-[85%] h-64 cloud-card shadow-2xl shadow-orange-900/5 snap-center overflow-hidden">
                    <view class="absolute inset-0 bg-gradient-to-br from-amber-50/100 via-orange-100/60 to-white/10 z-0">
                    </view>
                    <view
                        class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8')] bg-cover bg-center opacity-20 mix-blend-multiply">
                    </view>
                    <view class="absolute inset-0 p-8 flex flex-col justify-end z-10">
                        <view class="mb-3">
                            <text
                                class="px-3 py-1 rounded-full bg-theme-10 theme-color-1 text-[20rpx] font-medium tracking-widest border border-primary/10">08:00
                                清晨</text>
                        </view>
                        <text class="text-2xl font-medium mb-3 tracking-tight text-[#4a4538]">晨间安宁</text>
                        <text
                            class="text-xs text-[#1a170f]/80 leading-relaxed font-light mb-6">旭日东升，呼吸之间，回归你本自具足的宁静。</text>
                        <view class="flex items-center justify-between">
                            <button
                                class="px-[48rpx] py-[10rpx] bg-theme-1 text-white rounded-full text-[20rpx] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 backdrop-blur-sm">
                                开启心流
                            </button>
                            <text class="text-[20rpx] text-[#918355]/60 tracking-widest">15 MINS</text>
                        </view>
                    </view>
                </view>
                <view
                    class="relative flex-shrink-0 w-[85%] h-64 cloud-card shadow-2xl shadow-blue-900/5 snap-center overflow-hidden">
                    <view class="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-white/40 to-transparent z-0">
                    </view>
                    <view class="absolute inset-0 p-8 flex flex-col justify-end z-10">
                        <view class="mb-3">
                            <text
                                class="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold tracking-widest border border-blue-500/10">12:00
                                午间</text>
                        </view>
                        <h3 class="text-2xl font-medium mb-3 tracking-tight text-[#4a4538]">午间小憩</h3>
                        <view class="text-xs text-[#1a170f]/80 leading-relaxed font-light mb-6">于白昼繁杂中，寻得一处内心清明之地。
                        </view>
                        <view class="flex items-center justify-between">
                            <button
                                class="px-[48rpx] py-[10rpx] bg-theme-1 text-white rounded-full text-[20rpx] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 backdrop-blur-sm">
                                开启心流
                            </button>
                            <text class="text-[20rpx] text-[#918355]/60 tracking-widest">5 MINS</text>
                        </view>
                    </view>
                </view>
                <!-- <view @click="onNavigate('meditation')"
                    class="relative flex-shrink-0 w-80 h-64 rounded-2xl overflow-hidden snap-center group cursor-pointer">
                    <image src="https://picsum.photos/seed/night/800/600"
                        class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer" />
                    <view
                        class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
                        <span
                            class="w-fit px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold mb-3">22:00
                            今晚</span>
                        <text class="text-xl font-bold mb-2">深夜觉察</text>
                        <view class="text-sm text-white/70 leading-relaxed font-light">静坐于此，观照情绪如深夜之云悄然飘过。</view>
                        <view class="mt-4 flex items-center gap-4">
                            <button
                                class="px-6 py-2 bg-[#d4af35] rounded-full text-black text-xs font-bold uppercase tracking-wider">开启心流</button>
                            <span class="text-xs text-white/50">12 mins</span>
                        </view>
                    </view>
                </view> -->
            </view>
        </view>
    </view>
</template>
<script setup lang="ts">
import { User as UserIcon, Cloud, Wind } from 'lucide-vue-next';
import HomeBar from '@/components/homeBar.vue';

defineProps<{
    onNavigate: (screen: any) => void;
}>();
// uni.setTabBarBadge({
//   index: 0,
//   text: '1'
// })
// 跳转个人中心
const goProfile = () => {
    uni.navigateTo({
        url: '/pages/message/index'
    })
}
const activeList = reactive([
    { id: 1, type:"dark" ,imgUrl:"https://images.unsplash.com/photo-1532767153582-b1a0e5145009",totalTime:"25 MINS",endTime:"22:00 今晚", title: '深夜觉察',url:"",subtitle:"静坐于此，观照情绪如深夜之云悄然飘过。", h2Class:"text-white",spanClass:"text-white/60", bgClass: 'from-indigo-950/100 via-slate-10/60', btnClass: 'bg-white/10 backdrop-blur-xl', icon: 'meditation' },
    { id: 2, type:"light" , imgUrl:"https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",totalTime:"15 MINS",endTime:"08:00 清晨", title: '晨间安宁',url:"",subtitle:"旭日东升，呼吸之间，回归你本自具足的宁静。",  h2Class:"text-[#4a4538]",spanClass:"text-[#1a170f]/80",  bgClass: 'from-amber-50/100 via-orange-100/60', btnClass: 'bg-theme-10 theme-color-1', icon: 'question' },
    { id: 3, type:"simple", imgUrl:"",totalTime:"5 MINS",endTime:"12:00 午间", title: '午间小憩',url:"",subtitle:"于白昼繁杂中，寻得一处内心清明之地。",  h2Class:"text-[#4a4538]",spanClass:"text-[#1a170f]/80",  bgClass: 'from-blue-50/50 via-white/40', btnClass: 'bg-blue-500/10 text-blue-600 ', icon: 'answer' },
]);

//开始禅修
const startMeditation = (item: any) => {
    console.log("开始禅修：", item);
    uni.switchTab({
        url: `/pages/index/meditation?scene=${item.type}`
    });
    // 这里可以添加实际的导航或功能逻辑
};
</script>
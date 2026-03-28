<template>
  <view class="flex flex-col min-h-screen theme-bg">
    <HomeBar :title="'云息社区'" description="安 定 共 修"  :leftIcon="'icon-shopping-bag'" :handleClick="gotoShop" />
    <view class="flex-1 px-4 py-6 space-y-8">
      <view class="text-center">
        <view class="text-[48rpx] font-bold mb-6">今日照见：________</view>
        <view class="relative max-w-[90%] mx-auto ">
          <input style="height:132rpx;min-height:auto;line-height:2;" v-model="content"
            class="w-full bg-white border border-theme-12 rounded-full  text-center italic text-[#d4af35]/60 shadow-sm"
            placeholder="分享你的内心天空..." />
          <view @click="onNavigate('publish-post')"
            class="absolute bg-theme-1 right-2 top-2 text-white w-[96rpx] h-[96rpx] rounded-full shadow-lg flex items-center justify-center">
            <!-- <Send :size="20" /> -->
            <text class="iconfont icon-send text-[48rpx] bg-theme-1 "></text>
          </view>
        </view>
      </view>

      <!-- 排行榜 -->
      <view class="mb-10 overflow-hidden">
        <view class="flex items-center justify-between mb-4 px-2" @click="goRank()">
          <view class="text-sm font-bold uppercase tracking-widest theme-color-1" >安宁指数榜</view>
          <text class="text-xs font-medium theme-color-8 flex items-center gap-1"><text
              class="icon-auto_awesome iconfont text-[28rpx]"></text> 关注内在成长</text>
        </view>
        <view class="flex items-center gap-4 overflow-x-auto pb-[32rpx] no-scrollbar">
          <view v-for="(item,index) in rankList" :key="index" class="flex flex-col items-center gap-2">
            <view :class="index === 0 ?'border-2 border-theme-1 shadow-[0_0_15px_rgba(212,175,53,0.3)]' :'border border-primary/20'"  class="relative p-[12rpx] rounded-full">
              <image alt="User" class="w-[90rpx] h-[90rpx] rounded-full object-cover"
                :src="item.imgUrl" mode="aspectFill" />
            </view>
            <span  :class="index === 0 ? 'theme-color-1' : 'theme-color-8'" class="text-[20rpx] font-bold ">{{ item.name }}</span>
          </view>
        </view>
      </view>
      <view class="space-y-6">
        <view v-for="(item,index) in communityList" :key="index" 
        :class="index % 2 === 0 ? 'bg-[#ffffff80] shadow-md' : 'bg-[#d4af350d] shadow-sm'"
          class=" border border-[#d4af35]/5 p-6 rounded-[2rem]  mb-6">
          <view class="flex items-center gap-3 mb-6">
            <image :src="`https://picsum.photos/seed/post${index}/100/100`"
              class="w-[90rpx] h-[90rpx] rounded-full border-2 border-theme-3" mode="aspectFill" />
            <view>
              <view class="text-sm font-bold">{{ item.nickname }}</view>
              <view class="flex items-center gap-1">
                <text class="text-[20rpx] theme-color-8 font-medium uppercase tracking-wider block">{{ item.desc }}</text>
                <text class="text-[30rpx] theme-color-2  iconfont italic" :class="item.type === 'active' ? 'icon-huodong text-[#53a7dadb]' : 'icon-pengyouquan text-[#e7302a]'"></text>
              </view>
            
            </view>
            <text class="iconfont text-[28rpx] theme-color-1 ml-auto" 
              :class="'icon-' + item.Mood"
            ></text>
          
          </view>
          <text
            class="theme-color-7 leading-relaxed mb-[32rpx] italic text-[30rpx] px-[16rpx] block"  @click="onNavigate(item)">“今日照见：<text class="theme-color-1">躁动</text>的情绪如云掠过静止的湖面，未曾触及水面分毫。”</text>
          <view class="flex items-center justify-between border-t border-[#d4af35]/5 pt-1">
            <view class="flex items-center gap-6" >
              <view class="flex items-center gap-1 " :class="index %2 === 1 ? 'theme-color-1' : 'theme-color-12'" >
                <text class="iconfont icon-heart-fill text-[35rpx] cloud-glow-active"></text>
                <text class="text-[24rpx] font-bold ">42 点亮</text>
              </view>
              <view class="flex items-center gap-1 theme-color-8" >
                <text class="iconfont icon-chat-bubble-1 text-[35rpx]"></text>
                <text class="text-[24rpx] font-medium">8 回响</text>
              </view>
            </view>
            <view class="flex flex-col items-center gap-1">
              <text class="text-[20rpx] text-[#d4af35]/40">2m ago</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { navigateTo } from '@/utils/navigation';
import HomeBar from '@/components/homeBar.vue';

const content = ref<string>("");
const rankList = ref([
  { name: '艾登', score: 98,imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfHJ-RCqeVenIKcaa_DXfaiFK1x6tE5jBXA1KGXw9kbn-X1d_j3uuKcGQZtXjFFC9XDPljtXPH_SFbPHkcDxh16ViWWBz51zdjNbtw-twWkwXjbJ_1-CGkzDqU7CV-rAqAOLT31LHrY6VHAoIZXhM4lf2zWHOZP2vy0wmeUSgBHBukvF_EOa3Di13qWNfZvEmj1Uf7fgza5nBlHwrf1QQRg6d7YcnEIFxTOQXwlgEKzyfbz0kFH5vbjdHdS_2lHzGvKH5BLG9znRrb' },
  { name: '莎拉', score: 95, imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi' },
  { name: '马库斯', score: 92, imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi' },
  { name: '埃琳娜', score: 90, imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi' },
  { name: '朱利安', score: 88, imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi' },
    { name: '朱利安', score: 88, imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi' },
      { name: '朱利安', score: 88, imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi' },
        { name: '朱利安', score: 88, imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi' },
          { name: '朱利安', score: 88, imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP1_Aew993r9KgMuODx_O8uK7CsvTOufMCHUaCw_-62lDjzoQIq4zYkX59lRl7l-sMXhzNGrZq1qrt8KtWxKdVn2oiqlcm4c4XToU5LJpvD0U1zOEMP3Z5A7bB9FZ-oITvty5YR9jcdtZrJJCyC0hmLCq_bGxRKG_n0p4xv7kJr-3GTvmFkJK-FkvpPH8-ZiNtt5nkq1oDlPTuxjKL_22740LQh1NYEe2ZsfC2S-u5ID7ufpCfXOcQAqB3Wg2YLH46cXOXaramk4Mi' },
])
const communityList = ref([
  { name: '静心禅修',Mood:'Raining',nickname:"校长",desc:"静坐24分钟后",type:'active', members: 1200,time: '2m ago',heart: 100,comment: 20, imgUrl: 'https://picsum.photos/seed/community1/200/200' },
  { name: '晨间觉察',Mood:'Sunny',nickname:"副校长",desc:"晨间觉察10分钟后",type:'active', members: 850,time: '2m ago',heart: 100,comment: 20, imgUrl: 'https://picsum.photos/seed/community2/200/200' },
  { name: '夜晚反思',Mood:'Cloudy',nickname:"助理",desc:"夜晚反思15分钟后",type:'post', members: 600,time: '2m ago',heart: 100,comment: 20, imgUrl: 'https://picsum.photos/seed/community3/200/200' },
]);
const onNavigate = (item: any) => {
  if(item.type === 'active'){
    uni.navigateTo({
      url: '/pages/post/activity'
    })
  }else{
    uni.navigateTo({
    url: `/pages/post/detail?content=${content.value}&type=cindex`
  })
  }
  
};

const gotoShop = () => {
  uni.navigateTo({
    url: '/pages/shop/index'
  })
}
//跳转排行榜
const goRank = () => {
  uni.navigateTo({
    url: '/pages/profile/rank'
  })
}
//前往消息中心
const goMessage = () => {
  uni.navigateTo({
    url: '/pages/index/message'
  })
}
</script>

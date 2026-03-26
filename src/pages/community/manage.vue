<template>
  <view class="flex flex-col min-h-screen pb-32 theme-bg">
    <LcrBar :title="'社群管理'" :type="'all'" />
    <view
      class="sticky  z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md" :class="`top-${getNavbarHeight()}px`">
      <view class="px-[32rpx] pb-[25rpx] pt-[12rpx]">
        <view class="flex p-[8rpx] items-center justify-center rounded-full bg-theme-13 rounded-full gap-1">
          <label
            class="shadow-sm flex box-border cursor-pointer py-[16rpx] text-[28rpx] flex-1 items-center justify-center rounded-full transition-all font-semibold rounded-full bg-white theme-color-1 ">
            <text>我的动态</text>
            <input class="hidden" name="tab-select" type="radio" value="posts" />
          </label>
          <label
            class="flex box-border cursor-pointer py-[16rpx] text-[28rpx] flex-1 items-center justify-center rounded-full transition-all  font-semibold rounded-full theme-color-12">
            <text>成员管理</text>
            <input class="hidden" name="tab-select" type="radio" value="members" />
          </label>
        </view>
      </view>
    </view>
    <view class="flex-1 overflow-y-auto px-[32rpx] py-[32rpx] space-y-6">
      <!-- Search Bar -->
      <view class="relative group">
        <view class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <text
            class="iconfont icon-search text-[36rpx] text-primary/40 theme-color-1"></text>
        </view>
        <input
          class="box-border h-[94rpx] pl-[96rpx] pr-4 bg-white bg-theme-11 border-none rounded-full text-[28rpx] transition-all shadow-sm"
          placeholder="搜索动态或成员..." type="text" v-model="searchQuery" />
      </view>
      <!-- Content view: My Posts -->
      <view class="space-y-4">
        <view class="flex items-center justify-between">
          <view class="text-[28rpx] font-bold theme-color-1">我的动态 (12)</view>
          <view class="text-[24rpx] font-bold theme-color-1 flex items-center gap-1">
            全部动态 <text class="iconfont icon-jinru text-[24rpx]"></text>
          </view>
        </view>
        <!-- Post Card 1 -->
        <view class="bg-white rounded-[70rpx] p-[32rpx] shadow-sm border border-primary/5" @click="goPostDetail('post123')">
          <view class="flex gap-3 mb-3">
            <img class="w-[80rpx] h-[80rpx] rounded-full object-cover ring-2 ring-[#d4af3566]"
              data-alt="User personal profile avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzWhDOZIzg5xM43f3LIxMHPa8AtizXJbIRJVM6tc3eNcDHOZZ8YWgZppYx2dVse0YaDXAKrbeLkAKR9wPJJCjWDB-9pCo0vn0PpoY1zJFdIRdma28nlYwPMgpOhP8KI9IQAtVE11h8mQagg2Z4bMNJNaZzbX2RSuU7VP6tVm-2OaznO5FOmsYs-IGMwjmimGre45P6TJe21slwR2UyVjJ4TeY2gWzxb_zJvis4wEi7dywPjv8axFA01gArltji5sXWcKRXrGcrvkSd" />
            <view>
              <view class="font-bold text-[28rpx]">李慕白</view>
              <view class="text-[20rpx] theme-color-8 uppercase">2小时前 · 已发布</view>
            </view>
          </view>
          <view class="text-[28rpx] leading-relaxed mb-[32rpx] theme-color-5">
            今天在社群里和大家分享了关于极简主义设计的深度思考，非常感谢大家的积极反馈。希望我们能一起在美学与功能的平衡点上探索。
          </view>
          <view class="grid grid-cols-2 gap-2 mb-[32rpx]">
            <image class="w-full h-[256rpx] object-cover rounded-[30rpx]"
              data-alt="Minimalist modern interior design with natural light"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7sFm9d_YUIFpLN8suE8ZN_ovvnBIxdNA2Vjm7saYwR7466DLo1ohh8bzIJtndHmIfcORAz--ErAtCulJIudWKbrj_kxyIIVvZVT3-UJwQjgiXGj0-T5EQqhWRo473tD83joH6sAARumuSCjcCJ396aW3ftI1rM4087XX7O2yc_jZs5rKXftRL8op3pvC_OmvCoNxjFJ-B_NG5uG3KAo7hjXp_CBhc32s1-x21gpvRva3SCtxIKpoCkUlrZrSVt7i71BJee5oUZnkG" />
            <image class="w-full h-[256rpx] object-cover rounded-[30rpx]" data-alt="Clean abstract architectural lines"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDn04bT0nhCa1L9a_i8HLZCHO3-zITbCbfK0aE3x-4fYtm8AMiipXSNOAWtJ7VF9JKTBuusHUicghCDhh13KxHeMyZXdnkGi21MF0XbG1WO8gurYQJGmg_nxVK88tiqwcJXnksgjfPRM0q2KfPH-GI8emVhSycad6aQYdPWxAKM0BG9y-rOh727CII4UQYOzy-Ov1v7cK1Ihgzrcj-HACwYnH0mLcTnLlIiwfc1aINST_3RRdE2By0fRIsx_KPwin5S-fb7JyGVy16Y" />
          </view>
          <view class="flex items-center justify-between pt-[32rpx] border-t border-primary/5">
            <view class="flex gap-4">
              <text class="flex items-center gap-1 text-[24rpx] theme-color-8"><text
                  class="iconfont icon-heart-fill text-base align-middl"></text> 24</text>
              <text class="flex items-center gap-1 text-[24rpx] theme-color-8"><text
                  class="iconfont icon-chat-bubble-1 text-base align-middl"></text> 8</text>
            </view>
            <view class="flex gap-2">
              <button
                class="flex items-center gap-1 px-[24rpx] text-[24rpx] py-[12rpx] rounded-full bg-theme-13 theme-color-1 text-xs font-bold transition-transform active:scale-95">
                <text class="iconfont icon-beizhu text-[24rpx]"></text> 编辑
              </button>
              <button
                class="flex items-center gap-1 px-[24rpx] text-[24rpx] py-[12rpx] rounded-full bg-red-500/10 text-[#ef4444] font-bold transition-transform active:scale-95">
                <text class="iconfont icon-trash-2 text-[24rpx]"></text> 删除
              </button>
            </view>
          </view>
        </view>
        <!-- Post Card 2 (Text Only) -->
        <view class="bg-white rounded-[70rpx] p-[32rpx] shadow-sm border border-primary/5" @click="goPostDetail('post124')">
          <view class="flex gap-3 mb-3">
            <image class="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
              data-alt="User personal profile avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqfZJlLkKTyAB9OgowybNQK4kcdXti52IlDo7sSkSAnAhUAHnVWjvlKzVGgzVhJfjkyOLZliMS95M1xXr7Pcx86P4xQZIpWjscsOZSc8itzEMSdHdlwYvz2QzdvrYl5fUW3os8Fg17Gjwn0joxXTaZuQ0a66QxR-aZn8U27RJh6G0JoUE5Z2GTBPmNXyOyhIu28zpXEMdiLQfAKk5nuyjh54XKr5w49DDZxcNdzliIOlMGf1YycMmDp4LUdWC9SDx1BxNqAuK9vhjY" />
            <view>
                <view class="font-bold text-[28rpx]">李慕白</view>
                <view class="text-[20rpx] theme-color-8 uppercase">2小时前 · 已发布</view>
            </view>
          </view>
          <view class="text-[24rpx] leading-relaxed mb-[32rpx] text-[#4a4538] dark:text-primary/80 italic">
            "美并不是加无可加，而是减无可减。" —— 最近一直在思考的一句话。
          </view>
          <view class="flex items-center justify-between pt-[32rpx] border-t border-primary/5">
            <view class="flex gap-4">
               <text class="flex items-center gap-1 text-[24rpx] theme-color-8">
                <text
                  class="iconfont icon-heart-fill text-base align-middle"></text> 24</text>
            </view>
            <view class="flex gap-2">
               <button
                class="flex items-center gap-1 px-[24rpx] text-[24rpx] py-[12rpx] rounded-full bg-theme-13 theme-color-1 text-xs font-bold transition-transform active:scale-95">
                <text class="iconfont icon-beizhu text-[24rpx]"></text> 编辑
              </button>
              <button
                class="flex items-center gap-1 px-[24rpx] text-[24rpx] py-[12rpx] rounded-full bg-red-500/10 text-[#ef4444] font-bold transition-transform active:scale-95">
                <text class="iconfont icon-trash-2 text-[24rpx]"></text> 删除
              </button>
            </view>
          </view>
        </view>
      </view>
      <!-- Member Management view -->
      <view class="space-y-4">
        <view class="flex items-center justify-between">
          <view class="text-[28rpx] font-bold theme-color-1 uppercase tracking-widest">社群成员 (256)</view>
          <view class="text-[24rpx] font-bold theme-color-1 flex items-center gap-1">
            管理全员 <text class="iconfont icon-setting text-[24rpx]"></text>
          </view>
        </view>
        <view class="bg-white dark:bg-white/5 rounded-xl viewide-y viewide-primary/5 border border-primary/5">
          <!-- Member 1 -->
          <view class="flex items-center justify-between p-4">
            <view class="flex items-center gap-3">
              <view class="relative">
                <image class="w-[96rpx] h-[96rpx] rounded-full object-cover" data-alt="Male user profile portrait"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKwmv5wZTXBwU6zy0acGtnHKR1TkRKLseZptVnd0YAxe5vAMinhLSu2Q8SSMukkfYND3r15n1uq-8gCHNp5m9_lBoID-zhG5oI2nYiV5Qma0xHmHr-DP3Mg1luqmx1JV9_v7o6_lTtA8FYrd__iFIFgOzKF4h3Na47_mmHtQvjyhEC71Uo8R40704bLd5NES27FSXpwaN8r9XWeOBqMovlMLFnu_Zwlresj3SP7NkzARojQ3iA6A8ZaP0JGxK8STCajTnLuOF_5mrn" />
                <text class="absolute bottom-0 right-0 w-[24rpx] h-[24rpx] bg-[#22c55e] border-2 border-white rounded-full"></text>
              </view>
              <view>
                <view class="flex items-center gap-2">
                  <view class="font-bold text-[28rpx] theme-color-5">陈修远</view>
                  <text class="px-[16rpx] py-[4rpx] rounded-full bg-theme-3 text-[20rpx] theme-color-1 font-bold">管理员</text>
                </view>
                <view class="text-[24rpx] theme-color-4">上次在线: 5分钟前</view>
              </view>
            </view>
            <button
              class="w-[80rpx] h-[80rpx] flex mr-0 items-center justify-center rounded-full bg-theme-13  text-primary hover:bg-primary/20 transition-colors">
              <text class="iconfont icon-person_search text-[48rpx]  theme-color-1 "></text>
            </button>
          </view>
          <!-- Member 2 -->
          <view class="flex items-center justify-between p-4">
            <view class="flex items-center gap-3">
              <img class="w-12 h-12 rounded-full object-cover" data-alt="Female user profile portrait"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9u9a-cWnEqR3lutmggEHgKNkKfS-c82-PjTEOUaSTwWHl1Sf6_WIBEy94XpkcjOE3DjmWcYKA7Yxgk8pJhQGlEeBkudwijzN2ulsxR7vgIJVmuCZ6KvQcmxjDVICXn_zk-pJ54wQc9qpqszfBFChP4WWrpQ1MB8TFiJIf_TdZN81NqIBadB1yH7LREXdmlV8NUCr0fGvXVqwG2soLCnlLuSLr523f1-uqBFMuIq3H706JGZv6DX4HmUXxuUQJdD6GCSAjMLtMaCqf" />
              <view>
                <view class="flex items-center gap-2">
                  <view class="font-bold text-[28rpx] theme-color-5">林诗雨</view>
                </view>
                <view class="text-[24rpx] theme-color-4">活跃成员 · 32 动态</view>
              </view>
            </view>
            <button
              class="px-[32rpx] py-[12rpx] mr-0 rounded-full ring-1 ring-[#d4af35]/30 bg-theme-13 text-primary text-[24rpx] font-bold hover:bg-primary/5 transition-colors">
              管理
            </button>
          </view>
          <!-- Member 3 -->
          <view class="flex items-center justify-between p-4">
            <view class="flex items-center gap-3">
              <image class="w-12 h-12 rounded-full object-cover" data-alt="Professional user profile portrait"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6EOqvJ3WQprwSiIcrSBUq88GfnTW6WnuZRZXJSn9zs-34JZeKLcqQPVrLNkkYDYgs3cOffVTvP8ZZ4b5dfPY4a9gfwr_ZSvhMZysQeSietZwCwMJHjb5UemWGgtNYvJPQbpzTenOO7vjHaN0gYncPnbem1FnB6st7tCeURrO8B8Teq3UhQoJEa46CbTOLoiAdviewZqeed2WI5IzNBFG-4URXcKo25bCVC1DjhWnsBO6XXJ-vu0olXVuhyvtpYGExNuStncI0gmi6L" />
              <view>
                <view class="flex items-center gap-2">
                  <view class="font-bold text-[28rpx] theme-color-5">张云帆</view>
                </view>
                <view class="text-[24rpx] theme-color-4">新加入 · 昨天 14:20</view>
              </view>
            </view>
            <button
              class="px-4 py-1.5 mr-0 rounded-full ring-1 ring-[#d4af35]/30 text-primary bg-theme-13 text-xs font-bold hover:bg-primary/5 transition-colors">
              管理
            </button>
          </view>
        </view>
      </view>
    </view>
    <!-- Floating Action Button -->
    <view class="fixed bottom-24 right-6 flex flex-col gap-3">
      <button
      @click="goEditPost()"
        class="flex items-center justify-center w-[112rpx] h-[112rpx] rounded-full  bg-theme-2 text-background-dark shadow-lg shadow-primary/20 active:scale-95 transition-transform">
        <text class="iconfont icon-add text-[48rpx] text-white"></text>
      </button>
    </view>

    <!-- Delete Confirmation Modal (Visual only) -->
    <view
      class="hidden fixed inset-0 z-[100] bg-background-dark/60 backdrop-blur-sm flex items-center justify-center p-6">
      <view
        class="bg-white dark:bg-background-dark w-full max-w-xs rounded-xl p-6 shadow-xl border border-primary/10 text-center">
        <view class="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <text class="iconfont icon-add text-3xl">warning</text>
        </view>
        <view class="text-lg font-bold mb-2">确认删除？</view>
        <view class="text-sm text-primary/60 mb-6">此操作将永久删除该动态，无法撤销。</view>
        <view class="flex gap-3">
          <button class="flex-1 py-3 rounded-full bg-primary/10 text-primary font-bold text-sm">取消</button>
          <button class="flex-1 py-3 rounded-full bg-red-500 text-white font-bold text-sm">确定删除</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ArrowLeft, Settings, Users, Shield, MessageSquare, Bell } from 'lucide-vue-next';
import { navigateBack } from '@/utils/navigation';
import LcrBar from '@/components/lcrBar.vue';
import { getNavbarHeight } from '@/utils/system';

console.log('社群管理页面加载',getNavbarHeight());
const onBack = () => {
  navigateBack();
};
const searchQuery = ref('');
const stats = [
  { label: '成员', value: '1,284', icon: Users },
  { label: '动态', value: '452', icon: MessageSquare },
  { label: '待审核', value: '12', icon: Shield },
];
const goPostDetail = (postId: string) => {
  // 跳转到动态详情页
  uni.navigateTo({
    url: `/pages/post/detail?id=${postId}`,
  });
  console.log('跳转到动态详情页', postId);
};
const settings = [
  { label: '社群公告', desc: '设置置顶公告', icon: Bell },
  { label: '成员管理', desc: '禁言、踢出、权限设置', icon: Users },
  { label: '内容审核', desc: '关键词过滤、举报处理', icon: Shield },
  { label: '社群设置', desc: '名称、简介、头像修改', icon: Settings },
];
const goEditPost = () => {
  uni.navigateTo({
    url: '/pages/post/edit-post',
  });
};
</script>
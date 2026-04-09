<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
      <lcrBar :title="'全部动态'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
      <view class=" px-6 pb-32 flex-1">
            <view class="mb-8 mt-8">
                <view class="text-2xl font-serif font-light tracking-tight text-on-surface mb-1 leading-tight italic ">庇护所守护者</view>
                <text class="text-[12px] font-body text-on-surface-variant/60 tracking-wider">管理社区内的每一个宁静时刻</text>
            </view>
            <!-- Filter Tabs -->
            <view class="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide text-[22rpx]">
                <view
                    class="address-card px-5 py-2 rounded-full bg-theme-1 text-white text-[11px] font-bold tracking-widest whitespace-nowrap shadow-sm shadow-primary/20">全部动态</view>
                <view
                    class="address-card px-5 py-2 rounded-full bg-white border border-primary/10 text-on-surface-variant text-[11px] font-bold tracking-widest whitespace-nowrap">待审核
                    (3)</view>
                <view
                    class="address-card px-5 py-2 rounded-full bg-white border border-primary/10 text-on-surface-variant text-[11px] font-bold tracking-widest whitespace-nowrap">已发布</view>
            </view>
            <!-- Bento Layout Posts -->
            <view class="space-y-6">
                <!-- Post Card 1: Large Featured -->
                <view class="glass-card rounded-[2rem] p-5 shadow-sm bg-[#ffffffcc]">
                    <view class="flex items-center justify-between mb-4">
                        <view class="flex items-center gap-3">
                            <view
                                class="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                                <text class="iconfont icon-bx-spa text-[36rpx] text-primary"
                                    data-icon="spa"></text>
                            </view>
                            <text
                                class="text-[10px] font-bold tracking-[0.15em] text-on-surface-variant uppercase">慧能禅师</text>
                        </view>
                        <text
                            class="px-2.5 py-1 rounded-full bg-primary/10 text-[9px] font-bold text-primary tracking-widest uppercase">已发布</text>
                    </view>
                    <view class="font-serif text-[36rpx] text-on-surface mb-3 leading-snug italic">“心如工画师，能画诸世间。”</view>
                    <text class="text-[26rpx] font-body theme-color-6 leading-relaxed mb-5 line-clamp-3">
                        在清晨的冥想中，我们观察呼吸的起伏。每一次吸气都是新生，每一次呼气都是放下。在这个数字化的世界里，寻找一片属于自己的净土。
                    </text>
                    <view class="grid grid-cols-2 gap-2.5 mb-6">
                        <img class="rounded-xl h-32 w-full object-cover grayscale-[0.2] contrast-[0.9]"
                            data-alt="minimalist Zen rock garden with raked sand and single stone in soft morning light"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB27pG0vgCxyP7CCoIwj05qXB6A60rr9yWtPE18L0_i4aNHYeeH0PGbasoocBkwVTiew0EBa3btYUrZlBkTVoNqcWm-xtIRExv96rtvdf5ztYYTgqHqf2oxcX-4jBehAWIHckPzhRZGOSJUL2X0G-ljOdrqg620STD93uCxwHpDNjA35bpc-yj0ux1rQhr4EchaV3ZR3F-eEE5MNWtxOhdYjsJgn-LR_NO_cLDUMvBI6rRODj3JVfJnlvXAbv7dqI2gDGNQte_vomEY" />
                        <img class="rounded-xl h-32 w-full object-cover grayscale-[0.2] contrast-[0.9]"
                            data-alt="silhouetted person meditating on a mountain top during a misty sunrise"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdY5gMtI4QtgrtI2kltd6wA0WxJR_pb5DZLQaAwadekqlknAZJSzCyoyDpNeY3olyPzmGbin4tSM_umkw0RgW7OdeC-i0iHOvgdZSrqlj20BMNBAp3N-v8UAUjLcBh2t_EGZf6QKYmGkmNHMFXj02RidLqiHpN8NTZOdUNqQiO_cFgMPmIzy1AHN-4ZcNrdi6e8Gxuv4kqqsEoo9zC6rqMZ71tfqqAtxmacpT-lfZKCKSCl2bnimiscqKBrRby85cZN70Ge_Ez95N8" />
                    </view>
                    <view class="flex items-center justify-between pt-4 border-t border-primary/5">
                        <view class="flex gap-5">
                            <view
                                class="address-card flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors">
                                <text class="iconfont icon-a-EditSquare-Light text-[36rpx]"
                                    data-icon="edit_square"></text>
                                <text class="text-[10px] font-bold tracking-widest">编辑</text>
                            </view>
                            <view
                                class="address-card flex items-center gap-1.5 text-on-surface-variant hover:text-red-400 transition-colors">
                                <text class="iconfont icon-trash-2 text-[36rpx]"></text>
                                <text class="text-[10px] font-bold tracking-widest">删除</text>
                            </view>
                        </view> 
                        <view class="text-on-surface-variant/40">
                            <text class="iconfont icon-more_horizontal text-[24rpx]"></text>
                        </view>
                    </view>
                </view>
                <!-- Post Card 2: Pending Item -->
                <view class="bg-white rounded-[2rem] p-5 border border-primary/20 shadow-sm">
                    <view class="flex items-center justify-between mb-4">
                        <view class="flex items-center gap-3">
                            <img class="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10"
                                data-alt="close-up profile portrait of a young man with calm expression"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhvnlIXTy86TIHszKHXE3kd077lGyn-z3Il8o2HXlDlcGLiIaiIie2Iy50-GaNwuonXXrpXYD7ip3gZR-xIuodYCBecCEQJMLxb9EwZqxr0e5CSpFGIApTWKAFgHvhPSAAbz0YxMbVPbIP6KgMj4NT4Lz8vPJDLvZ3152C8dHoTjTnQpnUBYGnKp0bEzUucUflmi0rck3TqF_migna9Y5jofqACjVpRM3IWuIwbL5wcCxXzGXgEjEPpJhjVNr1vHJKkqj9vLsmx8Wk" />
                            <text
                                class="text-[10px] font-bold tracking-[0.15em] text-on-surface-variant uppercase">林间听风</text>
                        </view>
                        <text
                            class="px-2.5 py-1 rounded-full bg-primary/10 text-[9px] font-bold text-primary tracking-widest uppercase">待审核</text>
                    </view>
                    <view class="text-[13px] font-body theme-color-6 text-on-surface-variant mb-6 leading-relaxed">
                        今天在后山发现了一处绝佳的禅坐点，溪水声非常治愈。有人想一起加入本周末的行禅吗？
                    </view>
                    <view class="flex gap-3">
                        <view
                            class="flex-1 py-3 rounded-full bg-primary text-white text-[11px] font-bold tracking-[0.2em] flex items-center justify-center gap-2 shadow-md shadow-primary/10 transition-transform active:scale-95">
                            <text class="iconfont icon-check-circle text-[36rpx]"></text>
                            批准发布
                        </view>
                        <view
                            class="w-12 h-12 rounded-full border border-primary/10 bg-primary/5 flex items-center justify-center text-on-surface-variant/60">
                            <text class="iconfont icon-flag text-[36rpx]"></text>
                        </view>
                    </view>
                </view>
                <!-- Post Card 3: Small Text Only -->
                <view class="glass-card rounded-[2rem] p-5 shadow-sm bg-theme-13">
                    <view class="flex items-center justify-between mb-4">
                        <text
                            class="text-[10px] font-bold tracking-[0.1em] text-on-surface-variant/40 uppercase">2小时前</text>
                        <text
                            class="px-2.5 py-1 rounded-full bg-primary/10 text-[9px] font-bold text-primary tracking-widest uppercase">已发布</text>
                    </view>
                    <view class="font-serif text-[17px] text-on-surface mb-5 leading-snug">关于《无量寿经》的学习心得分享</view>
                    <view class="flex items-center justify-between">
                        <view class="flex -space-x-2">
                            <view
                                class="w-7 h-7 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center overflow-hidden">
                                <img class="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKwmv5wZTXBwU6zy0acGtnHKR1TkRKLseZptVnd0YAxe5vAMinhLSu2Q8SSMukkfYND3r15n1uq-8gCHNp5m9_lBoID-zhG5oI2nYiV5Qma0xHmHr-DP3Mg1luqmx1JV9_v7o6_lTtA8FYrd__iFIFgOzKF4h3Na47_mmHtQvjyhEC71Uo8R40704bLd5NES27FSXpwaN8r9XWeOBqMovlMLFnu_Zwlresj3SP7NkzARojQ3iA6A8ZaP0JGxK8STCajTnLuOF_5mrn" />
                            </view>
                            <view class="w-7 h-7 rounded-full border-2 border-white bg-primary/20"></view>
                            <view class="w-7 h-7 rounded-full border-2 border-white bg-primary/5"></view>
                        </view>
                        <view class="flex items-center gap-5">
                            <text class="iconfont icon-chat-bubble-1 text-primary/40 text-[20px]"
                                data-icon="chat_bubble"></text>
                            <text class="iconfont icon-share text-primary/40 text-[20px]"
                                data-icon="ios_share"></text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <button
            class="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center z-40 transition-transform active:scale-95">
            <span class="icon-add iconfont text-[56rpx]"></span>
        </button>
    </view>
  </template>
  <script setup lang="ts">

  import { navigateBack } from '@/utils/navigation';
  import lcrBar from '@/components/lcrBar.vue';
  
  const onBack = () => {
    navigateBack();
  };
  </script>
  <style scoped lang="scss">
  
  </style>
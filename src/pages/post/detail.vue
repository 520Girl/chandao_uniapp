

<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern">
    <lcrBar :title="'动态详情'" :leftIcon="'icon-arrow-left'" :handleClick="onBack" :type="'all'" />
    <view class="max-w-2xl mx-auto pb-24">
        <!-- User Header & Content -->
        <view class="p-4 space-y-4">
            <view class="flex items-center justify-between">
                <view class="flex items-center gap-3">
                    <view class="relative p-0.5 rounded-full bg-gradient-to-tr from-primary to-primary/20">
                        <image alt="用户头像"
                            class="w-12 h-12 rounded-full object-cover border-2 border-theme-2"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHH07-jLCMMG2yEjsqrB81Nvz9jKcxMv7rofDoqxnl-2MDFnlVP_9wdZjYjXDNJK5r5nGEL1Ps5kicutgsP3oHw64VwzxTD0q_3CjcuzlpGzOfBYMFcmm73I7TNoB9ko_zhBXXzv5xUuY6LixJnQC2GEGNzBw8x1SYyFtmRgLgegDOCMrU6tNQwlBJATe1HC-cFSOjdF3_i9XwdCzg4saYLMxWjXjMczFGThfewitHo_7OfxY82OGE_BoYieRaCTvoOEJmGnh1_7rO" />
                    </view>
                    <view>
                        <view class="font-bold text-[32rpx] flex items-center gap-2">
                            云舒雅士
                            <text class="iconfont icon-verified text-[32rpx] theme-color-2 fill-1"></text>
                        </view>
                        <p class="text-[24rpx] theme-color-6">2小时前 · 北京</p>
                    </view>
                </view>
                <button
                    class="bg-theme-1 text-white mr-0 px-5 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    关注
                </button>
            </view>
            <view class="space-y-3">
                <view class="text-[32rpx] leading-relaxed text-slate-700 dark:text-slate-300">
                    今日漫步林间，见云卷云舒，心境豁然开朗。愿这份宁静能与诸位共赏。极简的生活方式，是给灵魂留白。在这个快节奏的世界里，寻找那一抹独属于自己的禅意。
                    <view style="height: 40rpx" /><view />
                    <text class="text-[32rpx] font-medium theme-color-1 font-medium">#禅意生活 #极简主义 #中式美学</text>
                </view>
                <!-- view Image -->
                <view class="rounded-[90rpx] overflow-hidden shadow-sm border border-primary/10">
                    <image alt="意境图" class="w-full h-auto object-cover aspect-[4/3]"
                        data-alt="Serene foggy forest landscape at dawn"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMUzEWCV0eJAt9B4XC-JQJ11ybls1SCEPBzvHbzLl-hsHQH53XPa3jwhnd3UPn0m6ywClQwtaBZGi2I9FKL3wJifYb1Xx0tmt6gVXQftcVDTRcmJvhc_wECT5khCk76tJERSXcMC33tIZaGEX-LE8ubPI-CczJGei8G08B92wYCDb2U88pXNCdt0jEu-JkB15fTi8rnbEMWA7fQA9m-8yeB-f1BoSCKIAEhleMk4TKB_0feG-nyINTgeog-lNY8lMaL0gxtTb1afCw" />
                </view>
            </view>
            <!-- Interaction Stats -->
            <view class="flex items-center gap-6 py-2 border-y border-primary/10">
                <view class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <text class="iconfont icon-heart-fill text-[48rpx]"></text>
                    <text class="text-[28rpx] font-bold">1.2k</text>
                </view>
                <view class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <text class="iconfont icon-chat-bubble-1 text-[48rpx]"></text>
                    <text class="text-[28rpx] font-bold">45</text>
                </view>
                <view class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <text class="iconfont icon-share text-[48rpx]"></text>
                    <text class="text-[28rpx] font-bold">12</text>
                </view>
            </view>
          </view>
        <!-- viewider with Cloud Element -->
        <view class="flex items-center px-4 py-6 gap-3">
            <text class="iconfont icon-Cloudy theme-color-3 text-[72rpx]"></text>
            <view class="text-[36rpx] font-bold">全部评论</view>
            <view class="h-[1px] flex-1 bg-gradient-to-r from-primary/20 to-transparent"></view>
        </view>
        <!-- Comment List -->
        <view class="px-4 space-y-6">
            <!-- Comment 1 -->
            <view class="flex gap-3">
                <image alt="用户" class="w-[80rpx] h-[80rpx] rounded-full object-cover" data-alt="Portrait of a woman with long hair"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFL0bgaLupbNZZ1YLS_lKQ6CiTwBCCP8qEASZnpeaViZ_pLQNK9MzBkzr_hxoN9oHi2yqIiNLfmuQn4nPT0lVSxksYRtZGOw333DTWV7g4_ixvVPbsw9ez98TuIPIaXgouOMwJ9ILKCmfDq5Bn13eB3dvPiShnwiFaObKxLSYPnaAFxoE8kWaUz9r3Ej9_wjgwL-87BnrocJBUvKwzuz2bH5p78whC9HPr3uY9UJexG9cGSZ4cJ5KSvh5ajOuXBHa8KArRk6Aa9CP7" />
                <view class="flex-1 space-y-2">
                    <view class="bg-theme-10 rounded-xl p-[15rpx] px-[25rpx]">
                        <view class="flex justify-between items-start mb-1">
                            <text class="font-bold text-[28rpx] theme-color-1">林夕儿</text>
                            <text class="text-[10px] text-slate-400">1小时前</text>
                        </view>
                        <text class="text-[28rpx] theme-color-7">
                            这份留白真的太舒服了，现代人确实需要这样的生活态度。
                        </text>
                    </view>
                    <view class="flex items-center gap-4 pl-2">
                        <view class="flex items-center gap-1 text-xs text-slate-500 theme-color-7">
                            <text class="iconfont icon-heart-fill text-[26rpx] theme-color-7"></text>
                             <text class="text-[22rpx] font-medium theme-color-7">24</text>
                        </view>
                        <view class="text-[22rpx] font-medium theme-color-7">回复</view>
                    </view>
                    <!-- Reply Nested -->
                    <view class="flex gap-2 pt-2">
                        <image alt="用户" class="w-6 h-6 rounded-full object-cover"
                            data-alt="Portrait of a man wearing glasses"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAM0L_krVjohJQXmPViK1qt5-tpO4flMFdCnu-cHfmOMG3aCq4kXDA4hFiLt8np1qUgt05jCKxPvr8KZHjOZyasNeIN7hjuwT-HSBU2rjCcTkVfBdqgH0-pF6s2Tjo7frYbJMTw7HTYUSB5DwEUs2Bz4zv8D6XhzeWcmkA2WnOmwRWVkub2rrchg9X_AdStp5igo1DL3mBfvTgvvCYukkjEB1hh9zApCsUyx5H2P-txyXK3WPvuWCZRwQCJ2OGCpPpAYCFVZvExEOW" />
                        <view class="flex-1 bg-white/50 dark:bg-white/5 p-3 rounded-xl">
                            <view class="text-xs">
                                <text class="font-bold text-primary text-[24rpx] theme-color-1">清风：</text>
                                <text class="text-[22rpx] theme-color-7">
                                    确实，越简单，越丰盈。
                                </text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- Comment 2 -->
            <view class="flex gap-3">
                <image alt="用户" class="w-10 h-10 rounded-full object-cover" data-alt="Portrait of a young woman"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX3yd01VamYMm48YIwh44F0jn0L6M1xPo6uYlcPC3RoAvPOUYsf9rcqfnicc_xVyIeQGoAXa9-KorkZEHZKnQiN7y88s9Qln-6Rc0whQe72Fs-OJBcUQsw_eM9Kh8HIs7_jky-Oq9MRThMmJwJcZJpwfxZG8Qx8Vf3J5JosDf-VhcUIGCAQnEYmsARZ0UP_NYQj73onk34AO0z38TwueAUiOz8w7zXaxR3QTKfEMzcDfFEljfO0pqX7Yk4ZDJHRzw7Mdgew1eK7FKT" />
                <view class="flex-1 space-y-2">
                    <view class="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl rounded-tl-none">
                        <view class="flex justify-between items-start mb-1">
                            <text class="font-bold text-sm text-primary">墨染</text>
                            <text class="text-[10px] text-slate-400">30分钟前</text>
                        </view>
                        <view class="text-sm text-slate-700 dark:text-slate-300">
                            配图好赞，请问是在哪拍的？感觉很有禅意。
                        </view>
                    </view>
                    <view class="flex items-center gap-4 pl-2">
                        <button class="flex items-center gap-1 text-xs text-slate-500">
                            <text class="material-symbols-outlined text-sm">favorite</text> 8
                        </button>
                        <button class="text-xs text-slate-500 font-medium">回复</button>
                    </view>
                </view>
            </view>
        </view>
    </view>
    <!-- Fixed Bottom Bar -->
    <view
        class="fixed bottom-0 left-0 right-0 p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-primary/10">
        <view class="max-w-2xl mx-auto flex items-center gap-3">
            <view class="flex-1 relative">
                <input
                    style="height:70rpx;min-height:auto;line-height:1;"
                    class="w-full bg-slate-100 dark:bg-white/10 border-none rounded-full py-[20rpx] pl-[15rpx] text-[28rpx] focus:ring-2 focus:ring-primary/50 placeholder-slate-400"
                    placeholder="说点什么..." type="text" />
                <text
                    class="iconfont icon-sentiment-satisfied absolute right-0 top-1/2 -translate-y-1/2 text-[48rpx] theme-color-1"></text>
            </view>
            <view class="flex items-center gap-1 bg-theme-10 p-1 rounded-full">
                <view
                    class="w-[80rpx] h-[80rpx] flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/50  transition-colors">
                    <text class="iconfont icon-heart-fill text-[48rpx]"></text>
                </view>
                <view
                    class="w-[80rpx] h-[80rpx] flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/50  transition-colors">
                    <text class="iconfont icon-star text-[48rpx]"></text>
                </view>
                <view
                    class="bg-theme-1 w-[80rpx] h-[80rpx] flex items-center justify-center rounded-full text-white bg-primary shadow-md hover:scale-105 transition-transform">
                    <text class="iconfont icon-send text-[48rpx] "></text>
                </view>
            </view>
        </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { navigateBack } from '@/utils/navigation';
import lcrBar from '@/components/lcrBar.vue';
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Go back to the previous page.
/*******  ef4d168f-d7ad-4883-b4d6-c6a39fe6f03c  *******/
const onBack = () => {
  navigateBack();
};
</script>

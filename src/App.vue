<script setup lang="ts">
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app";
import { initTheme } from "./composables/useTheme";
import { getDeviceType } from "./utils/system";
onLaunch(() => {
  console.log("Device Type:", getDeviceType(),initTheme());
  console.log("System Info:", getDeviceType());
  // uni.hideTabBar() // 启动时隐藏
  initTheme();
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
// @import 'uview-plus/index.scss';
@import "@/assets/styles/theme.scss";
@import "@/assets/iconfont/iconfont.css" ;
// @import "https://at.alicdn.com/t/c/font_5133341_aj65g0b3fe.css";

</style>

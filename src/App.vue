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
  uni.request({
  url: 'http://192.168.1.4:8001',
  success: (res) => { 
    console.log('原始请求成功', res)
   },
  fail: (err) => { console.error('原始请求失败', err) }
})
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
.uni-toast {
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>

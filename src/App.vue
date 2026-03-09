<script setup lang="ts">
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app";
import { initTheme } from "./composables/useTheme";
import { getDeviceType } from "./utils/system";
onLaunch(() => {
  console.log("Device Type:", getDeviceType(),initTheme());
  console.log("System Info:", getDeviceType());
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
</style>

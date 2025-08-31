<script setup lang="ts">
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app";
import { initTheme } from "./composables/useTheme";

onLaunch(() => {
  console.log("App Launch");
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
@use "@/assets/styles/theme.scss" as *;
</style>

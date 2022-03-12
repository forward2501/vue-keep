<template>
  <div>这是标签设置页</div>
  <TagSetting :isShowTagSetting="isShowTagSetting"></TagSetting>
</template>
<script>
import TagSetting from "@/components/TagSetting.vue";
import store from "@/store/index.js";
export default {
  name: "TagSettingView",
  components: { TagSetting },
  data() {
    return {};
  },
  store,
  computed: {
    isShowTagSetting() {
      if (store.state.currentMenu === "tagSetting") {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
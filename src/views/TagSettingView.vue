<template>
  <div class="tagView"></div>
  <TagSetting :isShowTagSetting="isShowTagSetting"></TagSetting>
</template>
<script>
import TagSetting from "@/components/TagSetting.vue";
import store from "@/store/index.js";
export default {
  name: "TagSettingView",
  components: { TagSetting },
  data() {
    return {
      isShowDialog: false,
    };
  },
  store,
  computed: {
    isShowTagSetting() {
      if (store.state.currentMenu === "/tagSetting") {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.tagView {
  width: 100%;
  height: 100%;
}
</style>
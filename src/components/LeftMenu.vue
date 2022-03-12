<template>
  <div class="el-drawer-div">
    <el-menu
      :default-active="currentMenuName"
      active-text-color="blue"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :router="true"
      @select="select"
    >
      <el-menu-item index="todo">
        <el-icon><list /></el-icon>
        <template #title>记事</template>
      </el-menu-item>
       <el-menu-item index="notifyToDo">
        <el-icon><bell /></el-icon>
        <template #title>提醒</template>
      </el-menu-item>
      <div v-for="(item, index) in toDoTagsOptions" :key="index">
        <el-menu-item :index="item.value">
          <el-icon><price-tag /></el-icon>
          <template #title>{{item.value}}</template>
        </el-menu-item>
      </div>
       <el-menu-item index="tagSetting">
        <el-icon><edit-pen /></el-icon>
        <template #title>修改标签</template>
      </el-menu-item>
      <el-menu-item index="deletedToDo">
        <el-icon><delete /></el-icon>
        <template #title>回收站</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import store from "@/store/index.js";
export default {
  name: "LeftMenu",
  data() {
    return {};
  },
  store,
  computed: {
    isCollapse() {
      return store.state.isCollapse;
    },
    currentMenuName() {
      return store.state.currentMenu;
    },
    toDoTagsOptions() {
      return store.state.toDoTagsOptions;
    },
  },
  methods: {
    // 菜单切换事件，selec是回调函数
    select: function (index, indexPath, item, routeResult) {
      console.log("当前选中菜单:" + index + ",路径:" + indexPath);
      store.commit("updateCurrentMenu", index);
      // 点击menu选项之后折叠menu
      // store.commit("updateIsCollapse", false);
      // console.log("折叠菜单");
    },
  },
};
</script>
<style lang="scss" scoped>
// .el-drawer,.rtl{
//   margin-top: 114px;
// }
// :deep(.el-drawer__body){
//   background-color: blue;
// }
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  max-height: 800px;
  margin-top: 5px;
}
.el-menu-item.is-active {
  background-color: #42b893;
  color: #fff;
}
</style>
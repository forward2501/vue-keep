<template>
  <div class="header">
    <el-tooltip v-model:visible="visible">
      <template #content>
        <span>主菜单</span>
      </template>
      <el-icon
        class="menu-icon"
        size="30px"
        color="#5f6368"
        @mouseenter="addMenuFocus($event)"
        @mouseleave="removeMenuFocus($event)"
        @click="openOrCloseMenu"
        ><operation
      /></el-icon>
    </el-tooltip>
    <h1 class="avatar">Keep</h1>
    <el-input
      v-model="inputSearch"
      class="w-50 m-2 inputSearch"
      placeholder="搜索记事"
      icon="el-icon-search"
      type="text"
      clearable
      @keyup.enter="search"
    >
      <!--<template #prepend><el-button><el-icon><search /></el-icon></el-button></template>-->
    </el-input>
    <el-divider class="el-divider"></el-divider>
  </div>
</template>

<script>
import store from "@/store/index.js";
export default {
  name: "Header",
  data() {
    return {
      visible: false,
      inputSearch: "",
    };
  },
  store,
  methods: {
    addMenuFocus($event) {
      $event.currentTarget.classList.add("focus");
      this.visible = true;
    },
    removeMenuFocus($event) {
      $event.currentTarget.classList.remove("focus");
      this.visible = false;
    },
    // 菜单折叠事件
    openOrCloseMenu() {
      if (store.state.isCollapse === false) {
        store.state.isCollapse = true;
      } else {
        store.state.isCollapse = false;
      }
    },
    // 顶部搜索栏
    search() {
      store.commit("updateSearchContent", this.inputSearch);
      const result = store.getters.getSearchToDoLists(this.inputSearch);
      console.log("结果为:" + result);
      for (const item of result) {
        console.log(item);
      }
      // const result1 = store.getters.getClickTagToDoList("school");
      // alert(result1[0].title)
      // console.log("结果1为:" + result1);
      // for (const item1 of result1) {
      //   console.log(item1);
      // }
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  width: 100%;
  height: 100%;
  .menu-icon {
    position: absolute;
    top: 50%;
    margin-top: -20px;
  }
  .avatar {
    position: absolute;
    top: 50%;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    margin-top: -20px;
    left: 70px;
  }
  .inputSearch {
    position: absolute;
    top: 50%;
    margin-top: -25px;
    width: 600px;
    left: 400px;
  }
  .el-divider {
    position: absolute;
    bottom: 0;
    margin: 0;
  }
}
.focus {
  cursor: pointer;
  background-color: rgb(235, 231, 231);
  border: 1px solid rgb(235, 231, 231);
  border-radius: 50%;
}
// 深度选择器，修改el-input高度
:deep(.el-input__inner) {
  height: 50px;
  background-color: #f9fcf8;
}
</style>
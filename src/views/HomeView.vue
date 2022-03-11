<template>
  <div class="home">
    <el-container class="el-container">
      <el-header class="el-header"><Header></Header></el-header>
      <el-container class="main-container">
         <el-aside class="el-aside"><LeftMenu></LeftMenu></el-aside>
         <el-main class="el-main"><router-view /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import LeftMenu from "@/components/LeftMenu.vue";

export default {
  name: "HomeView",
  components: {
    Header,
    LeftMenu,
  },
};
</script>
<style scoped lang="scss">
.home{
 width: 100%;
 height: 100%;
}
.el-container{
  width: 100%;
  height: 100%;
  .el-header{
    width: 100%;
    height: 15%;
  }
  .main-container{
    width: 100%;
    height: 85%;
    .el-aside{
      width: 20%;
      max-height: 800px;
      overflow-y: auto
    }
    .el-main{
      width: 80%;
      height: 100%;
    }
  }
}
</style>
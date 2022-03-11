<template>
  <div class="contentDiv">
    <div v-if="isNull" class="noContentDiv">
      <!--回收站无内容-->
      <el-icon style="font-size: 50px"><delete /></el-icon>
      <p>回收站中没有任何记事</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "DeletedToDoView",
  data() {
    return {
      isNull: true,
    };
  },
};
</script>
<style lang="scss" scoped>
.contentDiv {
  position: relative;
  width: 100%;
  height: 100%;
}
.noContentDiv {
  position: absolute;
  text-align: center;
  font-size: 30px;
  color: gray;
  height: 500px;
  width: 100%;
  top: 70%;
  margin-top: -250px;
}
</style>
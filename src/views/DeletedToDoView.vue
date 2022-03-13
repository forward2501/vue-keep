<template>
  <div class="contentDiv" v-if="isNull">
    <div class="noContentDiv">
      <!--回收站无内容-->
      <el-icon style="font-size: 50px"><delete /></el-icon>
      <p>回收站中没有任何记事</p>
    </div>
  </div>
  <div v-else>
    <el-button type="text" style="float: right" @click="clearAllDeletedTo"
      >清空回收站</el-button
    >
    <!--展示回收站内容-->
    <el-row>
      <el-col
        v-for="(deletedItem, index) in deletedToDoList"
        :key="deletedItem"
        :span="6"
        :offset="index > 0 ? 2 : 0"
        @mouseenter="getFocus($event, index)"
        @mouseleave="removeFocus($event)"
      >
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <div style="padding: 14px">
            <div class="header">
              <h2>{{ deletedItem.title }}</h2>
            </div>
            <div class="content">
              {{ deletedItem.content }}
            </div>
            <div class="tag">
              <el-tag
                v-for="tag of deletedItem.toDoTags"
                :key="tag.name"
                type=""
                class="mx-1"
                size="small"
              >
                {{ tag.name }}
              </el-tag>
            </div>
            <div class="bottom">
              <div>
                <p class="todoTime">{{ deletedItem.toDoTime }}</p>
                <el-icon
                  class="alert-icon"
                  v-if="
                    deletedItem.toDoTime !== '' && deletedItem.toDoTime !== null
                  "
                  ><clock
                /></el-icon>
              </div>
              <div v-show="isShowBottom && currentLi === index">
                <el-popover
                  placement="bottom-start"
                  title=""
                  :width="150"
                  trigger="hover"
                  content="永久删除"
                >
                  <template #reference>
                    <el-button
                      class="button-icon"
                      size="small"
                      circle
                      @click="foreverDelete(index)"
                    >
                      <el-icon
                        ><delete-filled
                      /></el-icon> </el-button></template
                ></el-popover>
                <el-popover
                  placement="bottom-start"
                  title=""
                  :width="150"
                  trigger="hover"
                  content="还原"
                >
                  <template #reference
                    ><el-button
                      class="button-icon"
                      size="small"
                      circle
                      @click="reset(index)"
                    >
                      <el-icon><sell /></el-icon> </el-button></template
                ></el-popover>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import store from "@/store/index.js";
import { ElMessageBox, ElMessage } from "element-plus";
export default {
  name: "DeletedToDoView",
  data() {
    return {
      isShowBottom: false,
      currentLi: 0,
    };
  },
  store,
  computed: {
    isNull() {
      if (store.state.deletedToDoLists.length !== 0) {
        return false;
      } else {
        return true;
      }
    },
    deletedToDoList() {
      return store.state.deletedToDoLists;
    },
  },
  methods: {
    getFocus($event, index) {
      this.isShowBottom = true;
      this.currentLi = index;
    },
    removeFocus() {
      this.isShowBottom = false;
      this.currentLi = null;
    },
    // 还原
    reset(index) {
      store.commit("resetToDoFromRush", { index: index });
      ElMessage({
        message: "记事已还原",
        center: true,
        type: "success",
      });
    },
    // 永久删除
    foreverDelete(index) {
      store.commit("foreverDelete", { index: index });
      ElMessage({
        message: "记事已永久删除",
        center: true,
        type: "success",
      });
    },
    // 清空回收站
    clearAllDeletedTo() {
      ElMessageBox.confirm(
        "要清空回收站吗？此操作会永久删除回收站中的所有记事",
        "提示",
        {
          confirmButtonText: "清空回收站",
          cancelButtonText: "取消",
          type: "info",
        }
      )
        .then(() => {
          store.commit("clearAllDelete");
          ElMessage({
            type: "success",
            message: "回收站已清空",
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消清空",
          });
        });
    },
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
.button-icon {
  margin-right: 1px;
}
.el-tag {
  margin-right: 10px;
}
.todoTime {
  float: right;
  font-size: 14px;
}
.alert-icon {
  float: right;
}
.header,
.content,
.tag,
.bottom {
  margin-bottom: 10px;
}
</style>
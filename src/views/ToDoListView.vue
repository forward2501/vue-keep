<template>
  <div>
    <!--<el-input
      v-model="inputToDo"
      class="w-50 m-2 inputToDo"
      placeholder="添加记事"
      icon="el-icon-search"
      type="text"
      @focus="addToDoDialogVisible = true"
    ></el-input>-->
    <el-button
      type="plain"
      class="inputToDo"
      @click="addToDoDialogVisible = true"
    >
      添加记事
      <el-icon><plus /></el-icon>
    </el-button>
    <!--对话框-->
    <el-dialog
      v-model="addToDoDialogVisible"
      :title="addToDoDialogTitle"
      top="8vh"
    >
      <AddToDo></AddToDo>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addToDoDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
    <!---->
    <!--如果没有未完成的待办-->
    <div class="allCompleted" v-if="!isHaveToDo">暂无待办...</div>
    <!--如果有未完成的待办-->
    <div class="todoListsDiv" v-if="isHaveToDo">
      <ul>
        <li
          class="toListItem"
          v-for="(todoItem, index) in toDoLists"
          :key="index"
          @mouseenter="getFocus($event, index)"
          @mouseleave="removeFocus($event)"
        >
          <el-container class="container">
            <el-header class="todoItemHeader"
              ><h2>
                {{ todoItem.title }}
                <el-button
                  class="todoStatus"
                  type="success"
                  circle
                  v-if="todoItem.isCompleted"
                >
                  <el-icon><finished /></el-icon>
                </el-button>
                <el-button
                  class="todoStatus"
                  type="danger"
                  circle
                  v-else-if="!todoItem.isCompleted && todoItem.isOutOfTime"
                >
                  <el-icon><failed /></el-icon>
                </el-button>
                <span class="todoStatus" v-else> </span>
              </h2>
            </el-header>
            <el-main class="todoItemContent">
              <div class="content">{{ todoItem.content }}</div>
              <div class="endTime">提醒时间：{{ todoItem.toDoTime }}</div>
              <div class="toDoTag">
                <el-tag
                  v-for="tag in todoItem.toDoTags"
                  :key="tag.name"
                  type=""
                  class="mx-1"
                  closable
                  size="small"
                  :disable-transitions="false"
                  @close="handleClose(tag.name)"
                >
                  {{ tag.name }}
                </el-tag>
                <el-select
                  v-model="tagValue"
                  class="m-2 tagSelect"
                  placeholder="Select a tag"
                  size="small"
                  v-if="selectVisible && currentLi === index"
                  @change="change(tagValue, index)"
                  filterable
                >
                  <el-option
                    v-for="item in toDoTagsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-popover
                  v-if="!selectVisible && isShowFooter && currentLi === index"
                  placement="bottom-start"
                  title=""
                  :width="150"
                  trigger="hover"
                  content="增加标签"
                >
                  <template #reference>
                    <el-button
                      size="small"
                      style="margin-left: 10px"
                      @click="selectVisible = true"
                      ><el-icon><plus /></el-icon
                    ></el-button> </template
                ></el-popover>
              </div>
            </el-main>
            <el-footer class="footer">
              <div v-show="isShowFooter && currentLi === index">
                <el-popover
                  placement="bottom-start"
                  title=""
                  :width="150"
                  trigger="hover"
                  content="编辑记事"
                >
                  <template #reference
                    ><el-button type="primary" circle
                      ><el-icon><edit /></el-icon></el-button></template
                ></el-popover>
                <el-popover
                  placement="bottom-start"
                  title=""
                  :width="150"
                  trigger="hover"
                  content="完成记事"
                >
                  <template #reference>
                    <el-button
                      v-if="!todoItem.isCompleted"
                      type="success"
                      circle
                    >
                      <el-icon><check /></el-icon>
                    </el-button>
                  </template>
                </el-popover>
                <el-popover
                  placement="bottom-start"
                  title=""
                  :width="150"
                  trigger="hover"
                  content="删除记事"
                >
                  <template #reference>
                    <el-button type="info" circle
                      ><el-icon><delete /></el-icon></el-button></template
                ></el-popover>
              </div>
            </el-footer>
          </el-container>
        </li>
      </ul>

      <!-- 卡片形式 -->
      <!--<el-row>
    <el-col
      v-for="(todoItem, index) in toDoLists"
      :key="index"
      :span="8"
      :offset="index > 0 ? 2 : 0"
    >
      <el-card :body-style="{ padding: '0px' }"  shadow="hover">
        <template #header>
          <div class="card-header">
            <h2> {{ todoItem.title }}</h2>
            <el-button
                  class="todoStatus"
                  type="success"
                  circle
                  v-if="todoItem.isCompleted"
                >
                  <el-icon><finished /></el-icon>
                </el-button>
                <el-button
                  class="todoStatus"
                  type="danger"
                  circle
                  v-else-if="!todoItem.isCompleted && todoItem.isOutOfTime"
                >
                  <el-icon><failed /></el-icon>
                </el-button>
                <span class="todoStatus" v-else> </span>
          </div>
        </template>
       <div class="content">{{ todoItem.content }}</div>
              <div class="endTime">截至时间：{{ todoItem.toDoTime }}</div>
        <div style="padding: 14px">
          <div class="bottom">
            <div v-show="isShowFooter&&currentLi===index">
                <el-popover
                  placement="bottom-start"
                  title=""
                  :width="150"
                  trigger="hover"
                  content="编辑记事"
                >
                  <template #reference
                    ><el-button type="primary" circle
                      ><el-icon><edit /></el-icon></el-button></template
                ></el-popover>
                <el-popover
                  placement="bottom-start"
                  title=""
                  :width="150"
                  trigger="hover"
                  content="完成记事"
                >
                  <template #reference>
                    <el-button
                      v-if="!todoItem.isCompleted"
                      type="success"
                      circle
                    >
                      <el-icon><check /></el-icon>
                    </el-button>
                  </template>
                </el-popover>
                <el-popover
                  placement="bottom-start"
                  title=""
                  :width="150"
                  trigger="hover"
                  content="更改标签"
                >
                  <template #reference>
                    <el-button type="danger" circle
                      ><el-icon><plus /></el-icon
                    ></el-button> </template
                ></el-popover>
                <el-popover
                  placement="bottom-start"
                  title=""
                  :width="150"
                  trigger="hover"
                  content="删除记事"
                >
                  <template #reference>
                    <el-button type="info" circle
                      ><el-icon><delete /></el-icon></el-button></template
                ></el-popover>
              </div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row> -->
      <!--卡片形式-->
    </div>
  </div>
</template>
<script>
import store from "@/store/index.js";
// import Dialog from "@/components/Dialog.vue";
import AddToDo from "@/components/AddToDo.vue";
import { ElMessageBox, ElMessage } from "element-plus";

export default {
  name: "ToDoListView",
  components: { AddToDo },
  data() {
    return {
      toDoLists: store.state.toDoLists,
      isHaveToDo: true,
      inputToDo: "",
      todoStatus: { isCompleted: "", isOutOfTime: "" },
      // 是否展示添加记事对话框
      addToDoDialogVisible: false,
      // 添加记事对话框标题
      addToDoDialogTitle: "添加记事",
      // 传递给子组件dialog
      // whichComponent: AddToDo
      // 鼠标聚焦时才显示footer
      isShowFooter: false,
      currentLi: 0,
      tagValue: "",
      // 是否展示选择器
      selectVisible: false,
    };
  },
  store,
  methods: {
    getFocus($event, index) {
      console.log("鼠标进入");
      $event.currentTarget.classList.add("focus");
      this.isShowFooter = true;
      this.currentLi = index;
    },
    removeFocus($event) {
      console.log("鼠标离开");
      $event.currentTarget.classList.remove("focus");
      this.isShowFooter = false;
      this.currentLi = null;
    },
    // 标签选择器选择改变
    change(val, index) {
      // alert("当前选择:" + val);
      ElMessageBox.confirm(
        "当前选择新增标签为:" + val + "，确认新增?",
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "info",
        }
      )
        .then(() => {
          // 新增标签逻辑
          const tagObj = { name: val };
          console.log(tagObj.name);
          store.commit("updateToDoListTag", index, tagObj);
          ElMessage({
            type: "success",
            message: "新增标签成功",
          });
        })
        .catch(() => {
          // 新增失败
          ElMessage({
            type: "error",
            message: "取消新增",
          });
        });
    }, // change
  },
  computed: {
    isCompleted(val) {
      if (val === true) return true;
      return false;
    },
    // 标签选择器
    toDoTagsOptions() {
      return store.state.toDoTagsOptions;
    },
  },
};
</script>
<style lang="scss" scoped>
.inputToDo {
  margin-top: 20px;
  margin-left: 20px;
  width: 100px;
}
.toListItem {
  list-style: none;
  border: 1px solid rgba(111, 111, 111, 0.5);
  border-radius: 5px;
  width: 400px;
  height: 400px;
  margin: 20px;
  float: left;
}
.container {
  .todoItemHeader {
    text-align: left;
    line-height: 60px;
  }
  .todoItemContent {
    width: 400px;
    height: 300px;
    .content {
      width: 100%;
      height: 200px;
    }
    .endTime {
      margin-top: 10px;
      font-size: 14px;
      text-align: right;
      color: rgb(173, 107, 134);
    }
  }
  .footer {
    height: 40px;
  }
  .todoStatus {
    float: right;
    margin-top: 10px;
  }
}
.allCompleted {
  width: 100px;
  height: 30px;
  margin: 0 auto;
  margin-top: 50px;
}
.focus {
  box-shadow: 0px -1px 0px 0px #bbb9b9, /*上边阴影 */ -0.2px 0px 0px 0px #bbb9b9,
    /*左边阴影  */ 0.2px 0px 0px 0px #bbb9b9,
    /*右边阴影 */ 0px 1px 0px 0px #bbb9b9; /*下边阴影 */
}
.el-tag {
  margin-right: 5px;
}
.tagSelect {
  width: 100px;
}
</style>
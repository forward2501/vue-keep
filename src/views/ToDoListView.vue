<template>
  <div>
    <!--添加记事搜索框-->
    <el-input
      ref="addToDoInputRef"
      v-model="inputToDo"
      class="w-50 m-2 inputToDo"
      placeholder="添加记事..."
      icon="el-icon-search"
      type="text"
      @click="clickAddToDo"
    ></el-input>
    <!--添加记事对话框-->
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
    <!--记事为空-->
    <div class="isNullDiv" v-if="!isHaveToDo">暂无记事...</div>
    <!--记事不为空-->
    <!--改成卡片布局-->
    <div class="isNotNullDiv" v-if="isHaveToDo">
      <el-row>
        <el-col
          v-for="(todoItem, index) in toDoLists"
          :key="index"
          class="el-col-style"
          :span="6"
          :offset="index > 0 ? 2 : 0"
          @mouseenter="getFocus($event, index)"
          @mouseleave="removeFocus($event)"
        >
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <div style="padding: 14px">
              <div class="header" style="overflow: hidden">
                <h2 style="float: left">{{ todoItem.title }}</h2>
                <el-button
                  circle
                  style="float: right; border: none"
                  v-show="todoItem.isCompleted === true"
                >
                  <el-icon><finished /></el-icon>
                </el-button>
              </div>
              <div class="content">
                {{ todoItem.content }}
              </div>
              <div class="tag">
                <el-tag
                  v-for="tag of todoItem.toDoTags"
                  :key="tag.name"
                  type=""
                  class="mx-1"
                  size="small"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag.name)"
                >
                  {{ tag.name }}
                </el-tag>
                <el-popover
                  v-if="
                    !selectVisible[index] && isShowFooter && currentLi === index
                  "
                  placement="bottom-start"
                  title=""
                  :width="150"
                  trigger="hover"
                  content="增加标签"
                >
                  <template #reference>
                    <el-button
                      size="small"
                      style="margin-left: 5px; margin-top: 2px; border: none"
                      @click="selectVisible[index] = true"
                      ><el-icon><plus /></el-icon
                    ></el-button> </template
                ></el-popover>
                <!-- 标签选择器-->
                <el-select
                  v-model="tagValue"
                  v-if="selectVisible[index]"
                  class="m-2 tagSelect"
                  placeholder="Select a tag"
                  size="small"
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
              </div>
              <!--tag-->
            </div>
            <div class="bottom">
              <div class="timeDiv">
                <div v-if="!isShowDatePicker[index]">
                  <el-icon
                    v-if="
                      todoItem.toDoTime !== '' && todoItem.toDoTime !== null
                    "
                    size="small"
                    class="clock"
                    ><clock
                  /></el-icon>
                  <span
                    class="todoTime"
                    :class="
                      new Date(todoItem.toDoTime).getTime() <
                      new Date().getTime()
                        ? 'line-through'
                        : ''
                    "
                  >
                    {{ todoItem.toDoTime }}
                  </span>
                  <el-popover
                    placement="bottom-start"
                    title=""
                    :width="150"
                    trigger="hover"
                    content="修改时间"
                  >
                    <template #reference>
                      <el-button
                        circle
                        size="small"
                        style="border: none"
                        v-show="isShowFooter && currentLi === index"
                      >
                        <el-icon
                          class="edit-todoTime"
                          color="gray"
                          size="small"
                          @click="editToDoTime(index)"
                          ><edit-pen /></el-icon
                      ></el-button>
                    </template>
                  </el-popover>
                </div>
                <el-date-picker
                  v-if="isShowDatePicker[index]"
                  v-model="toDoTime"
                  type="datetime"
                  :shortcuts="shortcuts"
                  value-format="YYYY-MM-DD hh:mm:ss"
                  size="small"
                  clearable
                  @change="timeChange(toDoTime, index)"
                >
                </el-date-picker>
              </div>
              <div
                v-show="isShowFooter && currentLi === index"
                class="functionDiv"
              >
                <el-popover
                  placement="bottom-start"
                  title=""
                  :width="150"
                  trigger="hover"
                  content="编辑记事"
                >
                  <template #reference
                    ><el-button
                      type="primary"
                      circle
                      @click="editToDoList(index)"
                      size="small"
                      ><el-icon><edit /></el-icon></el-button></template
                ></el-popover>
                <el-popover
                  placement="bottom-start"
                  title=""
                  :width="150"
                  trigger="hover"
                  content="完成记事"
                  v-if="!todoItem.isCompleted"
                >
                  <template #reference>
                    <el-button
                      v-if="!todoItem.isCompleted"
                      type="success"
                      circle
                      size="small"
                      @click="completeToDo(index)"
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
                    <el-button
                      type="info"
                      circle
                      @click="deleteToDo(index)"
                      size="small"
                      ><el-icon><delete /></el-icon></el-button></template
                ></el-popover>
                <!--编辑记事对话框-->
                <el-dialog
                  v-model="editToDoDialogVisible"
                  title="编辑记事"
                  top="8vh"
                  destroy-on-close="true"
                >
                  <EditToDo
                    :toDoIndex="currentLi"
                    v-on:closeDialog="closeEditDialog"
                  ></EditToDo>
                  <template #footer>
                    <div class="dialog-footer">
                      <el-button @click="editToDoDialogVisible = false"
                        >关闭</el-button
                      >
                    </div>
                  </template>
                </el-dialog>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import store from "@/store/index.js";
import AddToDo from "@/components/AddToDo.vue";
import EditToDo from "@/components/EditToDo.vue";
import { ElMessageBox, ElMessage } from "element-plus";
export default {
  name: "ToDoListView",
  components: { AddToDo, EditToDo },
  data() {
    return {
      // toDoLists: store.state.toDoLists,
      inputToDo: "",
      // 是否展示添加记事对话框
      addToDoDialogVisible: false,
      // 添加记事对话框标题
      addToDoDialogTitle: "添加记事",
      // 鼠标聚焦时才显示footer
      isShowFooter: false,
      currentLi: 0,
      // 是否展示选择器
      tagValue: "",
      selectVisible: [],
      editToDoDialogVisible: false,
      toDoTime: "",
      // toDoTime: this.toDoTimeFun(),
      // defaultToDoTime: this.defaultToDoTimeFun(),
      shortcuts: [
        {
          text: "Today",
          value: new Date(),
        },
        {
          text: "Yesterday",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            return date;
          },
        },
        {
          text: "A week ago",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            return date;
          },
        },
      ],
      isShowDatePicker: [],
    };
  },
  store,
  methods: {
    getFocus($event, index) {
      this.isShowFooter = true;
      this.currentLi = index;
    },
    removeFocus($event) {
      this.isShowFooter = false;
      this.currentLi = null;
    },
    // 给记事新增标签
    updateToDoListTag(index, tagObj) {
      // store.commit("updateToDoListTag", { index: index, tagObj: tagObj });
      this.toDoLists[index].toDoTags.push(tagObj);
    },
    // 标签选择器选择改变
    change(val, index) {
      let isFlag = false;
      this.toDoLists[index].toDoTags.forEach((item) => {
        if (val === item.name) {
          isFlag = true;
          ElMessage({
            type: "error",
            message: "不能新增已有的标签",
          });
        }
      });
      if (!isFlag) {
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
            this.updateToDoListTag(index, tagObj);
            this.selectVisible[index] = false;
            ElMessage({
              type: "success",
              message: "新增标签成功",
            });
          })
          .catch(() => {
            // 新增失败
            this.selectVisible[index] = false;
            ElMessage({
              type: "error",
              message: "取消新增",
            });
          });
      }
    }, // change
    // 编辑记事
    editToDoList(index) {
      this.editToDoDialogVisible = true;
      this.currentLi = index;
      // alert("点击编辑记事" + index);
    },
    // 监听子组件事件之后的处理函数
    closeEditDialog(data) {
      this.editToDoDialogVisible = data;
    },
    //  移除标签
    handleClose(name) {
      this.toDoLists[this.currentLi].toDoTags.forEach((item) => {
        if (name === item.name) {
          this.toDoLists[this.currentLi].toDoTags.splice(
            this.toDoLists[this.currentLi].toDoTags.indexOf(item),
            1
          );
        }
      });
    },
    // 修改提醒时间
    editToDoTime(index) {
      // alert("修改todoTime");
      this.isShowDatePicker[index] = true;
      this.currentLi = index;
    },
    // 时间选择器选择改变
    timeChange(value, index) {
      // store.commit("updateToDoTime", {
      //   index: index,
      //   toDoTime: value,
      // });
      this.toDoLists[index].toDoTime = value;
      this.isShowDatePicker[index] = false;
      if (value === "" || value === null) {
        // 删除提醒时间
        ElMessage({
          message: "已从提醒中移除",
          center: true,
          type: "success",
          // offset: 150
        });
      } else {
        ElMessage({
          message: "修改提醒时间成功",
          center: true,
          type: "success",
          // offset: 150
        });
      }
    },
    // 完成记事
    completeToDo(index) {
      // store.commit("updateToDoIsComplete", {
      //   index: index,
      //   isCompleted: true,
      // });
      this.toDoLists[index].isCompleted = true;
      ElMessage({
        message: "待办已完成",
        center: true,
        type: "success",
        // offset: 150
      });
    },
    // 删除记事
    deleteToDo(index) {
      // store.commit("deleteToDo", { index: index });
      // store.state.toDoLists.forEach((item, itemIndex) => {
      //   if (item === this.toDoLists[index]) {
      //     store.state.toDoLists.splice(itemIndex, 1);
      //   }
      // });
      const deleteItem = this.toDoLists.splice(index, 1);
      store.state.toDoLists.forEach((item, itemIndex) => {
        if (item === deleteItem[0]) {
          store.state.toDoLists.splice(itemIndex, 1);
        }
      });
      // 往回收站写入数据
      store.commit("addDeletedToDoList", { value: deleteItem[0] });
      ElMessage({
        message: "记事已删除",
        center: true,
        type: "success",
        // offset: 150
      });
    },
    clickAddToDo() {
      this.addToDoDialogVisible = true;
      this.$refs.addToDoInputRef.blur();
    },
    // toDoTimeFun() {
    //   return this.toDoLists[this.currentLi].toDoTime !== null
    //     ? this.toDoLists[this.currentLi].toDoTime
    //     : "";
    // },
    // defaultToDoTimeFun() {
    //   return new Date(this.toDoLists[this.currentLi].toDoTime) !== null
    //     ? new Date(this.toDoLists[this.currentLi].toDoTime)
    //     : "";
    // },
  },
  computed: {
    toDoLists() {
      return store.getters.getSearchToDoLists(store.state.searchContent);
    },
    isHaveToDo() {
      if (store.state.toDoLists.length !== 0) {
        return true;
      } else {
        return false;
      }
    },
    // 标签选择器
    toDoTagsOptions() {
      return store.state.toDoTagsOptions;
    },
    // defaultToDoTime() {
    //   new Date(this.toDoLists[this.currentLi].toDoTime);
    // },
  },
  mounted() {
    this.toDoLists.forEach((item) => {
      this.selectVisible.push(false);
      this.isShowDatePicker.push(false);
    });
    // this.toDoTime =
    //   this.toDoLists[this.currentLi].toDoTime !== null
    //     ? this.toDoLists[this.currentLi].toDoTime
    //     : "";
    // this.defaultToDoTime =
    //   new Date(this.toDoLists[this.currentLi].toDoTime) !== null
    //     ? new Date(this.toDoLists[this.currentLi].toDoTime)
    //     : "";
  },
};
</script>
<style lang="scss" scoped>
.inputToDo {
  margin-top: 20px;
  margin-left: 20px;
  width: 500px;
}
.todoStatus {
  float: right;
  margin-top: 10px;
}
.isNullDiv {
  width: 500px;
  height: 30px;
  text-align: center;
  margin: 0 auto;
  margin-top: 200px;
  font-size: 30px;
  color: gray;
}
.isNotNullDiv {
  margin-top: 50px;
  .el-col-style {
    margin-top: 10px;
  }
  .content {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .bottom {
    .timeDiv {
      height: 30px;
      float: right;
      line-height: 30px;
      margin-bottom: 10px;
      .edit-todoTime {
        margin-right: 5px;
      }
      .todoTime {
        font-size: 14px;
        margin-left: 3px;
        margin-right: 5px;
      }
      &:deep(.el-input) {
        width: 165px;
      }
      &:deep(.el-input__icon) {
        height: 24px;
      }
    }
    .functionDiv {
      height: 30px;
      float: left;
      margin-left: 10px;
      margin-bottom: 10px;
    }
  }
}
.el-tag {
  margin-right: 5px;
}
.tagSelect {
  width: 100px;
  margin-top: 5px;
}
.line-through {
  text-decoration: line-through;
  color: gray;
}
</style>
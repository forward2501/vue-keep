<template>
  <div class="contentDiv" v-if="isNull">
    <div class="noContentDiv">
      <!--无相关标签的记事-->
      <el-icon style="font-size: 50px"><collection-tag /></el-icon>
      <p>暂无相关标签的记事</p>
    </div>
  </div>
  <div v-else>
    <!--展示内容-->
    <el-row>
      <el-col
        v-for="(filterTagItem, index) in filterTagToDoLists"
        :key="filterTagItem"
        class="el-col-style"
        :span="6"
        :offset="index > 0 ? 2 : 0"
        @mouseenter="getFocus($event, index)"
        @mouseleave="removeFocus($event)"
      >
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <div style="padding: 14px">
            <div class="header" style="overflow: hidden">
              <h2 style="float: left">{{ filterTagItem.title }}</h2>
              <el-button
                circle
                style="float: right; border: none"
                v-show="filterTagItem.isCompleted === true"
              >
                <el-icon><finished /></el-icon>
              </el-button>
            </div>
            <div class="content">
              {{ filterTagItem.content }}
            </div>
            <div class="tag">
              <el-tag
                v-for="tag of filterTagItem.toDoTags"
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
                    style="margin-left: 10px; margin-top: 2px; border: none"
                    @click="selectVisible[index] = true"
                    ><el-icon><plus /></el-icon
                  ></el-button> </template
              ></el-popover>
              <!--标签选择框-->
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
            <div class="bottom">
              <div>
                <div v-if="!isShowDatePicker[index]">
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
                        class="edit-todoTime"
                        size="small"
                        v-show="isShowFooter && currentLi === index"
                        auto-insert-space
                        style="border: none; margin-top: -3px"
                      >
                        <el-icon color="gray" @click="editToDoTime(index)"
                          ><edit-pen
                        /></el-icon> </el-button></template
                  ></el-popover>
                  <p
                    class="todoTime"
                    :class="
                      new Date(filterTagItem.toDoTime).getTime() <
                      new Date().getTime()
                        ? 'line-through'
                        : ''
                    "
                  >
                    {{ filterTagItem.toDoTime }}
                  </p>
                  <el-icon class="alert-icon"><clock /></el-icon>
                </div>
                <el-date-picker
                  v-if="isShowDatePicker[index]"
                  v-model="toDoTime"
                  type="datetime"
                  :shortcuts="shortcuts"
                  value-format="YYYY-MM-DD hh:mm:ss"
                  size="small"
                  @change="timeChange(toDoTime, index)"
                >
                </el-date-picker>
              </div>
              <div v-show="isShowBottom && currentLi === index"></div>
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
  name: "TagFilterView",
  data() {
    return {
      currentLi: 0,
      isShowFooter: false,
      selectVisible: [],
      isShowDatePicker: [],
      tagValue: "",
      toDoTime: "",
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
    };
  },
  store,
  computed: {
    // 需要提醒的记事
    filterTagToDoLists() {
      // return store.getters.filterTagToDoLists;
      return store.getters.getClickTagToDoList(this.currentFilterTagName);
    },
    isNull() {
      if (this.filterTagToDoLists.length === 0) {
        return true;
      } else {
        return false;
      }
    },
    // 标签选择器
    toDoTagsOptions() {
      return store.state.toDoTagsOptions;
    },
    currentFilterTagName() {
      return store.state.currentFilterTagName;
    },
  },
  methods: {
    getFocus($event, index) {
      this.currentLi = index;
      this.isShowFooter = true;
    },
    removeFocus($event) {
      this.currentLi = 0;
      this.isShowFooter = false;
    },
    updateToDoListTag(index, tagObj) {
      store.commit("updateToDoListTag", { index: index, tagObj: tagObj });
    },
    handleClose(name) {
      this.filterTagToDoLists[this.currentLi].toDoTags.forEach((item) => {
        if (name === item.name) {
          this.filterTagToDoLists[this.currentLi].toDoTags.splice(
            this.filterTagToDoLists[this.currentLi].toDoTags.indexOf(item),
            1
          );
        }
      });
    },
    change(val, index) {
      // alert("当前选择:" + val)
      let isFlag = false;
      this.filterTagToDoLists[index].toDoTags.forEach((item) => {
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
    editToDoTime(index) {
      // alert("修改todoTime");
      this.isShowDatePicker[index] = true;
    },
    timeChange(value, index) {
      store.commit("updateToDoTime", {
        index: index,
        toDoTime: value,
      });
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
  },
  mounted() {
    store.state.toDoLists.forEach((item) => {
      this.selectVisible.push(false);
      this.isShowDatePicker.push(false);
    });
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
  margin-right: 20px;
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
  margin-bottom: 5px;
}
.edit-todoTime {
  margin-left: 5px;
  float: right;
}
.header,
.content,
.tag,
.bottom {
  margin-bottom: 10px;
}
.tagSelect {
  width: 100px;
  margin-top: 5px;
}
.el-col-style {
  margin-top: 10px;
}
.line-through {
  text-decoration: line-through;
  color: gray;
}
</style>
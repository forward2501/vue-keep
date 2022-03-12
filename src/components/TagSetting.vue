<template>
  <el-dialog
    v-model="tagSettingDialogVisible"
    title="修改标签"
    top="8vh"
    width="30%"
    destroy-on-close
  >
    <div>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>
              <el-button v-if="isShowPlus" circle @click="isShowPlus = false"
                ><el-icon><plus /></el-icon
              ></el-button>
              <el-tooltip v-model:visible="cancleIconTipVisible">
                <template #content>
                  <span>取消</span>
                </template>
                <el-button
                  v-if="!isShowPlus"
                  circle
                  @click="clickCancle()"
                  @mouseenter="cancleIconTipVisible = true"
                  @mouseleave="cancleIconTipVisible = false"
                  ><el-icon><close /></el-icon
                ></el-button>
              </el-tooltip>
            </span>
            <el-button
              v-if="isShowPlus"
              type="info"
              plain
              style="background-color: #fff"
              @mouseenter="addColor($event)"
              @mouseleave="removeColor($event)"
              @click="isShowPlus = false"
              >创建新标签</el-button
            >
            <el-input
              ref="inputTagRef"
              class="input"
              v-if="!isShowPlus"
              v-model="inputTag"
              placeholder="创建新标签"
              style="width: 200px"
            >
            </el-input>
            <el-tooltip v-model:visible="createTagTipVisible">
              <template #content>
                <span>创建标签</span>
              </template>
              <el-button
                v-if="!isShowPlus"
                circle
                @click="createNewTag"
                @mouseenter="createTagTipVisible = true"
                @mouseleave="createTagTipVisible = false"
              >
                <el-icon><check /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </template>
        <div v-for="(tag, index) in toDoTags" :key="tag" class="tagItemDiv">
          <el-button
            circle
            v-if="!isShowDeleteIcon[index]"
            @mouseenter="isShowDeleteIcon[index] = true"
          >
            <el-icon><price-tag /></el-icon
          ></el-button>
          <el-tooltip v-model:visible="deleteTagTipVisible[index]">
            <template #content>
              <span>删除标签</span>
            </template>
            <el-button
              circle
              v-if="isShowDeleteIcon[index]"
              @mouseenter="deleteTagTipVisible[index] = true"
              @mouseleave="removeDeleteIconFocus(index)"
              @click="deleteTag(index)"
            >
              <el-icon><delete /></el-icon
            ></el-button>
          </el-tooltip>
          <span v-if="isShowEditIcon[index]" class="tagName">
            {{ tag.value }}</span
          >
          <el-input
            v-if="!isShowEditIcon[index]"
            class="modifyTagNameInput"
            v-model="modifyTagNameInput[index]"
            ref="modifyTagNameInputRef"
          ></el-input>
          <el-tooltip v-model:visible="renameTagTipVisible[index]">
            <template #content>
              <span>重命名标签</span>
            </template>
            <el-button
              circle
              class="editTagNameIcon"
              v-if="isShowEditIcon[index]"
              @mouseenter="renameTagTipVisible[index] = true"
              @mouseleave="renameTagTipVisible[index] = false"
              @click="clickEditTagName(index)"
            >
              <el-icon><EditPen /></el-icon
            ></el-button>
          </el-tooltip>
          <el-button
            class="editTagNameIcon"
            v-if="!isShowEditIcon[index]"
            circle
            @click="renameTag(index)"
          >
            <el-icon><check /></el-icon>
          </el-button>
        </div>
      </el-card>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="tagSettingDialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { ElMessageBox, ElMessage } from "element-plus";
import store from "@/store/index.js";
export default {
  name: "TagSetting",
  props: ["isShowTagSetting"],
  data() {
    return {
      tagSettingDialogVisible: this.isShowTagSetting,
      isShowPlus: true,
      inputTag: "",
      isShowDeleteIcon: [],
      isShowEditIcon: [],
      modifyTagNameInput: [],
      // 取消图标提示
      cancleIconTipVisible: false,
      createTagTipVisible: false,
      deleteTagTipVisible: [],
      renameTagTipVisible: [],
      // currentItemIndex: 0,
    };
  },
  store,
  methods: {
    clickCancle() {
      this.isShowPlus = true;
      this.cancleIconTipVisible = false;
    },
    addColor($event) {
      $event.currentTarget.classList.add("color");
    },
    removeColor($event) {
      $event.currentTarget.classList.remove("color");
    },
    createNewTag() {
      let isHave = false;
      this.toDoTags.forEach((item) => {
        if (
          item.value === this.inputTag.trim() ||
          item.label === this.inputTag.trim()
        ) {
          // 新建标签名不能相同
          isHave = true;
        } else {
          isHave = false;
        }
      });
      if (this.inputTag.trim().length === 0) {
        ElMessage.error("新建标签名不能为空");
        this.$refs.inputTagRef.focus();
      } else if (isHave) {
        ElMessage.error("标签名已存在");
      } else {
        store.commit("addNewTag", {
          value: this.inputTag,
          label: this.inputTag,
        });
        this.isShowPlus = true;
        this.isShowEditIcon[this.toDoTags.length - 1] = true;
        this.modifyTagNameInput[this.toDoTags.length - 1] =
          this.toDoTags[this.toDoTags.length - 1].value;
        ElMessage({
          type: "success",
          message: "创建标签成功",
        });
      }
    },
    // 修改标签名
    renameTag(index) {
      const oldTagName = this.toDoTags[index].value;
      let isHaveThisTagName = false;
      this.toDoTags.forEach((item) => {
        if (
          item.value === this.modifyTagNameInput[index] &&
          this.modifyTagNameInput[index] !== oldTagName
        ) {
          isHaveThisTagName = true;
        }
      });
      if (this.modifyTagNameInput[index].trim() === "") {
        ElMessage.error("标签名不能为空");
        this.$refs.modifyTagNameInputRef.focus();
      } else if (isHaveThisTagName) {
        ElMessage.error("标签名重复");
      } else {
        store.commit("updateToDoTagsOptions", {
          index: index,
          value: this.modifyTagNameInput[index],
        });
        this.isShowEditIcon[index] = true;
        this.renameTagTipVisible[index] = false;
        // 更新有该标签的记事中的标签名
        store.state.toDoLists.forEach((item1) => {
          item1.toDoTags.forEach((item2) => {
            if (item2.name === oldTagName) {
              item2.name = this.modifyTagNameInput[index];
            }
          });
        });
        ElMessage({
          type: "success",
          message: "标签重命名成功",
        });
      }
    },
    removeDeleteIconFocus(index) {
      this.isShowDeleteIcon[index] = false;
      this.deleteTagTipVisible[index] = false;
    },
    clickEditTagName(index) {
      const length = this.toDoTags.length;
      for (let i = 0; i < length; ++i) {
        if (i !== index) {
          this.isShowEditIcon[i] = true;
        }
      }
      this.isShowEditIcon[index] = false;
      this.renameTagTipVisible[index] = false;
    },
    // 删除标签
    deleteTag(index) {
      ElMessageBox.confirm(
        "我们将删除此标签并将其从您所有的 Keep 记事中移除。您的记事不会被删除。",
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "info",
        }
      )
        .then(() => {
          const deleteTagName = this.toDoTags[index].value;
          store.commit("deleteToDoTagsOptions", { index: index });
          // 从相关记事中移除该标签
          store.state.toDoLists.forEach((item1) => {
            item1.toDoTags.forEach((item2, index) => {
              if (item2.name === deleteTagName) {
                item1.toDoTags.splice(index, 1);
              }
            });
          });
          ElMessage({
            type: "success",
            message: "标签已删除",
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消删除",
          });
        });
    },
  },
  computed: {
    toDoTags() {
      return store.state.toDoTagsOptions;
    },
  },
  mounted() {
    this.toDoTags.forEach((item) => {
      this.isShowDeleteIcon.push(false);
      this.isShowEditIcon.push(true);
      this.modifyTagNameInput.push(item.value);
      this.deleteTagTipVisible.push(false);
      this.renameTagTipVisible.push(false);
    });
  },
};
</script>
<style lang="scss" scoped>
:deep(.el-input__inner) {
  border: 0;
}
.el-button {
  border: none;
  margin-left: 5px;
  margin-right: 5px;
}
.color {
  color: gray;
}
.tagItemDiv {
  font-size: 16px;
  margin-top: 20px;
}
.tagItemDiv:first-child {
  margin-top: 5px;
}
.tagName {
  margin-left: 20px;
}
.editTagNameIcon {
  float: right;
}
.box-card {
  max-height: 500px;
  overflow-y: auto;
}
.modifyTagNameInput {
  width: 150px;
}
</style>
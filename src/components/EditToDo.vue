<template>
  <div class="editToDoDiv">
    <el-form
      ref="editToDoFormRef"
      :model="toDoFormModel"
      :rules="toDoRules"
      label-width="120px"
      class="toDoForm"
      :size="formSize"
    >
      <el-form-item label="title" prop="toDoTitle" class="el-form-title">
        <el-input
          v-model="toDoFormModel.toDoTitle"
          clearable
          placeholder="Please input title"
        ></el-input>
      </el-form-item>
      <el-form-item label="content" prop="toDoContent">
        <el-input
          v-model="toDoFormModel.toDoContent"
          type="textarea"
          :autosize="{ minRows: 8, maxRows: 15 }"
          placeholder="Please input content"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-select
          multiple
          collapse-tags
          v-model="toDoFormModel.tagValue"
          class="m-2 tagSelect"
          placeholder="Select a tag"
          size="small"
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
      </el-form-item>
      <el-form-item label="提醒时间">
        <el-date-picker
          v-model="toDoFormModel.toDoTime"
          type="datetime"
          :placeholder="defaultToDoTime"
          :shortcuts="shortcuts"
          value-format="YYYY-MM-DD hh:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item class="el-form-button">
        <el-button
          type="primary"
          @click="submitUpdateToDoForm()"
          class="submitBtn"
          >修改记事</el-button
        >
        <el-button @click="resetEditToDoForm()" class="cancelBtn"
          >清空</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import store from "@/store/index.js";
import { ElMessage } from "element-plus";
import moment from "moment";
export default {
  name: "EditToDo",
  data() {
    return {
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
      toDoFormModel: {
        toDoTitle: this.getDefaultTitle(),
        toDoContent: this.getDefaultContent(),
        toDoTime: this.getDefaultTime(),
        tagValue: this.getDefaultTags(),
      },
      toDoRules: {
        toDoContent: [
          { required: true, message: "Please input content", trigger: "blur" },
        ],
      },
      formSize: "",
      defaultToDoTime: this.getDefaultTime(),
    };
  }, // data
  props: ["toDoIndex"],
  store,
  methods: {
    getDefaultTitle() {
      return store.state.toDoLists[this.toDoIndex].title;
      // return this.toDoLists[this.toDoIndex].title;
    },
    getDefaultContent() {
      return store.state.toDoLists[this.toDoIndex].content;
      // return this.toDoLists[this.toDoIndex].content;
    },
    getDefaultTime() {
      return new Date(store.state.toDoLists[this.toDoIndex].toDoTime);
      // return new Date(this.toDoLists[this.toDoIndex].toDoTime);
    },
    getDefaultTags() {
      const tagArr1 = store.state.toDoLists[this.toDoIndex].toDoTags;
      const tagArr2 = [];
      for (const item of tagArr1) {
        tagArr2.push(item.name);
      }
      return tagArr2;
    },
    // 提交修改
    submitUpdateToDoForm() {
      if (!this.$refs.editToDoFormRef) {
        console.log("失败");
        return;
      }
      this.$refs.editToDoFormRef.validate((valid) => {
        if (valid) {
          const toDoTags = [];
          for (const item of this.toDoFormModel.tagValue) {
            toDoTags.push({ name: item });
          }
          const toDoObj = {
            title: this.toDoFormModel.toDoTitle,
            content: this.toDoFormModel.toDoContent,
            toDoTime: this.datetime(this.toDoFormModel.toDoTime),
            // toDoTags: [{ name: this.toDoFormModel.tagValue }],
            isCompleted: false,
            isOutOfTime: false,
            toDoTags: toDoTags,
          };
          store.commit("updateToDoList", {
            index: this.toDoIndex,
            toDoObj: toDoObj,
          });
          // this.toDoLists.splice(this.toDoIndex, 1, toDoObj);
          // 添加成功之后的提示框
          ElMessage({
            message: "修改记事成功",
            center: true,
            type: "success",
            // offset: 150
          });
          // 关闭对话框
          this.$emit("closeDialog", false);
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    // 清空添加记事表单
    resetEditToDoForm() {
      this.$refs.editToDoFormRef.resetFields();
      this.toDoFormModel.toDoTime = "";
      this.toDoFormModel.tagValue = "";
    },
    datetime(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  computed: {
    // 标签选择器
    toDoTagsOptions() {
      return store.state.toDoTagsOptions;
    },
  },
};
</script>
<style lang="scss" scoped>
.editToDoDiv {
  width: 500px;
  height: 500px;
  margin: 50px auto;
}
.el-button {
  margin-left: 80px;
}
.el-button + .el-button {
  margin-left: 50px;
}
</style>
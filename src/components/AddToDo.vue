<template>
  <div class="addToDoDiv">
    <el-form
      ref="addToDoFormRef"
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
          placeholder="select a time"
          :shortcuts="shortcuts"
          value-format="YYYY-MM-DD hh:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item class="el-form-button">
        <el-button type="primary" @click="submitAddToDoForm()" class="submitBtn"
          >添加记事</el-button
        >
        <el-button @click="resetAddToDoForm()" class="cancelBtn"
          >清空</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import MarkDown from "@/components/MarkDown.vue";
import store from "@/store/index.js";
import { ElMessage } from "element-plus";
// type FormInstance = InstanceType<typeof ElForm>
export default {
  name: "AddToDo",
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
        toDoTitle: "",
        toDoContent: "",
        toDoTime: "",
        tagValue: "",
      },
      toDoRules: {
        toDoContent: [
          { required: true, message: "Please input content", trigger: "blur" },
        ],
      },
      formSize: "",
    };
  },
  store,
  methods: {
    //  提交添加记事表单
    submitAddToDoForm() {
      if (!this.$refs.addToDoFormRef) {
        console.log("失败");
        return;
      }
      this.$refs.addToDoFormRef.validate((valid) => {
        if (valid) {
          const toDoTags = [];
          for (const item of this.toDoFormModel.tagValue) {
            toDoTags.push({ name: item });
          }
          console.log("submit!");
          store.commit("addToDo", {
            title: this.toDoFormModel.toDoTitle,
            content: this.toDoFormModel.toDoContent,
            toDoTime: this.toDoFormModel.toDoTime,
            // toDoTags: [{ name: this.toDoFormModel.tagValue }],
            toDoTags: toDoTags,
            isCompleted: false,
            isOutOfTime: false,
          });
          // 添加成功之后的提示框
          ElMessage({
            message: "添加记事成功",
            center: true,
            type: "success",
            // offset: 150
          });
          // 清空表单
          this.$refs.addToDoFormRef.resetFields();
          this.toDoFormModel.toDoTime = "";
          this.toDoFormModel.tagValue = "";
        } else {
          console.log("error submit!");
          return false;
        }
      }); // this.$refs.addToDoFormRef.validate
    },
    // 清空添加记事表单
    resetAddToDoForm() {
      this.$refs.addToDoFormRef.resetFields();
      this.toDoFormModel.toDoTime = "";
      this.toDoFormModel.tagValue = "";
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
.addToDoDiv {
  width: 500px;
  height: 500px;
  margin: 50px auto;
}
.toDoForm {
  width: 100%;
}
.el-button {
  margin-left: 80px;
}
.el-button + .el-button {
  margin-left: 50px;
}
</style>
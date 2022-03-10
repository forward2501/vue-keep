import { createStore } from 'vuex'

export default createStore({
  state: {
    isCollapse: false,
    currentMenu: 'todo',
    // 记事标签
    toDoTagsOptions: [{ value: "school", label: "school" },
    { value: "生活", label: "生活" },
    { value: "前端", label: "前端" },
    { value: "family", label: "family" },
    { value: "美妆", label: "美妆" },
    { value: "感情", label: "感情" }],
    toDoLists: [
      {
        title: "记事1",
        content: '内容1内容111111111111111111111111111',
        toDoTime: '默认时间1',
        isCompleted: false,
        isOutOfTime: false,
        // 标签
        toDoTags: [{ name: 'school' }, { name: 'famiy' }, { name: '生活' }, { name: '前端' }]
      },
      {
        title: "记事2",
        content: '内容2内容11112221111111111111111内容2内容11112221111111111111111内容2内容11112221111111111111111内容2内容11112221111111111111111内容2内容11112221111111111111111内容2内容11112221111111111111111内容2内容11112221111111111111111',
        toDoTime: '默认时间2',
        isCompleted: false,
        isOutOfTime: false,
        toDoTags: [{ name: '感情' }, { name: 'school' }]
      },
      {
        title: "记事3",
        content: "吃饭睡大觉",
        toDoTime: '默认时间3',
        isCompleted: true,
        isOutOfTime: false,
        toDoTags: [{ name: '美妆' }, { name: 'family' }]
      },
      // 已完成
      {
        title: "记事4",
        content: "吃饭睡大觉",
        toDoTime: '默认时间4',
        isCompleted: true,
        isOutOfTime: false,
        toDoTags: [{ name: '美妆' }, { name: 'family' }]
      },
      // 过期未完成
      {
        title: "记事5",
        content: "吃饭睡大觉",
        toDoTime: '默认时间5',
        isCompleted: false,
        isOutOfTime: true,
        toDoTags: []
      },
    ],
    // 已完成的待办
    completedToDoLists: [
      {
        title: "待办3",
        content: "吃饭睡大觉",
        toDoTime: '默认时间3',
        isCompleted: true,
        isOutOfTime: false
      }
    ],
    // 已过期未完成的待办
    oldToDoLists: [
      {
        title: "待办3",
        content: "吃饭睡大觉",
        toDoTime: '默认时间3',
        isCompleted: false,
        isOutOfTime: true
      }
    ],
    // 记事标签

  },
  getters: {
  },
  mutations: {
    updateCurrentMenu(state, menuName) {
      state.currentMenu = menuName;
    },
    addToDo(state, toDoObj) {
      state.toDoLists.push(toDoObj);
      console.log("调用vuex")
      for (const item of state.toDoLists) {
        console.log(item.title);
      }
    },
    updateIsCollapse(state, val) {
      state.isCollapse = val;
    },
    updateToDoListTag(state, index, tagObj) {
      console.log(tagObj.name);
      state.toDoLists[index].toDoTags.push(tagObj);
    }
  },
  actions: {
  },
  modules: {
  }
})
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
        toDoTime: '2022-03-09 11:34:03',
        isCompleted: false,
        isOutOfTime: false,
        // 标签
        toDoTags: [{ name: 'school' }, { name: 'family' }, { name: '生活' }, { name: '前端' }]
      },
      {
        title: "记事2",
        content: '内容2内容11112221111111111111111内容2内容11112221111111111111111内容2内容11112221111111111111111内容2内容11112221111111111111111内容2内容11112221111111111111111内容2内容11112221111111111111111内容2内容11112221111111111111111',
        toDoTime: '2022-03-09 13:23:43',
        isCompleted: false,
        isOutOfTime: false,
        toDoTags: [{ name: '感情' }, { name: 'school' }]
      },
      {
        title: "记事3",
        content: "吃饭睡大觉",
        toDoTime: '2022-03-09 15:00:00',
        isCompleted: true,
        isOutOfTime: false,
        toDoTags: [{ name: '美妆' }, { name: 'family' }]
      },
      // 已完成
      {
        title: "记事4",
        content: "吃饭睡大觉",
        toDoTime: '2022-03-10 08:00:00',
        isCompleted: true,
        isOutOfTime: false,
        toDoTags: [{ name: '美妆' }, { name: 'family' }]
      },
      // 过期未完成
      {
        title: "记事5",
        content: "吃饭睡大觉",
        toDoTime: '',
        isCompleted: false,
        isOutOfTime: true,
        toDoTags: []
      },
    ],
    // 已被删除的记事
    deletedToDoLists: [],
    // showUpdateTagMenu: false
    searchContent: '',
    searchResult: []
  },
  getters: {
    notifyToDoLosts(state) { // 需要提醒的记事，在toDoLists中进行过滤
      return state.toDoLists.filter(function (todo) {
        return todo.toDoTime !== '' && todo.toDoTime !== null
      })
    },
    getClickTagToDoList: (state) => (tagName) => {
      return state.toDoLists.filter(function (item) {
        return item.toDoTags.forEach(item2 => item2.name === tagName)
      })
    },
    getSearchToDoLists: (state) => (content) => {
      return state.toDoLists.filter(function (item) {
        return (item.title.indexOf(content) !== -1 || item.content.indexOf(content) !== -1)
      })
    }
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
    updateToDoListTag(state, playload) {
      // console.log("调用vuex" + tagObj.name + index);
      state.toDoLists[playload.index].toDoTags.push(playload.tagObj);
    },
    updateToDoList(state, playload) {
      state.toDoLists.splice(playload.index, 1, playload.toDoObj)
    },
    updateToDoTime(state, playload) {
      state.toDoLists[playload.index].toDoTime = playload.toDoTime;
    },
    updateToDoIsComplete(state, playload) {
      state.toDoLists[playload.index].isCompleted = playload.isCompleted
    },
    deleteToDo(state, playload) {
      const deleteTodo = state.toDoLists.splice(playload.index, 1)
      // 往回收站写入被删除的记事
      state.deletedToDoLists.push(deleteTodo[0]);
      console.log("回收站:" + state.deletedToDoLists[0].title);
    },
    // 从回收站还原
    resetToDoFromRush(state, playload) {
      const val = state.deletedToDoLists.splice(playload.index, 1)
      state.toDoLists.push(val[0]);
    },
    // 从回收站永久删除
    foreverDelete(state, playload) {
      state.deletedToDoLists.splice(playload.index, 1)
    },
    // 创建新标签
    addNewTag(state, playload) {
      state.toDoTagsOptions.push(playload);
    },
    // 更新标签名
    updateToDoTagsOptions(state, playload) {
      state.toDoTagsOptions[playload.index].value = playload.value
      state.toDoTagsOptions[playload.index].label = playload.value
    },
    // 删除标签
    deleteToDoTagsOptions(state, playload) {
      state.toDoTagsOptions.splice(playload.index, 1)
    },
    // updateShowUpdateTagMenu(state, playload) {
    //   state.showUpdateTagMenu = playload.status
    // }
    updateSearchContent(state, content) {
      state.searchContent = content
    },
  },
  actions: {
  },
  modules: {
  }
})
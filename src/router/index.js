import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TodoListView from '../views/ToDoListView.vue'
// import NoteView from '../views/NoteView.vue'
// import TagSettingView from '../views/TagSettingView.vue'
// import AddToDo from '@/components/AddToDo.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    redirect: '/todo',
    children: [
      {
        path: '/todo',
        name: 'todo',
        // 懒加载
        // components: () => import(/* webpackChunkName: "about" */ '../views/ToDoListView.vue'),
        component: TodoListView
      },
      {
        path: '/note',
        name: 'note',
        // 懒加载
        component: () => import(/* webpackChunkName: "about" */ '../views/NoteView.vue'),
        // component: NoteView
      },
      {
        path: '/tagSetting',
        name: 'tagSetting',
        // 懒加载
        component: () => import(/* webpackChunkName: "about" */ '../views/TagSettingView.vue'),
        // component: TagSettingView
      },
      {
        path: '/deletedToDo',
        name: 'deletedToDo',
        component: () => import(/* webpackChunkName: "about" */ '../views/DeletedToDoView.vue'),
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
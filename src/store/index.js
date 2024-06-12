import { createStore, createLogger } from 'vuex'
import userStore from './modules/userStore'
import employeeStore from './modules/employeeStore'
import categorizationStore from './modules/categorizationStore'
import taskStore from './modules/taskStore'


const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    userStore,
    employeeStore,
    categorizationStore,
    taskStore
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
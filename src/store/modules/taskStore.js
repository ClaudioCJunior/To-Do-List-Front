import api from "../../axios"

const state = {
  tasks: []
}

// getters
const getters = {
  
}

// actions
const actions = {
  async create ({dispatch, state}, task) {
    try{
        const response = await api.post('/task', task);
        return response;
    }catch(error) {
        return console.error(error.response.data.error);
    }
  },
  async updateStatus ({dispatch, state}, obj) {
    try{
        const response = await api.patch(`/task/${obj.id}`, obj);
        return response;
    }catch(error) {
        return console.error(error.response.data.error);
    }
  },
  async getAll ({dispatch, state}, queryString) {
    try{
      console.log(queryString);

        const response = await api.get(`/task?${queryString}`);

        if(response.status == 200)
            dispatch('setTasks', response.data);
        else
          dispatch('setTasks', []);
    }catch(error) {
        return console.error(error.response.data.error);
    }
  },
  setTasks ({commit}, tasks) {
      commit('setTasks', tasks);
  },
}

// mutations
const mutations = {
  setTasks (state, tasks) {
      state.tasks = tasks;
    }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
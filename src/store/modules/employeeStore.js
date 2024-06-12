import api from "../../axios"

const state = {
  employee: {},
}

// getters
const getters = {
  
}

// actions
const actions = {
  async create ({dispatch, state}, employee) {
    try{
        const response = await api.post('/employee', employee);
        dispatch('setEmployee', response.data.employee);
    }catch(error) {
        return console.error(error.response.data.error);
    }
  },
  async create ({dispatch, state}, employee) {
    try{
        const response = await api.post('/employee', employee);
        dispatch('setEmployee', response.data.employee);
    }catch(error) {
        return console.error(error.response.data.error);
    }
  },
  async listAllByUser ({dispatch, state}, user) {
    debugger;
    try{
        const response = await api.get('/employee/user/' + user.id, { params: { page: 0, perPage:10 } });
        if(response.data.employees.length > 0){
            dispatch('setEmployee', response.data.employees[0]);
        }else{
            const objEmployeeSave = { UserId: user.id, admin: true }

            await dispatch('create', objEmployeeSave);
        }
    }catch(error) {
        return console.error(error.response.data.error);
    }
  },
  setEmployee ({commit}, employee) {
      commit('setEmployee', employee);
  },
}

// mutations
const mutations = {
    setEmployee (state, employee) {
        state.employee = employee;
    }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
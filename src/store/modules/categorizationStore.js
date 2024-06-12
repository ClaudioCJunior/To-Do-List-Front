import api from "../../axios"

const state = {
  categorizations: null,
}

// getters
const getters = {
  
}

// actions
const actions = {
  async getAll ({dispatch, state}, user) {
    try{
        const response = await api.get('/categorization');

        if(response.data.length > 0){
            dispatch('setCategorizations', response.data);
        }
    }catch(error) {
        return console.error(error.response.data.error);
    }
  },
  setCategorizations ({commit}, categorizations) {
      commit('setCategorizations', categorizations);
  },
}

// mutations
const mutations = {
    setCategorizations (state, categorizations) {
        state.categorizations = categorizations;
    }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
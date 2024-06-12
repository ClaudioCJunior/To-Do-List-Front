import api from "../../axios"
import * as storageUser from "../../storage/user";

const state = {
  user: {},
  token: ''
}

// getters
const getters = {
  hasToken: state => {
    return !!state.token;
  },
}

// actions
const actions = {
  async authenticate ({dispatch, state}, user) {
    try{
    const response = await api.post('/auth/login', user)
        if(response.status === 200){
          dispatch('setUser', response.data.user);
          dispatch('setToken', response.data.token);
          dispatch('setTokenStorage', response.data.token);

          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

          return {verificacao: true, msg: ''};
        }else{
          return {verificacao: false, msg: response.error};
        }
        
    }catch(error) {
        return {verificacao: false, msg: error};
    }
  },
  setTokenStorage ({}, token) {
    storageUser.setLocalToken(token);
  },

  setUser ({commit}, user) {
      commit('setUser', user);
  },

  setToken ({commit}, token) {
      commit('setToken', token);
  },
  async validateToken ({dispatch, state}) {

    try{
      let localToken = "";

      if(state.token != ""){
        localToken = state.token;
      }

      localToken = storageUser.getLocalToken();
      if(!localToken){
          return Promise.reject(new Error('Token Inválido'))
      }

      const response = await api.post('/auth/verify-token', {}, {
        headers: {
          'Authorization': `Bearer ${localToken}`
        },
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      if(response.status === 200){
        dispatch('setUser', response.data.user);
        dispatch('setToken', response.data.token);
        dispatch('setTokenStorage', response.data.token);

        return true;
      }else{
        return Promise.reject(new Error('Erro na requisição'));
      }
          
    }catch(error) {
      return Promise.reject(new Error('Erro na requisição'));
    }
  },
  async logout ({dispatch}) 
  {
    dispatch('setTokenStorage', '');
    storageUser.removeLocalToken();
    dispatch('setUser', {});
    dispatch('setToken', '');
  }
}

// mutations
const mutations = {
  setUser (state, user) {
    state.user = user;
  },
  setToken (state, token) {
    state.token = token;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
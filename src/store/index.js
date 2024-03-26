import { createStore } from 'vuex'

export default createStore({
  state: {
    authTokens: localStorage.getItem('authTokens') 
    || {'refresh': null, 'access': null}
  },
  getters: {
  },
  mutations: {
    setToken(state, newAuthTokens) {
      state.authTokens = newAuthTokens;
      localStorage.setItem("authTokenRefresh", newAuthTokens['refresh']);
      localStorage.setItem("authTokenAccess", newAuthTokens['access']);
    },
    delToken(state) {
      state.authTokens = {'refresh': null, 'access': null};
      localStorage.removeItem("authTokenRefresh");
      loaclStorage.removeItem("authTokenAccess");
    },
  },
  actions: {
  },
  modules: {
  }
})

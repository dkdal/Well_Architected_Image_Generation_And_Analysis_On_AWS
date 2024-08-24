import { reactive } from 'vue';

const state = reactive({
  isAuthenticated: false,
});

function login() {
  state.isAuthenticated = true;
}

function logout() {
  state.isAuthenticated = false;
}

export default {
  state,
  login,
  logout,
};

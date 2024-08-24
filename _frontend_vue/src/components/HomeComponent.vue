<template>
    <div>
      <h2>Welcome</h2>
      <button @click="showLogin = true">Login</button>
      <button @click="showLogin = false">Signup</button>
      <LoginComponent v-if="showLogin" />
      <SignupComponent v-else />
    </div>
  </template>
  
  <script>
  import LoginComponent from './LoginComponent.vue';
  import SignupComponent from './SignupComponent.vue';
  
  export default {
    components: {
      LoginComponent,
      SignupComponent,
    },
    data() {
      return {
        showLogin: true,
      };
    },
  };
  </script>
  
  <style scoped>
  button {
    margin: 0.5em;
    padding: 0.5em 1em;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1em;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  
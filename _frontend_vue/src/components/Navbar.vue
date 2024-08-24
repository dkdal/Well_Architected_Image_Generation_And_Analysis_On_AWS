<!-- src/components/Navbar.vue -->
<template>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li v-if="isLoggedIn">
          <router-link to="/generate">Generate Image</router-link>
        </li>
        <li v-if="isLoggedIn">
          <router-link to="/fetch">Fetch Images</router-link>
        </li>
        <li v-if="isLoggedIn">
          <button @click="logout">Logout</button>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/login">Login</router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/signup">Sign Up</router-link>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isLoggedIn: false,
      };
    },
    created() {
      // Check if the user is logged in
      this.checkAuthStatus();
    },
    methods: {
      async checkAuthStatus() {
        // Replace with actual authentication check
        const token = localStorage.getItem('id_token');
        this.isLoggedIn = !!token;
      },
      logout() {
        localStorage.removeItem('id_token');
        this.isLoggedIn = false;
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  nav {
    padding: 1em;
    background-color: #333;
    color: white;
  }
  
  ul {
    list-style: none;
    display: flex;
    gap: 1em;
  }
  
  li {
    margin: 0;
  }
  
  a {
    color: white;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>
  
<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Email:</label>
        <input type="email" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <div v-if="loading">Logging in...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="tokens">
      <p>Login successful!</p>
      <p>ID Token: {{ tokens.id_token }}</p>
      <p>Access Token: {{ tokens.access_token }}</p>
      <p>Refresh Token: {{ tokens.refresh_token }}</p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import auth from '../store/auth';

  export default {
    data() {
      return {
        username: '',
        password: '',
        loading: false,
        error: null,
        tokens: null,
      };
    },
    setup() {
      const router = useRouter();
      return { router };
    },
    methods: {
      async handleLogin() {
        this.loading = true;
        this.error = null;
        this.tokens = null;

        try {
          const response = await axios.post('https://fv0qkf13r5.execute-api.us-east-1.amazonaws.com/dev-cors', {
            username: this.username,
            password: this.password,
          });

          this.tokens = JSON.parse(response.data.body);

          // Set authentication state
          auth.login();

          // Redirect to the ImageGenerator component
          this.router.push('/generate');
        } catch (error) {
          this.error = error.response?.data?.error || 'An error occurred';
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style scoped>
  form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: auto;
  }

  div {
    margin-bottom: 1em;
  }

  label {
    margin-bottom: 0.5em;
    color: #333;
  }

  input {
    border: 1px solid #ccc;
    padding: 0.5em;
    font-size: 1em;
  }

  button {
    padding: 0.7em;
    background-color: #007bff;
    color: white;
    border: none;
    font-size: 1em;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>

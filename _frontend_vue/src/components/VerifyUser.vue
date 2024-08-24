<template>
    <div>
      <h2>Verify Your Email</h2>
      <form @submit.prevent="handleVerify">
        <div>
          <label for="code">Verification Code:</label>
          <input type="text" id="code" v-model="code" required />
        </div>
        <button type="submit">Verify</button>
      </form>
      <div v-if="loading">Verifying...</div>
      <div v-if="error">{{ error }}</div>
      <div v-if="message">{{ message }}</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        code: '',
        loading: false,
        error: null,
        message: null,
      };
    },
    setup() {
      const router = useRouter();
      return { router };
    },
    methods: {
      async handleVerify() {
        this.loading = true;
        this.error = null;
        this.message = null;
  
        try {
          const response = await axios.post('https://2414aoo8f9.execute-api.us-east-1.amazonaws.com/dev-cors', {
            email: this.$route.query.email,
            confirmation_code: this.code,
          });
  
          this.message = response.data.message;
          // Redirect to login after successful verification
          this.router.push('/');
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
  
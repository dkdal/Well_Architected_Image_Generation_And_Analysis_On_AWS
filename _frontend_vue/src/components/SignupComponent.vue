<template>
  <div>
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSignUp" v-if="!verificationRequired">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Sign Up</button>
    </form>
    <div v-if="loading">Signing up...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="message">{{ message }}</div>
    
    <div v-if="verificationRequired">
      <h2>Verify Your Email</h2>
      <form @submit.prevent="handleVerify">
        <div>
          <label for="code">Verification Code:</label>
          <input type="text" id="code" v-model="code" required />
        </div>
        <button type="submit">Verify</button>
      </form>
      <div v-if="loading">Verifying...</div>
      <div v-if="verifyError">{{ verifyError }}</div>
      <div v-if="verifyMessage">{{ verifyMessage }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      code: '',
      loading: false,
      error: null,
      message: null,
      verificationRequired: false,
      verifyError: null,
      verifyMessage: null,
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async handleSignUp() {
      this.loading = true;
      this.error = null;
      this.message = null;

      try {
        const response = await axios.post('https://fhd73czqfa.execute-api.us-east-1.amazonaws.com/dev-cors', {
          name: this.name,
          email: this.email,
          password: this.password,
        });

        this.message = response.data.message;
        this.verificationRequired = true;
      } catch (error) {
        this.error = error.response?.data?.error || 'An error occurred';
      } finally {
        this.loading = false;
      }
    },
    async handleVerify() {
      this.loading = true;
      this.verifyError = null;
      this.verifyMessage = null;

      try {
        const response = await axios.post('https://2414aoo8f9.execute-api.us-east-1.amazonaws.com/dev-cors', {
          email: this.email,
          confirmation_code: this.code,
        });

        this.verifyMessage = response.data.message;
        // Redirect to login after successful verification
        this.router.push('/');
      } catch (error) {
        this.verifyError = error.response?.data?.error || 'An error occurred';
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

<template>
    <div>
      <h1>Image Generator</h1>
      <input v-model="prompt" placeholder="Enter a prompt" />
      <button @click="generateImage">Generate Image</button>
      <div v-if="loading">Generating image...</div>
      <div v-if="error">{{ error }}</div>
      <div v-if="successMessage">{{ successMessage }}</div>
      <img v-if="imageUrl" :src="imageUrl" alt="All Generated Images" />
    <ImageGallery />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import ImageGallery from './ImageGallery.vue';
  
  export default {
    components: {
      ImageGallery,
    },
    data() {
      return {
        prompt: '',
        loading: false,
        error: null,
        imageUrl: null,
        successMessage: null,
      };
    },
    methods: {
      async generateImage() {
        this.loading = true;
        this.error = null;
        this.imageUrl = null;
        this.successMessage = null;
        
        try {
          const response = await axios.post('https://xgkkc38so0.execute-api.us-east-1.amazonaws.com/dev-cors', {
            prompt: this.prompt,
          });
          const parsedResponseBody = JSON.parse(response.data.body);
          console.log('GENERATION RESPONSE IMAGE URL: ', parsedResponseBody);
          console.log('GENERATION RESPONSE IMAGE URL: ', parsedResponseBody.image_url);

          this.imageUrl = parsedResponseBody.image_url;
          this.successMessage = 'Congratulations! The requested image has been generated successfully. Here is the image URL: ' + this.imageUrl;
        } catch (error) {
          this.error = 'Failed to generate image';
          if (error.response) {
            this.error += `: ${error.response.data.error}`;
          }
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  input {
    padding: 10px;
    margin: 10px 0;
    width: 100%;
  }
  button {
    padding: 10px 20px;
  }
  img {
    margin-top: 20px;
    max-width: 100%;
  }
  </style>
  
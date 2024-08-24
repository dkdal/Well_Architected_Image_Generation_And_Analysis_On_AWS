<template>
    <div>
      <h2>Generated Images</h2>
      <button @click="fetchImages">Fetch Generated Images</button>
      <div v-if="loading">Fetching images...</div>
      <div v-if="error">{{ error }}</div>
      <div v-if="imageUrls.length">
        <div class="image-container">
          <img v-for="url in imageUrls" :key="url" :src="url" :alt="url" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        loading: false,
        error: null,
        imageUrls: [],
      };
    },
    methods: {
      async fetchImages() {
        this.loading = true;
        this.error = null;
        this.imageUrls = [];
  
        try {
          const response = await axios.get('https://00ewcs17p7.execute-api.us-east-1.amazonaws.com/dev-cors', {
            params: {
              bucket: 'ca-store-images',
              prefix: 'generated-images/'
            }
          });
          console.log("FETCHED IMAGES", response);
          const parsedResponseBody = JSON.parse(response.data.body);
          console.log('GENERATION RESPONSE IMAGE URL: ', parsedResponseBody.image_urls);
          this.imageUrls = parsedResponseBody.image_urls;
        } catch (error) {
          this.error = 'Failed to fetch images';
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
  button {
    padding: 10px 20px;
    margin-bottom: 20px;
  }
  .image-container {
    display: flex;
    flex-wrap: wrap;
  }
  img {
    max-width: 100%;
    margin: 10px;
  }
  </style>
  
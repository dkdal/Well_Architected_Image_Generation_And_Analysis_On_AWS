import React, { useState } from 'react';
import axios from 'axios';
import './ImageGenerator.css';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post('https://xgkkc38so0.execute-api.us-east-1.amazonaws.com/generate', {
        prompt: prompt
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseBody = JSON.parse(response.data.body);
      setImageUrl(responseBody.image_url);
      setSuccessMessage('Congratulations! The requested image has been generated successfully.');
    } catch (error) {
      setError('Failed to generate image');
      if (error.response) {
        setError((prevError) => prevError + `: ${error.response.data.error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generator-container">
      <h1 className="generator-title">Image Generator</h1>
      <div className="input-container">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt"
          className="prompt-input"
        />
        <button onClick={generateImage} className="generate-button" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>
      {loading && <div className="loading-message">Generating image...</div>}
      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
          <div className="image-details">
            <p>Image URL:</p>
            <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="image-url">
              {imageUrl}
            </a>
          </div>
        </div>
      )}
      {imageUrl && <img src={imageUrl} alt="Generated" className="generated-image" />}
    </div>
  );
};

export default ImageGenerator;

import React, { useState } from 'react';
import axios from 'axios';
import './ImageGallery.css';

const ImageGallery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    setImageUrls([]);

    const params = {
      bucket: 'ca-store-images',
      prefix: 'generated-images/',
    };

    const input = {
      params: params,
      action: "/fetchAll"
    };

    const apiParams = {
      input: JSON.stringify(input),
      stateMachineArn: 'arn:aws:states:us-east-1:761577439658:stateMachine:imageHandler'
    };

    try {
      const response = await axios.get('https://00ewcs17p7.execute-api.us-east-1.amazonaws.com/fetchAll', params, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const responseBody = JSON.parse(response.data.body);
      setImageUrls(responseBody.image_urls);
    } catch (error) {
      setError('Failed to fetch images');
      if (error.response) {
        setError((prevError) => prevError + `: ${error.response.data.error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">Generated Images</h2>
      <button onClick={fetchImages} className="fetch-button" disabled={loading}>
        {loading ? 'Fetching Images...' : 'Fetch Generated Images'}
      </button>
      {error && <div className="error-message">{error}</div>}
      {imageUrls.length > 0 ? (
        <div className="image-grid">
          {imageUrls.map((url) => (
            <div key={url} className="image-item">
              <img src={url} alt="Generated" className="gallery-image" />
            </div>
          ))}
        </div>
      ) : !loading && !error && (
        <div className="no-images">No images available</div>
      )}
    </div>
  );
};

export default ImageGallery;

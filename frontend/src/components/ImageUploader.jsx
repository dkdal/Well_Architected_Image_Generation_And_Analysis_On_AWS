import React, { useState } from 'react';
import axios from 'axios';
import './ImageUploader.css'; // Import the CSS for styling

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [s3ImageUrl, setS3ImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleS3ImageUrlChange = (event) => {
    setS3ImageUrl(event.target.value);
  };

  const handleUpload = async () => {
    if (!image) {
      setError('Please upload an image first.');
      return;
    }

    if (!s3ImageUrl) {
      setError('Please enter the S3 image URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];

        const uploadedImage = {
          image: base64Image
        };
        const input = {
          body: uploadedImage,
          action: "/upload"
        };

        const response = await axios.post('https://v1mq7l3x58.execute-api.us-east-1.amazonaws.com/upload', {
          body: uploadedImage
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.statusCode === 200) {
          setGeneratedImage(base64Image);
          setSuccessMessage('Image uploaded successfully!');

          const comparisonResponse = await axios.post('https://2z387c0nu9.execute-api.us-east-1.amazonaws.com/compare', {
            uploaded_image_base64: base64Image,
            s3_image_url: s3ImageUrl
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          setComparisonResult(comparisonResponse.data);
        } else {
          setError('Image uploading failed.');
        }
      };
    } catch (err) {
      setError('An error occurred while uploading the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uploader-container">
      <h2 className="uploader-title">Image Uploader</h2>
      <div className="input-group">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="file-input"
        />
        <input 
          type="text" 
          placeholder="Enter S3 image URL" 
          value={s3ImageUrl} 
          onChange={handleS3ImageUrlChange} 
          className="url-input"
        />
      </div>
      <button onClick={handleUpload} className="upload-button" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {generatedImage && <img src={`data:image/png;base64,${generatedImage}`} alt="Uploaded" className="uploaded-image" />}
      {comparisonResult && (
        <div className="comparison-result">
          <h3>Comparison Result</h3>
          <table className="result-table">
            <tbody>
              {Object.entries(comparisonResult).map(([key, value]) => (
                <tr key={key}>
                  <td className="result-key">{key}</td>
                  <td className="result-value">{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

import React, { useState } from 'react';
import axios from 'axios';
import './ImageAnalyzer.css';

const ImageAnalyzer = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async () => {
    if (!imageUrl) {
      setError('Please enter an image URL first.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await axios.post('https://o4i603g045.execute-api.us-east-1.amazonaws.com/analyze', {
        image_url: imageUrl
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setAnalysisResult(response.data);
    } catch (error) {
      setError('Failed to analyze the image');
      if (error.response) {
        setError((prevError) => prevError + `: ${error.response.data.error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderTableData = (data) => {
    const flattenData = (obj, parentKey = '', res = []) => {
      for (const [key, value] of Object.entries(obj)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          flattenData(value, newKey, res);
        } else {
          res.push({ key: newKey, value: typeof value === 'object' ? JSON.stringify(value) : value });
        }
      }
      return res;
    };

    const flattenedData = flattenData(data);

    return flattenedData.map(({ key, value }) => (
      <tr key={key}>
        <td>{key}</td>
        <td>{value}</td>
      </tr>
    ));
  };

  return (
    <div className="analyzer-container">
      <h2 className="analyzer-title">Image Analyzer</h2>
      <div className="input-container">
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="url-input"
        />
        <button onClick={handleAnalyze} className="analyze-button" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {analysisResult && (
        <div className="result-container">
          <h3 className="result-title">Analysis Result</h3>
          <table className="result-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {renderTableData(analysisResult)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;

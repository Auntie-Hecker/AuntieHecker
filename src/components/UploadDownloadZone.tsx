import React, { useState } from 'react';

const UploadDownloadZone: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<string>('');

  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/test-connection');
      const data = await response.json();
      if (data.connected) {
        setConnectionStatus('✅ Connected to Neo4j');
      } else {
        setConnectionStatus('❌ Neo4j connection failed');
      }
    } catch (error) {
      console.error('Failed to test connection:', error);
      setConnectionStatus('❌ Server connection failed');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setUploadResult('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadResult('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadResult('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/api/upload-iocs', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult(`✅ Upload successful: ${result.processed} IOCs processed, ${result.errors} errors`);
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setUploadResult(`❌ Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadResult('❌ Upload failed: Network error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section id="upload-download-zone" style={{ padding: '2rem 0' }}>
      <h2>Upload / Download Zone</h2>
      <p>Upload IOC data to Neo4j and download analysis results.</p>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h3>Neo4j Connection</h3>
        <button 
          onClick={testConnection}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          Test Connection
        </button>
        {connectionStatus && (
          <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
            {connectionStatus}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h3>Upload IOC Data</h3>
        <p>Upload CSV files with IOC data (format: IOC_Type, IOC_Value, Source_Document)</p>
        
        <div style={{ marginBottom: '1rem' }}>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ marginBottom: '0.5rem' }}
          />
          {file && (
            <div style={{ fontSize: '0.9em', color: '#666' }}>
              Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: file && !uploading ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: file && !uploading ? 'pointer' : 'not-allowed'
          }}
        >
          {uploading ? 'Uploading...' : 'Upload to Neo4j'}
        </button>

        {uploadResult && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.5rem', 
            backgroundColor: uploadResult.includes('✅') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${uploadResult.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px'
          }}>
            {uploadResult}
          </div>
        )}
      </div>

      <div style={{ fontSize: '0.9em', color: '#666' }}>
        <h4>Supported File Formats:</h4>
        <ul>
          <li>CSV files with columns: IOC_Type, IOC_Value, Source_Document</li>
          <li>Supported IOC types: domain, ip, hash</li>
        </ul>
      </div>
    </section>
  );
};

export default UploadDownloadZone;

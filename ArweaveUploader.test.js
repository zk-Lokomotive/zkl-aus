import React, { useState } from 'react';
import Arweave from 'arweave';

const ArweaveUploaderTest = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  // Initialize Arweave connection
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });

  // File upload process
  const uploadFile = async (file) => {
    try {
      setUploadStatus('Dosya yükleniyor...');

      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = new Uint8Array(e.target.result);

        // Create a new transaction
        const transaction = await arweave.createTransaction({ data: fileData });

        // Sign the transaction (a real wallet should be used in this step)
        await arweave.transactions.sign(transaction);

        // Send the transaction
        const response = await arweave.transactions.post(transaction);

        if (response.status === 200) {
          const fileAddress = `https://arweave.net/${transaction.id}`;
          setUploadedFiles(prevFiles => [...prevFiles, { name: file.name, address: fileAddress }]);
          setUploadStatus('Dosya başarıyla yüklendi!');
        } else {
          setUploadStatus('Dosya yüklenirken bir hata oluştu.');
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Yükleme hatası:', error);
      setUploadStatus('Dosya yüklenirken bir hata oluştu.');
    }
  };

  // Handler for multiple file selection
  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    for (const file of files) {
      await uploadFile(file);
    }
  };

  // Function to clear uploaded files
  const clearUploadedFiles = () => {
    setUploadedFiles([]);
    setUploadStatus('');
  };

  return (
    <div>
      <h2>Arweave Dosya Yükleyici Testi</h2>
      <input type="file" onChange={handleFileSelect} multiple />
      <button onClick={clearUploadedFiles}>Yüklenen Dosyaları Temizle</button>
      <p>{uploadStatus}</p>
      <h3>Yüklenen Dosyalar:</h3>
      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={index}>
            {file.name}: <a href={file.address} target="_blank" rel="noopener noreferrer">{file.address}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArweaveUploaderTest;

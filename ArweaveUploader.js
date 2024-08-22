import React, { useState } from 'react';
import Arweave from 'arweave';

const ArweaveUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [fileAddress, setFileAddress] = useState('');

  // Initialize Arweave connection
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });

  // Handler for file selection
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus('');
    setFileAddress('');
  };

  // File upload process
  const uploadFile = async () => {
    if (!selectedFile) {
      setUploadStatus('Lütfen bir dosya seçin.');
      return;
    }

    try {
      setUploadStatus('Dosya yükleniyor...');

      // Read the file
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
          setUploadStatus('Dosya başarıyla yüklendi!');
          setFileAddress(`https://arweave.net/${transaction.id}`);
        } else {
          setUploadStatus('Dosya yüklenirken bir hata oluştu.');
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error('Yükleme hatası:', error);
      setUploadStatus('Dosya yüklenirken bir hata oluştu.');
    }
  };

  return (
    <div>
      <h2>Arweave Dosya Yükleyici</h2>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={uploadFile}>Dosyayı Yükle</button>
      <p>{uploadStatus}</p>
      {fileAddress && (
        <div>
          <p>Dosya Adresi:</p>
          <a href={fileAddress} target="_blank" rel="noopener noreferrer">
            {fileAddress}
          </a>
        </div>
      )}
    </div>
  );
};

export default ArweaveUploader;

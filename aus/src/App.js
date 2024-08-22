import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import Arweave from 'arweave';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

function App() {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (isConnected && chain && chain.id !== 5) {
      switchNetwork?.(5); // Goerli testnet'in chain ID'si
    }
  }, [isConnected, chain, switchNetwork]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const transaction = await arweave.createTransaction({ data: data });

      try {
        await arweave.transactions.sign(transaction);
        const response = await arweave.transactions.post(transaction);

        if (response.status === 200) {
          setUploadedFiles([...uploadedFiles, {
            name: file.name,
            hash: transaction.id
          }]);
          setFile(null);
        } else {
          console.error('Dosya yükleme başarısız oldu:', response);
          alert('Dosya yükleme başarısız oldu. Lütfen tekrar deneyin.');
        }
      } catch (error) {
        console.error('Dosya yükleme hatası:', error);
        alert('Dosya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h1>Arweave Dosya Yükleme Uygulaması</h1>
      <ConnectButton />
      {isConnected && chain && chain.id === 5 ? (
        <>
          <input type="file" onChange={handleFileChange} />
          <button onClick={uploadFile} disabled={!file}>Dosya Yükle</button>
          <h2>Yüklenen Dosyalar:</h2>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                {file.name}: <a href={`https://arweave.net/${file.hash}`} target="_blank" rel="noopener noreferrer">{file.hash}</a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Lütfen Metamask'ı bağlayın ve Goerli testnet'e geçin.</p>
      )}
    </div>
  );
}

export default App;
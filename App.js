import React from 'react';
import ArweaveUploaderTest from './ArweaveUploaderTest';
import ArweaveUploader from './ArweaveUploader';

function App() {
  return (
    <div className="App">
      <h1>Arweave Dosya Yükleme Uygulaması</h1>
      <ArweaveUploader />
      <hr />
      <h2>Test Bileşeni</h2>
      <ArweaveUploaderTest />
    </div>
  );
}

export default App;
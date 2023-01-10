import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { ethers } from 'ethers';
import FileInput from './components/FileInput';
import { useState } from 'react';

var prov = new ethers.providers.JsonRpcProvider();

function Home() {
  const [fileText, setTextValue] = useState('');
  return (
    <div>
      <FileInput setTextValue={setTextValue} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

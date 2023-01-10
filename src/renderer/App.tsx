import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { ethers } from 'ethers';
import FileInput from './components/FileInput';
import { useState } from 'react';
import { MainForm } from './components/MainForm';
import { SpeedupType } from 'logic/enums/SpeedupType';

function Home() {
  const [fileText, setTextValue] = useState('');
  const [speedupType, setSpeedupType] = useState(SpeedupType.Absolute);
  return (
    <div>
      <FileInput setTextValue={setTextValue} />
      <div className="home">
        <div className="form-div">
          <MainForm speedupType={speedupType} setSpeedupType={setSpeedupType} />
        </div>
      </div>
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

import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { ethers } from 'ethers';
import FileInput from './components/FileInput';
import { useState } from 'react';
import { MainForm } from './components/MainForm';
import { SpeedupType } from 'logic/enums/SpeedupType';
import { TxTable } from './components/TxTable';
function Home() {
  const [fileText, setTextValue] = useState('');

  const [pendingTable, setPendingTable] = useState([]);
  return (
    <div>
      <FileInput setTextValue={setTextValue} />
      <div className="home">
        <div className="form-div">
          <MainForm
            fileText={fileText}
            pendingTable={pendingTable}
            setPendingTable={setPendingTable}
          />
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <TxTable pendingTable={pendingTable} />
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

import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import {ethers} from 'ethers';
import FileInput from './components/FileInput';
import {useState} from 'react';
import {MainForm} from './components/MainForm';

var prov = new ethers.providers.JsonRpcProvider(
  'https://darkforestsecond.xyz/dNuaLgyKssrk9TEPPz9NTyQT'
);

prov
  .getTransaction(
    '0x7e41d74b24420746df911dccb5a4697269467abd0404bfa716ade961e6bfdcea'
  )
  .then(console.log);
function Home() {
    const [fileText,
        setTextValue] = useState('');
    return (
        <div>
            <FileInput setTextValue={setTextValue}/>
            <div className='home'>
                <div className="form-div">
                    <MainForm/>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={< Home />}/>
            </Routes>
        </Router>
    );
}

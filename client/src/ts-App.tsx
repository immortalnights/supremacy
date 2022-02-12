import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  let w: Worker;
  const start = () => {
    console.log("start")
    w = new window.Worker(`${process.env.PUBLIC_URL}/supremacy/index.js`, { type: "module" })
  }

  const msg = () => {
    w.postMessage("hello")
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={start}>Start</button>
        <button onClick={msg}>Message</button>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

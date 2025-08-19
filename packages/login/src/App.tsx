import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login/index';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}


export default App;

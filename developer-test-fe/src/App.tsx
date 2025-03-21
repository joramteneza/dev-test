// src/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store'; // Redux store
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import UserGoals from './pages/UserGoals';
// import Goals from './pages/Goals';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/goals/:userId" element={<UserGoals />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;

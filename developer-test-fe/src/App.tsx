import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UserGoals from "./pages/UserGoals";

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

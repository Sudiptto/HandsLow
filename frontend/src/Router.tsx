import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import SelectDrill from "./pages/selectDrill";
import UploadDrill from "./pages/UploadDrill";
import Analysis from "./pages/analysis";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LiveCoach from "./pages/liveCoach";

// Import your components

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" Component={HomePage}></Route>
        <Route path="/selectDrill" Component={SelectDrill}></Route>
        <Route path="/uploadDrill" Component={UploadDrill}></Route>
        <Route path="/analysis" Component={Analysis}></Route>
        <Route path="liveCoach" Component={LiveCoach}></Route>

        {/* <Route path="*" Component={NotFound}></Route>
        <Route path="/login" Component={LoginPage}></Route>
        <Route path="/register" Component={RegisterPage}></Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
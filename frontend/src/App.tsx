import React from 'react';
import AppProvider from "./store/appProvider.tsx"; // Assuming AppProvider is the context provider
import Router from './Router.tsx';
import Navbar from './components/Navbar.tsx';


const App: React.FC = () => {
  return (
    <AppProvider>
      <Navbar/>
      <Router/>
    </AppProvider>
  );
};

export default App;

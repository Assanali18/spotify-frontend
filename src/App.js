
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { RouteList } from "./routes";
import {AuthProvider} from "./contexts/AuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import './App.css'
import {AudioPlayerProvider} from "./contexts/AudioPlayerContex";

 const App = () => {
  return (
      <AuthProvider>
          <AudioPlayerProvider>
              <BrowserRouter>
                  <Header />
                  <Sidebar />
                  <RouteList />

              </BrowserRouter>
          </AudioPlayerProvider>
      </AuthProvider>

  );
};

export default App;
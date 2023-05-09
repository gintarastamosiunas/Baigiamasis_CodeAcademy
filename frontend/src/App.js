import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import React, { Component } from 'react';

import Navigation from './components/Navigation/navigation';
import AuthPage from './pages/Auth';
import SignupPage from './pages/Signup';
import RegistrationPage from './pages/Registrations'
import AuthContext from './context/auth-context';
import EventPage from './pages/Event';

class App extends Component {

  state = {
    token: sessionStorage.getItem('token'),
    userId: sessionStorage.getItem('userId')
  };

  login = (token, userId) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userId', userId);
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    sessionStorage.clear();
    this.setState({ token: null, userId: null });
  };
  
  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider value={{ 
          token: this.state.token, 
          userId: this.state.userId,
           login: this.login, 
           logout: this.logout }}>
          <Navigation />
          <Routes>
            {this.state.token && <Route path="/" element={<Navigate to="/register" replace exact />} />}
            {!this.state.token && <Route path="/" element={<Navigate to="/auth" replace exact />} />}
            {!this.state.token && <Route path='/auth' Component={AuthPage}/>}
            {this.state.token && <Route path="/auth" element={<Navigate to="/register" replace />} />}
            {!this.state.token && <Route path='/signup' Component={SignupPage}/>}
            {this.state.token && <Route path="/signup" element={<Navigate to="/register" replace />} />}
            {this.state.token && <Route path="/register" Component={RegistrationPage} />}
            {!this.state.token && <Route path="/register" element={<Navigate to="/auth" replace />} />}
            {this.state.token && <Route path="/event" Component={EventPage} />}
            {!this.state.token && <Route path="/event" element={<Navigate to="/auth" replace />} />}
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;

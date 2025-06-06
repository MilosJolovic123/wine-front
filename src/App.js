import logo from './logo.svg';
import './App.css';

import { Link, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/routes-component/ProtectedRoute';
import React from 'react';
import Home from './components/home-component/Home';
import SignIn from './components/login-component/SignIn';
import KreirajPlan from './components/kreiraj-plan-component/KreirajPlan'
import '@fontsource/roboto';
import PregledajSvePlanove from './components/pregledaj-planove/PregledajSvePlanove';
import SvePorudzbenice from './components/sve-porudzbenice/SvePorudzbenice';
import KreirajPorudzbenicu from './components/kreiraj-porudzbenicu/KreirajPorudzbenicu';
import ForbiddenComponent from './components/forbidden-component/ForbiddenComponent';
import PogledajPL from './components/svi-proizvodni-listovi/PogledajPL';
import KreirajPL from './components/kreiraj-proizvodni-list/KreirajPL';

function App() {


  return (
    <div className='App'>
      
  <Routes>
    <Route path="/login" element={<SignIn/>}/>
    <Route
    path="/"
    element ={
      <ProtectedRoute children={<Home />} role={["Šef proizvodnje","Komercijalista","Enolog"]}/>
    }
    />
    <Route
      path="/kreiraj-plan"
      element ={
      <ProtectedRoute children={<KreirajPlan/>} role = {["Šef proizvodnje"]}/>
      }
    />
      <Route
      path="/svi-planovi"
      element ={
        <ProtectedRoute children={<PregledajSvePlanove/>} role = {["Šef proizvodnje"]}/>
      }
    />
     <Route
      path="/sve-porudzbenice"
      element ={
        <ProtectedRoute children={<SvePorudzbenice/> } role = {["Komercijalista"]}/>
      }
    />
    <Route
      path="/kreiraj-porudzbenicu"
      element ={
        <ProtectedRoute children={<KreirajPorudzbenicu/>} role = {["Komercijalista"]}/>
      }
    />
    <Route
    path="/svi-proizvodni-listovi"
    element ={
      <ProtectedRoute children={<PogledajPL/>} role = {["Enolog","Šef proizvodnje"]}/>
    }
    />
    <Route
    path="/kreiraj-proizvodni-list"
    element={
      <ProtectedRoute children={<KreirajPL/>} role = {["Enolog"]}/>
    }
    />
    <Route
      path = "/403"
      element ={
        <ForbiddenComponent/> 
      }
    />
  </Routes>
    </div>

  );
}

export default App;

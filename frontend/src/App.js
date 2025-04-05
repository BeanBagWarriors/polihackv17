import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Map from './pages/Map';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar/>
        <Routes> 
          <Route path = "/" element={<HomePage/>}/>
          <Route path = "/home" element={<HomePage/>}/>
          <Route path = "/map" element={<Map/>}/>
          <Route path = "/dashboard" element={<Dashboard/>}/>
          <Route path = "/analytics" element={<Analytics/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

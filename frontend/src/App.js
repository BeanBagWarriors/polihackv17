import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Map from './pages/Map';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar/>

        <Routes>
          
        <Route path = "/" element={<HomePage/>}/>
        <Route path = "/home" element={<HomePage/>}/>
          <Route path = "/map" element={<Map/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

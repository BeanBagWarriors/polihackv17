import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar/>

        <Routes>
          <Route path = "/home" element={<HomePage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

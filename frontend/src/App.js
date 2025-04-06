import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Map from './pages/Map';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Configuration from './pages/Configuration';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Product from './pages/Product';
import NotFound from './pages/NotFound';
import InventoryPage from './pages/InventoryPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar/>
        <Routes> 
          <Route path = "*" element={<NotFound/>}/>
          <Route path = "/" element={<HomePage/>}/>
          <Route path = "/home" element={<HomePage/>}/>
          <Route path = "/map" element={<Map/>}/>
          <Route path = "/dashboard" element={<Dashboard/>}/>
          <Route path = "/analytics" element={<Analytics/>}/>
          <Route path = "/machine/:id/stock" element={<Configuration/>}/>
          <Route path = "/signin" element={<SignIn/>}/>
          <Route path = "/signup" element={<SignUp/>}/>
          <Route path = "/product" element={<Product/>}/>
          <Route path = "/inventory/:id" element={<InventoryPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AddProduct from './pages/AddProduct.jsx';
import ProtectedRoute from './routes/protectedRoute.js';
function App() {
  return (
   <>
   <Router>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/' element={<ProtectedRoute><AddProduct/></ProtectedRoute> }/>
    </Routes>
   </Router>
   </>
  );
}

export default App;

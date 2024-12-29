import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddProduct from './pages/AddProduct';
import ProtectedRoute from './routes/protectedRoute';
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

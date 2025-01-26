
import './App.css'
import { Toaster } from 'react-hot-toast';
import { Login,Registers,Home,Link,UserDetails,Analytics} from '../pages/index';

import { BrowserRouter, Routes,Route} from 'react-router-dom';

function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registers />} />
      <Route path="/" element={<Home />} />
      <Route path="/link" element={<Link />} />
      <Route path="/details" element={<UserDetails />} />
      <Route path="/Analytics" element={<Analytics />} />
   

    </Routes>
 
       
    </BrowserRouter>
    <Toaster />

    </>
    
  )
}

export default App

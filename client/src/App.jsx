import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import signin from "./pages/signin"
import signOut from "./pages/signOut";
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/signin" element={<signin/>}/>
      <Route path="/signOut" element={<signOut/>}/>
      <Route path="/profile" element={<profile/>}/>      
       </Routes>
      </BrowserRouter>
  )
}

export default App
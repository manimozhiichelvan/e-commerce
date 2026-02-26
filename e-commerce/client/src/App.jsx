import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";
import MyOrders from "./pages/MyOrders";

function App(){
 return(
  <BrowserRouter>
   <Routes>
    <Route path="/" element={<Navigate to="/login"/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/products"
      element={<ProtectedRoute><Products/></ProtectedRoute>}/>
    <Route path="/cart"
      element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
    <Route path="/admin"
      element={<ProtectedRoute adminOnly><AdminDashboard/></ProtectedRoute>}/>
      <Route
  path="/product/:id"
  element={
    <ProtectedRoute>
      <ProductDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/my-orders"
  element={
    <ProtectedRoute>
      <MyOrders />
    </ProtectedRoute>
  }
/>
   </Routes>
   
  </BrowserRouter>
 );
}
export default App;
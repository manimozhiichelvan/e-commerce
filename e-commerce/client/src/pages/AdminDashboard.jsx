import { useState,useEffect } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

const AdminDashboard=()=>{
  const [products,setProducts]=useState([]);
  const [form,setForm]=useState({});

  useEffect(()=>{
    axios.get("/products").then(res=>setProducts(res.data));
  },[]);

  const add=async()=>{
    await axios.post("/products",form);
    alert("Product Added");
  };

  const del=async(id)=>{
    await axios.delete(`/products/${id}`);
    setProducts(products.filter(p=>p.id!==id));
  };

  return(
    <>
      <Navbar/>
      <h2>Admin Dashboard</h2>
      <input placeholder="Name"
        onChange={(e)=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Description"
        onChange={(e)=>setForm({...form,description:e.target.value})}/>
      <input placeholder="Price"
        onChange={(e)=>setForm({...form,price:e.target.value})}/>
      <input placeholder="Stock"
        onChange={(e)=>setForm({...form,stock:e.target.value})}/>
      <input placeholder="Image URL"
        onChange={(e)=>setForm({...form,image:e.target.value})}/>
      <button onClick={add}>Add Product</button>

      {products.map(p=>(
        <div key={p.id}>
          {p.name}
          <button onClick={()=>del(p.id)}>Delete</button>
        </div>
      ))}
    </>
  );
};

export default AdminDashboard;
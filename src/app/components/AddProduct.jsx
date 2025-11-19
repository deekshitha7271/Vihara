'use client'
import { productAction } from '../serverActions/productAction';
import admin from './components.module.css'
import { useState } from 'react';
const AddProduct = () => {
    const [title,setTitle]=useState('')
    const [price,setPrice]=useState('')
    const [offer,setOffer]=useState('')
    const [amen,setAmen]=useState('')
    const [description,setDescription]=useState('')
    const [image,setImage]=useState('')

    const recordHandler=async(e)=>{
        e.preventDefault();
        const recordDetails={title,price,offer,amen,description,image};
        console.log(recordDetails);
        const data=new FormData();
        data.append('title',title);
        data.append('price',price);
        data.append('offer',offer);
        data.append('amen',amen);
        data.append('description',description);
        data.append('image',image);

        try{
          const response = await fetch('/api/admin/add-product',{
            method:'POST',
            body:data
          });
          const result=await response.json();
          if(result.success){
            alert('Record added succesfully');
            setTitle('')
            setPrice('')
            setOffer('')
            setDescription('')
            setAmen('')
            setImage('')


          }

        }catch(e){
          console.log("Error in adding record:",e);
        }
    }
    return ( 
    <div>
       <div className={admin.container}>
    <h1>Add Record</h1>
    <form onSubmit={recordHandler} encType='multipart/form-data'>
     <div className={admin.fields}>
    <div className="">
    <h3>Title</h3>
    <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)}/>
    </div>
     <div>
     <h3>Price</h3>
     <input type="number" value={price} onChange={(e)=>setPrice(e.target.value)}/>
     </div>
     </div>
     <div  className={admin.fields}>
    <div className="">
    <h3>Offer</h3>
    <input type="number" value={offer} onChange={(e)=>setOffer(e.target.value)}/>
    </div>
      <div className="">
      <h3>Amenities</h3>
      <input type="text" value={amen} onChange={(e)=>setAmen(e.target.value)}/>
      </div>
     </div>
    <div className={admin.textField}>
    <h3>Description</h3>
    <textarea type="text" rows="5" value={description} onChange={(e)=>setDescription(e.target.value)}/>
    </div>
     <div className={admin.textField}>
     <h3>Upload Image</h3>
     <input type="file" accept='image/*' onChange={(e)=>setImage(e.target.files[0])}/>
     </div>
    <div className={admin.submit}>
    <button type='submit'>
      Submit
     </button>
    </div>
    </form>
  </div> 
    </div> );
}
 
export default AddProduct;
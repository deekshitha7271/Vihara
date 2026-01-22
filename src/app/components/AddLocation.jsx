'use client'
import admin from './components.module.css'
import { useState } from 'react';
const AddLocation = () => {
    
    const [image,setImage]=useState('')
    const [location,setLocation]=useState('')
    const [description,setDescription]=useState('')
    const [category, setCategory]=useState('')
    const locationHandler=async(e)=>{
        e.preventDefault();
        const recordDetails={image,location,description,category};
        console.log(recordDetails);
        const data=new FormData();
        
        data.append('image',image);
        data.append('location',location)
        data.append('description',description)
        data.append('category',category)
        try{
          const response = await fetch('/api/admin/add-location',{
            method:'POST',
            body:data
          });
          const result=await response.json();
          console.log("Result:",result)
          if(result.success){
            alert('Record added succesfully');
            
            setImage('')
            setLocation('')
            setDescription('')
            setCategory('')

          }
          

        }catch(e){
          console.log("Error in adding record:",e);
        }
    }
    return ( 
    <div>
       <div className={admin.container}>
    <h1>Add Location</h1>
    <form onSubmit={locationHandler} encType='multipart/form-data'>
    
     
    
     <div className={admin.textField}>
     <h3>Upload Image</h3>
     <input type="file" accept='image/*' onChange={(e)=>setImage(e.target.files[0])}/>
     </div>
     <div  className={admin.textField}>
        <h3>Add Location</h3>
        <input type="text" value={location} onChange={(e)=>setLocation(e.target.value)}/>
     </div>
     <div  className={admin.textField}>
        <h3>Add Description</h3>
        <input type="text" value={description} onChange={(e)=>setDescription(e.target.value)}/>
     </div>
     <div  className={admin.textField}>
        <h3>Add Category</h3>
        <input type="text" value={category} onChange={(e)=>setCategory(e.target.value)}/>
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
 
export default AddLocation;
'use client'
import admin from './components.module.css'
import { createLocationAction } from '@/app/serverActions/locationActions';
const AddLocation = () => {

  async function handleAction(formData) {
    const result = await createLocationAction(formData);
    if (result.success) {
      alert('Record added successfully');
      // Reset form manually since we are intercepting
      document.getElementById('locationForm').reset();
    } else {
      alert('Error: ' + result.message);
    }
  }

  return (
    <div>
      <div className={admin.container}>
        <h1>Add Location</h1>
        <form action={handleAction} id="locationForm">

          <div className={admin.textField}>
            <h3>Upload Image</h3>
            <input type="file" name="image" accept='image/*' required />
          </div>
          <div className={admin.textField}>
            <h3>Add Location</h3>
            <input type="text" name="location" required />
          </div>
          <div className={admin.textField}>
            <h3>Add Description</h3>
            <input type="text" name="description" />
          </div>
          <div className={admin.textField}>
            <h3>Add Category</h3>
            <input type="text" name="category" />
          </div>
          <div className={admin.submit}>
            <button type='submit'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>);
}

export default AddLocation;
import React, { useEffect, useState } from 'react'
import Input from '../common/inputField/Input'
import { Button } from 'rsuite'
import { toast } from 'react-toastify';
import axios from 'axios';
function _editSource({data, onSubmit}) {

    const [formData, setFormData] = useState({});

    const handleForm = (name, data) => {
        if(data.length === 0){
            setFormData({
                ...formData,
                [name]: data
            });
        }else{
            setFormData({
                ...formData,
                [name]: data
            });
        }
    }

    useEffect(() => {
        setFormData(data);
    },[data])

    const handleSubmit = async () => {
        try {
            if (!formData.source_name || formData.source_name.trim() === '') {
                toast.warning('Source Name is required!');
                return;
            }
    
            const response = await axios.post('http://localhost:5000/leads/source/add', formData);
            toast.success(response.data);
            onSubmit({ message: 'Data added successfully!' }); 
        } catch (error) {
            console.error('Error adding source:', error);
    
            toast.error('Failed to add source. Please try again.');
            onSubmit(null);
        }
    };

    const handleUpdate = async (id) => {
        try{
            if (!formData.source_name || formData.source_name.trim() === '') {
                toast.warning('Source Name is required!');
                return;
            }

           const response = await axios.put(`http://localhost:5000/leads/source/update/${id}`, formData);
            toast.success(response.data.message);
            onSubmit({ message: 'Data updated successfully!' }); 
        }catch(error){
            console.error('Error updating data:', error);
            toast.error('Error updating data');

            onSubmit(null);
        }
    }
    
  return (
    <div>
        {data.length != 0 ? 
        // UPDATE SOURCE DATA
        <div className='flex flex-col gap-5'>
            <Input id={'Source Name'} type='text' name={'source_name'} value={formData.source_name} onSendData={handleForm} />
            <Button color='green' onClick={() => handleUpdate(formData.source_id)} appearance='primary'>
                Update
            </Button>
        </div>       
         : 
        //  ADD NEW SOURCE DATA
        <div className='flex flex-col gap-5'>
            <Input id={'Source Name'} type='text' name={'source_name'} value={formData.source_name} onSendData={handleForm} />
            <Button color='green' onClick={handleSubmit} appearance='primary'>
                Submit
            </Button>
        </div>      
         }
    </div>
  )
}

export default _editSource
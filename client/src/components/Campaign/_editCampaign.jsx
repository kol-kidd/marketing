import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Input from '../common/inputField/Input';
import Dropdown from '../common/dropdown/Dropdown';
import { optionsForStatus } from '../../constants/campaign';
import { useParams, useNavigate } from 'react-router-dom'
import { IoArrowBackCircle } from "react-icons/io5";
import Loading from '../Loading/Loading';
import { toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode'
import { Label } from 'flowbite-react';
import { DatePicker } from 'rsuite';


function _editCampaign({data, onFormSubmit}) {

    const [form, setForm] = useState({})
    const [isEmpty, setIsEmpty] = useState(false);
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(true);

    const getCampaignData = async () => {
        const campID = data;
        try {
            const response = await axios.get(`http://localhost:5000/campaign/get/${campID}`);
            const data = response.data;
            setForm(data);
            
            
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCampaignData();
    }, [data]);

    const handleForm = (name, data) => {
       if((name === 'budget' || name === 'engagement_rate' || name === 'conversion_rate') && isNaN(data)){
        setErrors({
            ...errors,
            [name]: 'Field should be a decimal/number'
        })
       }else if(data.length === 0){
        setErrors({
            ...errors,
            [name]: `Field shouldn't be empty!`
        })
        setIsEmpty(true);
        }else{
        setIsEmpty(false);
        setErrors({
            ...errors,
            [name] : ''
        });
       }

       setForm({
        ...form,
        [name]: data
       })
    };

    const handleSubmit = async () => {
        const campID = form.campaign_id;

        const formattedForm = {
            ...form,
        }
       try{
        await axios.put(`http://localhost:5000/campaign/edit/${campID}`, formattedForm)
        toast.success('Data updated successfully!');
        onFormSubmit();
       }catch(error){
        toast.error('Data updated failed');
        console.error('Error updating data:' , error);
       }
    };
    
    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="grid grid-cols-6 py-3 gap-3">
            {/* Campaign Name */}
            <div className="flex flex-col col-span-6">
                <Input id="Campaign Name" type="text" name="campaign_name" value={form.campaign_name}  onSendData={handleForm} />
                {errors.campaign_name && <div className="text-red-500 col-span-3">{errors.campaign_name}</div>}
            </div>

            {/* Campaign Description */}
            <div className="flex flex-col col-span-6">
                <Input id="Description" type="text-area" name="campaign_desc" value={form.campaign_desc}  onSendData={handleForm} />
                {errors.campaign_desc && <div className="text-red-500 col-span-3">{errors.campaign_desc}</div>}
            </div>

            {/* Campaign Budget */}
            <div className="flex flex-col col-span-3">
                <Input id="Budget" type="text" name="budget" value={form.budget}  onSendData={handleForm} />
                {errors.budget && <div className="text-red-500 col-span-3">{errors.budget}</div>}
            </div>

            {/* Status Dropdown */}
            <div className="flex flex-col">
                <Dropdown id="Status" name="status" data={optionsForStatus} value={form.status}  onSendData={handleForm} />
                {errors.status && <div className="text-red-500 col-span-3">{errors.status}</div>}
            </div>

            {/* Engagement Rate */}
            <div className="flex flex-col col-span-3">
                <Input id="Engagement Rate" type="text" name="engagement_rate" value={form.engagement_rate}  onSendData={handleForm} />
                {errors.engagement_rate && <div className="text-red-500 col-span-3">{errors.engagement_rate}</div>}
            </div>

            {/* Age Range */}
            <div className="flex flex-col col-span-3">
                <Input id="Age Range" type="text" name="age_range" value={form.age_range}  onSendData={handleForm} />
                {errors.age_range && <div className="text-red-500 col-span-3">{errors.age_range}</div>}
            </div>

            {/* Location */}
            <div className="flex flex-col col-span-3">
                <Input id="Location" type="text" name="location" value={form.location} onSendData={handleForm} />
                {errors.location && <div className="text-red-500 col-span-3">{errors.location}</div>}
            </div>

            {/* Interest */}
            <div className="flex flex-col col-span-3">
                <Input id="Interest" type="text" name="interest" value={form.interest}  onSendData={handleForm} />
                {errors.interest && <div className="text-red-500 col-span-3">{errors.interest}</div>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-start col-span-6">
                <button
                    onClick={!isEmpty ? handleSubmit : null}
                    className={`text-white font-bold py-2 px-4 ${isEmpty ? 'bg-gray-300 cursor-default' : ' bg-blue-500 hover:bg-blue-700 rounded'}`}
                    disabled={false}
                >
                    Save Campaign
                </button>
            </div>
        </div>
    );
}

export default _editCampaign;

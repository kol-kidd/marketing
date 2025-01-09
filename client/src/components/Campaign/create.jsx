import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../common/inputField/Input';
import Dropdown from '../common/dropdown/Dropdown';
import { IoArrowBackCircle } from "react-icons/io5";
import { optionsForStatus } from '../../constants/campaign';
import { toast } from 'react-toastify';
import { Label, Textarea } from "flowbite-react";
import { DatePicker } from 'rsuite';

function Create({onFormSubmit}) {
  const [form, setFormData] = useState({
    campaign_name: '',
    campaign_desc: '',
    start_date: '',
    end_date: '',
    budget: '',
    status: '',
    age_range: '',
    location: '',
    interest: '',
  });
  const [errors, setErrors] = useState({});
  const [isEmpty, setIsEmpty] = useState(true);

  const handleForm = (name, data) => {
    if((name === 'budget') && isNaN(data)){
      setErrors({
        ...errors,
        [name]: 'Please input a number/decimal'
      })
    }else if(data.length === 0) {
      setErrors({
        ...errors,
        [name]: 'Field should not be empty!'
      })
    }else{
      setErrors({
          ...errors,
          [name] : ''
      });
    }
    setFormData({
      ...form,
      [name]: data
    })

    setIsEmpty(!validateForm());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      await axios.post('http://localhost:5000/campaign/add', form);
      toast.success('Campaign added successfully!');
      if(onFormSubmit) onFormSubmit();
    }catch(error){
      toast.error('Error adding campaign data:', error);
      console.error('Error adding campaign data:', error);
    }
  };

  const validateForm = () => {

    const hasEmptyFields = Object.keys(form).some((key) => !form[key]);
    const hasErrors = Object.keys(errors).some((key) => errors[key]);
  
    return !hasEmptyFields && !hasErrors; 
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDateAble, setIsDateAble] = useState(true);

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  const handleStartCalendar = (date) => {
    setStartDate(date);
  };

  const handleEndCalendar = (date) => {
    setEndDate(date);
  }

  const shouldDisableStartDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0); 
    return normalizedDate < minDate;
  };

  const shouldDisableEndDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0); 
    return normalizedDate < startDate;
  }

  const formDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      return utcDate.toISOString().split('T')[0];
    } else if (typeof date === 'string' && date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate)) {
        const utcDate = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
        return utcDate.toISOString().split('T')[0];
      }
    }
    return '';
  };

  return (
    <>
    <form
      className="flex flex-col justify-center items-center gap-3"
      onSubmit={handleSubmit}
    >

      {/* Campaign Name */}
      <div className="flex flex-col w-[550px] gap-2">
        <Input id="Campaign Name" type="text" name="campaign_name" value={form.campaign_name}  onSendData={handleForm} required />
        {errors.campaign_name && <div className="text-red-500 col-span-3">{errors.campaign_name}</div>}
      </div>

      {/* Campaign Description */}
      <div className="flex flex-col w-[550px] gap-2">
        <Label className="text-md" htmlFor="description" value="Description" />
        <Textarea
          className="h-[100%] min-h-[300px]"
          id="Description"
          placeholder="Type your description here..."
          value={form.campaign_desc}
          onChange={(e) => handleForm('campaign_desc', e.target.value)}
          required
          rows={4}
        />
        {errors.campaign_desc && <div className="text-red-500 col-span-3">{errors.campaign_desc}</div>}
      </div>

      <div className="flex gap-5">
        {/* Start Date */}
        <div className="flex flex-col w-[150px]">
          <Label htmlFor="startDate" className="text-md" value="Start Date" />
          <DatePicker
              placeholder="Select Date"
              format="MM/dd/yyyy"
              shouldDisableDate={shouldDisableStartDate}
              onOk={(date) => { setIsDateAble(false); handleForm('start_date', formDate(date)); }}
              onChange={handleStartCalendar}
              menuStyle={{ zIndex: 1060 }} // Higher z-index for dropdown
            />
          {errors.start_date && <div className="text-red-500">{errors.start_date}</div>}
        </div>

        {/* End Date */}
        <div className="flex flex-col w-[150px]">
          <Label htmlFor="endDate" className="text-md" value="End Date" />
          <DatePicker
            placeholder="Select Date"
            format="MM/dd/yyyy"
            disabled={isDateAble}
            onOk={(date) => handleForm('end_date', formDate(date))}
            shouldDisableDate={shouldDisableEndDate}
            onChange={handleEndCalendar}
            menuStyle={{ zIndex: 1060 }} // Higher z-index for dropdown
          />
          {errors.end_date && <div className="text-red-500">{errors.end_date}</div>}
        </div>
      </div>

    <div className="flex justify-between gap-5">
        {/* Campaign Budget */}
        <div className="flex flex-col w-[250px]">
          <Input id="Budget" type="text" name="budget" onSendData={handleForm}  value={form.budget} required />
          {errors.budget && <div className="text-red-500 col-span-3">{errors.budget}</div>}
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col w-[250px]">
          <Dropdown id="Status" name="status" data={optionsForStatus}  value={form.status}  onSendData={handleForm} required />
          {errors.status && <div className="text-red-500 col-span-3">{errors.status}</div>}
        </div>
      </div>

    <div className="flex gap-5">
      {/* Age Range */}
      <div className="flex flex-col w-[250px]">
        <Input id="Age Range" type="text" name="age_range"  value={form.age_range}  onSendData={handleForm} required />
        {errors.age_range && <div className="text-red-500 col-span-3">{errors.age_range}</div>}
      </div>

      {/* Location */}
      <div className="flex flex-col w-[250px]">
        <Input id="Location" type="text" name="location"  value={form.location}  onSendData={handleForm} required />
        {errors.location && <div className="text-red-500 col-span-3">{errors.location}</div>}
      </div>
    </div>

      {/* Interests */}
      <div className="flex flex-col w-[550px]">
        <Input id="Interest" type="text" name="interest"  value={form.interest}  onSendData={handleForm} required />
        {errors.interest && <div className="text-red-500 col-span-3">{errors.interest}</div>}
      </div>

      {/* Submit Button */}
      <div className="flex flex-col justify-center items-end col-span-6">
        <button
          type="submit"
          className={`border rounded py-3 w-[550px] flex justify-center text-lg transition ${!isEmpty ? 'hover:bg-green-400 hover:ease-in' : 'bg-gray-400 cursor-default'} `}
          disabled={isEmpty}
        >
          Submit
        </button>
      </div>
    </form>
    </>
  );
}

export default Create;

import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from './UserProvider';


function Form() {
  const {id} = useParams();
  const [selectedOption, setSelectedOption] = useState(''); // State for dropdown
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!user.id || !selectedOption || !id) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/leads/add', {
        campaign_id: id,
        user_id: user.id,
        selected_option: selectedOption, // Send the selected option with the form data
      });

      alert('THANK YOU FOR SIGNING UP!');
      navigate('/');
      // Clear the form
      setSelectedOption(''); // Clear the dropdown selection
      setError('');
    } catch (err) {
      console.error('Error submitting lead:', err);

      // If the error is from backend indicating that the lead already exists
      if (err.response && err.response.status === 400) {
        setError(err.response.data); // Display the error message from backend
      } else {
        setError('Error submitting lead');
      }
    }
  };

  const [sourceData, setSourceData] = useState([]);

  const getSource = async() => {
    try{
      const response = await axios.get('http://localhost:5000/leads/source/get')
      setSourceData(response.data);
    }catch(error){  
      console.error('error',error);
    }
  }

  useEffect(() => {
    getSource();
  }, [])

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>{id.campaign_name}</h1>
      {error && <p className="text-red-500">{error}</p>} {/* Show the error if exists */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <div>
          <label htmlFor="dropdown" className="text-black">Where did you hear about us?:</label>
          <select
            id="dropdown"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="border flex text-black bg-gray-100 w-[250px] p-3 mt-2"
          >
            <option value="">Select an option</option>
            {sourceData.map((data, index) => (
              <option key={index} value={`${data.source_id}`}>{data.source_name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="border text-black w-[250px] px-5 py-2 mt-3">
          Submit
        </button>
      </form>   
    </div>
  );
}

export default Form;

import axios from 'axios';
import {jwtDecode} from 'jwt-decode'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function _editList() {
    const { token } = useParams();
    const [leadData, setLeadData] = useState({});

    const getLeadData = async() => {
            const decode = jwtDecode(token);
            const email = decode.email
            const campID = decode.campaignId
        try{
            const response = await axios.get(`http://localhost:5000/leads/get/${campID}/${email}`)
            setLeadData(response.data);
        }catch(error){
            console.error('Error fetching lead data from edit:', error);
        }
    }

    useEffect(() => {
        getLeadData();
    },[token])
    
  return (
    <>
    <div>_editList {leadData.email}</div>
    <div>_editList {leadData.campaign_id}</div>
    </>
  )
}

export default _editList
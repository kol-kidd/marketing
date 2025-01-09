import React from 'react'
import { TfiReload } from "react-icons/tfi";

function Reload({refreshData}) {
  return (
    <button className='border p-2 rounded-lg' onClick={refreshData} >
        <TfiReload />
    </button>
  )
}

export default Reload

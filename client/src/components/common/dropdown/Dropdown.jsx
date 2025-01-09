import React, { useEffect, useState } from 'react'

function Dropdown({name, id, data, value, gap, onSendData}) {

   const handleDrop = (e) => {
    const option = e.target.value;
    onSendData(name, option)
   }

  return (
    <div className={`flex flex-col gap-2 ${gap}`}>
       <label htmlFor={name}>{id}</label>
       <select 
       name={name} 
       id={id} 
       onChange={handleDrop} 
       defaultValue={value || data.find(option => option.type === 'default')?.name || ''} 
       className='p-3 rounded'>
        {
            data.map((options, index) => (
                <option key={index} value={options.name} disabled={options.type === 'default'} >{options.name}</option>
            ))
        }
       </select>
    </div>
  )
}

export default Dropdown
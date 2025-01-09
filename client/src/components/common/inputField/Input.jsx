import React from 'react';
import { Label } from "flowbite-react";

function Input({ id, type, name, onSendData, value }) {
  const today = new Date().toISOString().split('T')[0];

  const handleInputChange = (e) => {
    const data = e.target.value;
    onSendData(e.target.name, data);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} value={id} className='text-md' />
      <input
        id={id}
        className="border rounded p-3"
        onChange={handleInputChange}
        name={name}
        type={type}
        value={value || ''}
        min={type === 'date' ? today : ''}
        placeholder="Type here..."
      />
    </div>
  );
}

export default Input;

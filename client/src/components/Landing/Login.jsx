import React from 'react'
import { Link } from 'react-router-dom'
import _input from './_input'
function Login() {
  return (
    <div className='grid grid-cols-12 w-dvw h-dvh bg-gradient-to-tr from-cyan-50 to-blue-800'>
      <div className="col-span-6 flex flex-col justify-center items-center border-r border-blue-500 w-full gap-5">
        <h1>Welcome to MobileHub</h1>
        <div className="flex flex-col gap-2">
          <_input placeholder={'Enter email here...'} />
          <_input placeholder={'Enter password here...'}/>
        </div>
        <Link className='border px-5 py-2 w-[150px] text-center text-white bg-black' to="/dashboard">Login</Link>
      </div>
      <div className="col-span-6 border-l border-blue-500 bg-AI bg-no-repeat bg-cover">
  
      </div>
    </div>
  )
}

export default Login
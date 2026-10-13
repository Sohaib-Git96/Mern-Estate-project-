import React from 'react'
import { useSelector } from 'react-redux';


export default function profile() {
  const {currentUser}=useSelector((state)=>state.user)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col'>
       <img
       src={currentUser.avator}
       alt="profile"
      referrerPolicy="no-referrer"
      className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
      />
      <input type='text' placeholder='username' className='border p-3 rounded-lg mt-4'/>
      <input type='text' placeholder=' email' className='border p-3 rounded-lg mt-4'/>
      <input type='text' placeholder='password' className='border p-3 rounded-lg mt-4'/>
      <button className="bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-95 disabled:opacity-80 mt-4">update</button>     
      </form>
      <div className='flex justify-between mt-4'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>


      </div>
    </div>

  )
}

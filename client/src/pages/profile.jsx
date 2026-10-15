import React, { useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from '../redux/user/userSlice'

const CLOUD_NAME = 'atsl2gty'
const UPLOAD_PRESET = 'mern-estate'

export default function Profile() {
  const fileRef = useRef(null)
  const dispatch = useDispatch()
  const { currentUser, loading,error } = useSelector((state) => state.user)

  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'error' | 'success', text: '...' }
  const [formData, setFormData] = useState({})
  const [updateSuccess,setUpdateSuccess]=useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Size check (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image upload failed: image must be less than 2MB' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', UPLOAD_PRESET)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: data }
      )
      const result = await res.json()

      if (result.secure_url) {
        setFormData((prev) => ({ ...prev, avator: result.secure_url }))
        setMessage({ type: 'success', text: 'Image uploaded successfully. Click update to save it.' })
      } else {
        setMessage({
          type: 'error',
          text: 'Image upload failed: ' + (result.error?.message || 'unknown error'),
        })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Image upload failed. Please check your internet and try again.' })
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Update clicked, formData:', { ...formData, password: formData.password ? '***' : undefined })
    console.log('currentUser:', currentUser)

    if (Object.keys(formData).length === 0) {
      setMessage({ type: 'error', text: 'Nothing to update. Change a field or select an image first' })
      return
    }

    setMessage(null)

    try {
      dispatch(updateUserStart())

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      console.log('Server response:', data)

      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        setMessage({ type: 'error', text: 'Update failed: ' + data.message })
        return
      }

      dispatch(updateUserSuccess(data))
      setFormData({})
      setUpdateSuccess(true)
      setMessage({ type: 'success', text: 'Successfully updated!' })
    } catch (err) {
      dispatch(updateUserFailure(err.message))
      setMessage({ type: 'error', text: 'Update failed: ' + err.message })
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={handleFileChange}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avator || currentUser.avator}
          alt='profile'
          referrerPolicy='no-referrer'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />

        <p className='text-sm self-center mt-2 text-center'>
          {uploading && <span className='text-slate-700'>Uploading...</span>}
          {message && (
            <span className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
              {message.text}
            </span>
          )}
        </p>

        <input
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
          className='border p-3 rounded-lg mt-4'
        />
        <input
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
          className='border p-3 rounded-lg mt-4'
        />
        <input
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
          className='border p-3 rounded-lg mt-4'
        />
        <button
          type='submit'
          disabled={uploading || loading}
          className='bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-95 disabled:opacity-80 mt-4'
        >
          {loading ? 'Updating...' : 'update'}
        </button>
      </form>

      <div className='flex justify-between mt-4'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error:" "}</p>
      <p className='text-green-700 mt-5'> {updateSuccess?"User is updated successfully":""}</p>
    </div>
  )
}
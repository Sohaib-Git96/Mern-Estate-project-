import { useEffect } from 'react';
import { useState } from 'react';
import {useSelector} from "react-redux";
import {useNavigate,useParams} from "react-router-dom";

export default function CreateListing() {
  const navigate=useNavigate()
  const Params=useParams()
  const {currentUser}=useSelector(state=>state.user)
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice:0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    const fetchListing=async()=>{
        const listingId=Params.listingId
        console.log(listingId)
        const res=await fetch(`/api/listing/get/${listingId}`)
        const data=await res.json()
        if(data.success===false){
            console.log(data.message)
            return;
        }
        setFormData(data)
    }
    fetchListing();
  },[Params.listingId])

  // ---------- Cloudinary upload ----------
  const storeImage = async (file) => {
    console.log('CLOUD:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, 'PRESET:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: data }
  );

  const result = await res.json();

  if (!res.ok) {
    console.log('Cloudinary error:', result);
    throw new Error(result.error?.message || 'Upload failed');
  }

  return result.secure_url;
};

    const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2 MB max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  // ---------- Form handlers ----------
  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    if (id === 'sale' || id === 'rent') {
      setFormData({ ...formData, type: id });
      return;
    }

    if (id === 'parking' || id === 'furnished' || id === 'offer') {
      setFormData({ ...formData, [id]: checked });
      return;
    }

    if (type === 'number') {
      setFormData({ ...formData, [id]: Number(value) });
      return;
    }

    setFormData({ ...formData, [id]: value });
  };

 
const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.imageUrls.length < 1) {
    setError('You must upload at least one image');
    return;
  }

  if (formData.offer && formData.regularPrice <= formData.discountPrice) {
    setError('Discount price must be lower than regular price');
    return;
  }

  if (!currentUser?._id) {
    setError('Please login first');
    return;
  }

  setLoading(true);
  setError(false);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`/api/listing/update/${Params.listingId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        userRef: currentUser._id,
      }),
      signal: controller.signal,
    });

    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);

    if (!res.ok || data.success === false) {
      throw new Error(data.message || `Request failed: ${res.status}`);
    }

    navigate(`/listing/${data._id}`);
  } catch (err) {
    console.error(err);
    setError(
      err.name === 'AbortError'
        ? 'Request timed out. Check backend.'
        : err.message
    );
  } finally {
    clearTimeout(timeoutId);
    setLoading(false);
  }
};


  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        {/* LEFT SIDE */}
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg bg-white'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-4'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <label htmlFor='sale'>Sell</label>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-4'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <label htmlFor='rent'>Rent</label>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-4'
                onChange={handleChange}
                checked={formData.parking}
              />
              <label htmlFor='parking'>Parking Spot</label>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-4'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <label htmlFor='furnished'>Furnished</label>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-4'
                onChange={handleChange}
                checked={formData.offer}
              />
              <label htmlFor='offer'>Offer</label>
            </div>
          </div>

          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min={1}
                max={10}
                className='border border-gray-300 rounded-lg p-3'
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min={1}
                max={10}
                className='border border-gray-300 rounded-lg p-3'
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min={50}
                max={10000000}
                className='border border-gray-300 rounded-lg p-3'
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span className='text-xs'>($/month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min={0}
                  max={10000000}
                  className='border border-gray-300 rounded-lg p-3 w-28 bg-white text-black'
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discount Price</p>
                  <span className='text-xs'>($/month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-700 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              onClick={handleImageSubmit}
              disabled={uploading}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>

          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>

          {formData.imageUrls.map((url, index) => (
            <div
              key={url}
              className='flex justify-between p-3 border items-center'
            >
              <img
                src={url}
                alt='listing'
                className='w-20 h-20 object-contain rounded-lg'
              />
              <button
                type='button'
                onClick={() => handleRemoveImage(index)}
                className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
              >
                Delete
              </button>
            </div>
          ))}

          <button
            type='submit'
            disabled={loading || uploading}
            className='bg-gray-700 text-white p-3 rounded-lg uppercase hover:shadow-lg disabled:opacity-95'
          >
            {loading ? 'Creating...' : 'Update Listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
import React from 'react'

const Notfound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <h1 className='text-6xl font-bold text-gray-800 mb-4'>404</h1>
        <p className='text-lg text-gray-600'>Page Not Found</p>
        <a href="/" className='inline-block px-6 py-3 mt-6 font-medium transition shadow-md bg-primary rounded-2xl hover:bg-primary-dark text-white'>Go back to Homepage</a>
    </div>
  )
}

export default Notfound

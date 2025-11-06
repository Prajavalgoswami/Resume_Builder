import React from 'react'
import Login from '../components/Login.jsx'

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <Login />
      </div>
    </div>
  )
}

export default LoginPage



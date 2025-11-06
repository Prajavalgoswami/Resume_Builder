import React from 'react'
import SignUp from '../components/SignUp.jsx'

const SignUpPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <SignUp />
      </div>
    </div>
  )
}

export default SignUpPage



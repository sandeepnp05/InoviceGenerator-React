import React, { useState } from 'react';
import { Input } from "../components/ui/input.js";
import { Button } from "../components/ui/button.js";
import Header from '../components/Header.jsx';
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";
import { useValidation } from '../hooks/useValidation.js';

const Signup = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Use validation hook
  const { validationError, validateForm } = useValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm('signup', userData.name, userData.email, userData.password)) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://invoicegenerator-backend.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("User registered successfully", {
          description: "Welcome! You have successfully registered.",
        });
        navigate('/login')
      } else {
        
        const errorMessage = data.message;
        setError(errorMessage || 'Something went wrong');
        console.log('Error message:', errorMessage);
     
        
        if (errorMessage && errorMessage.trim() === "User already exists") {
          toast.error("Account Already Exists", {
            description: "Please try login or use a different email.",
            duration: 5000, 
            action: {
              label: "Sign In",
              onClick: () => navigate('/login'), 
            },
          });
        } else {
          toast.error("Registration Failed", {
            description: errorMessage || "An unexpected error occurred.",
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while submitting the form');
      toast.error("Network Error", {
        description: "Unable to connect to the server. Please try again later.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
};
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black/95 z-0 flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="w-full mt-12 lg:w-[500px] p-4 md:p-6 lg:p-8 flex flex-col justify-center relative min-h-[700px]">
          {/* Background Overlay */}
          <div className="absolute bottom-0 left-0 w-[150px] blur-[90px] h-[150px] bg-[#CCF575] opacity-70 pointer-events-none rounded-full z-0"></div>
          <div className="absolute top-0 right-0 w-[150px] blur-[90px] h-[150px] bg-[#CCF575] opacity-70 pointer-events-none rounded-full z-0"></div>

          <div className="mb-6 lg:mb-8">
            {/* Header Text */}
            <h1 className="text-3xl lg:text-4xl font-semibold text-white mb-3 lg:mb-4 font-pretendard">
              Sign up to begin journey
            </h1>
            <p className="text-gray-400 mb-6 lg:mb-8 text-sm lg:text-base font-mukta">
              This is a basic signup page which is used for levitation assignment purpose.
            </p>
          </div>

          {/* Form Section */}
          <div className="space-y-4 lg:space-y-6">
            {/* Name Input */}
            <div className="z-10 relative font-poppins">
              <label className="block text-white mb-2 text-sm lg:text-base">Enter your name</label>
              <Input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="bg-[#202020] border-[#424647] text-white h-10 lg:h-12"
              />
              <p className="text-gray-500 text-xs lg:text-sm mt-1">
                This name will be displayed with your inquiry
              </p>
            </div>

            {/* Email Input */}
            <div className="z-10 relative font-poppins">
              <label className="block text-white mb-2 text-sm lg:text-base">Email Address</label>
              <Input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Enter Email ID"
                className="bg-[#202020] border-[#424647] text-white h-10 lg:h-12"
              />
              <p className="text-gray-500 text-xs lg:text-sm mt-1">
                This email will be displayed with your inquiry
              </p>
            </div>

            {/* Password Input */}
            <div className="z-10 relative font-poppins">
              <label className="block text-white mb-2 text-sm lg:text-base">Password</label>
              <Input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Enter the Password"
                className="bg-[#202020] border-[#424647] text-white h-10 lg:h-12"
              />
              <p className="text-gray-500 text-xs lg:text-sm mt-1">
                Any further updates will be forwarded on this Email ID
              </p>
            </div>

            {/* Validation Error */}
            {validationError && (
              <p className="text-red-500 text-xs lg:text-sm mt-2">{validationError}</p>
            )}

            {/* Button Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <Button
                onClick={handleSubmit}
                className="relative inline-flex items-center justify-center overflow-hidden font-medium text-[#CCF575] transition duration-300 ease-out bg-[#424647] shadow-md group px-6 lg:px-8 py-2.5 lg:py-3 w-full sm:w-auto"
                disabled={loading}
              >
                <span className=" font-pretendard relative flex items-center justify-center w-full h-full transform group-hover:translate-x-[-25%] transition-all duration-500 ease-in-out">
                  Register
                </span>
              </Button>
              <span className="font-poppins text-gray-400 text-sm lg:text-base">
                Already have an account?
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="w-full mt-[80px] lg:w-[800px] h-[200px] sm:h-[400px] md:h-[500px] lg:h-[650px] rounded-3xl relative order-first lg:order-last">
          <div className="absolute inset-0">
            <img
              src="/src/assets/images/Signup.png"
              alt="Banner"
              className="w-full h-full object-fill"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;

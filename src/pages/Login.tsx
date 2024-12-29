import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card.js";
import { Input } from "../components/ui/input.js";
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";
import { login } from '../reduxStore/slices/userSlice.js';
import {useDispatch} from 'react-redux'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "../components/ui/carousel.js";
import Header from '../components/Header.js';
import { Button } from '../components/ui/button.js';



interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const carouselImages = [
    { image: "/src/assets/images/login/scrol1.png", },
    { image: "/src/assets/images/login/scrol3.png", },
  ];

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate email and password (optional)
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://invoicegenerator-backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
    
        dispatch(login({ user: data.user, token: data.token }));
        console.log('Login successful', data);
        toast.success('Logged in successfully!', {
          description: 'Welcome back!',
        });
        navigate('/');
      } else {
       
        setError(data.message || 'Login failed');
        toast.error(data.message || 'Login failed', {
          description: 'Invalid credentials or error occurred.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred while logging in');
      toast.error('Network error', {
        description: 'Unable to connect to the server. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#141414] flex items-center justify-center p-4">
        <div className="w-full mt-12 max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          {/* Background Overlay */}
          <div className="absolute bottom-0 left-0 w-[150px] blur-[90px] h-[150px] bg-[#CCF575] opacity-70 pointer-events-none rounded-full z-0"></div>
          <div className="absolute top-0 right-0 w-[150px] blur-[90px] h-[250px] bg-[#4F59A8] opacity-70 pointer-events-none rounded-full z-0"></div>
          {/* Left side - Carousel */}
          <div className="hidden md:block">
            <Carousel opts={{ loop: true, }} className="w-full" setApi={setApi}>
              <CarouselContent className="h-[600px]">
                {carouselImages.map((item, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-0 bg-transparent">
                      <CardContent className="p-0">
                        <img
                          src={item.image}
                          alt={`Slide ${index + 1}`}
                          className="rounded-2xl object-cover w-full h-[600px]"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Right side - Login Form */}
          <div className=" h-full w-full p-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <img src="/src/assets/images/logo.svg" alt="" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Let the Journey Begin!</h1>
              <p className="text-gray-400">
                This is a basic login page used for levitation assignment purposes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-white mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#202020] border-[#424647] text-white h-10 lg:h-12"
                  placeholder="Enter Email ID"
                />
                <p className="text-sm text-gray-400 mt-1">
                  This email will be displayed with your inquiry
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block text-white mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#202020] border-[#424647] text-white h-10 lg:h-12"
                    placeholder="Enter the Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500">{error}</p>}

              <div className="flex items-center justify-between">
                <Button className="relative inline-flex items-center justify-center overflow-hidden font-medium text-[#CCF575] transition duration-300 ease-out bg-[#424647] shadow-md group px-6 lg:px-8 py-2.5 lg:py-3 w-full sm:w-auto">
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full duration-300 translate-x-full bg-[#141414] group-hover:bg-gradient-to-r group-hover:from-[#141414] group-hover:to-[#535450] group-hover:translate-x-[25%] ease">
                    <img src="/src/assets/images/Vector 3.svg" alt="" />
                  </span>
                  <span className="font-pretendard relative flex items-center justify-center w-full h-full transform group-hover:translate-x-[-25%] transition-all duration-500 ease-in-out">
                    {loading ? 'Logging In...' : 'Login'}
                  </span>
                </Button>
                <button
                  type="button"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Forget password?
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

"use client"; // Add this line at the top

import { useState } from 'react';
import { signIn } from '../../../lib/authFactory'; // Adjust the import path
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input' // Make sure you have an Input component
import { Card, CardContent, CardTitle } from '@/components/ui/card'; // Ensure you have a Card component
import { useRouter } from 'next/navigation'; // For redirection
import { toast, ToastContainer } from 'react-toastify'; // Optional: For notifications
import 'react-toastify/dist/ReactToastify.css'; // Make sure to include this import for the toast styles
import loginPng  from "../../../public/images/login.jpg";
import logoPng from "../../../public/images/logo.png";
import googleIcon from "../../../public/images/google.png";
import Image from 'next/image'


const LoginPage =  () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // For redirection

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast.error(error.message); // Show error message
    } else {
      toast.success("Successfully logged in!", {
        autoClose: 2250, // Toast will disappear after 2500 ms
      });
      setTimeout(() => {
        router.push('/dashboard'); // Redirect to the dashboard after successful registration
      },2500)
    }
  };

  return (
    <div className="flex bg-blue-100 h-[100vh]">
      <div className="relative flex-[0%] md:flex-[60%]  w-full items-center justify-center bg-pink-100">
        <Image 
          src={loginPng} 
          alt="Login Png" 
          // width={500} 
          // height={300} 
          // objectFit=""
          className="h-full w-full object-cover" 
        />
        <div className="absolute w-[400px] h-[110px] bottom-28 right-0 z-10 bg-[#0077b6]"> {/*The overlay Care4Poverty System*/}
          <p  className="font-giorgio font-heavy italic text-4xl">
            <span>Care</span>
            <span className="text-white ">4</span>
            <span>Poverty System</span>
          </p>
        </div>
      </div>
      {/* <div className="flex flex-1 item-center justify-center bg-gray-100"> */}
        <Card className="flex flex-[100%] md:flex-[40%] w-full item-center justify-center rounded-none">
          <CardContent className="bg-yellow-100 w-full my-14 mx-14 flex flex-col items-center">
            <p className="bg-blue-200 text-right w-full"> 
              <button className="text-[#535353] hover:underline hover:text-black font-roboto text-[18px]" onClick={() => router.push('/auth/signup') }>
                Signup
              </button>
            </p> 
            <div className='flex justify-center mb-4 w-full'>
              <Image 
                src={logoPng}
                alt="Logo Png"
                className="w-[17rem]"
              />
            </div>
            {/* <CardTitle className="text-center">Login</CardTitle> */}
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <Input
                type="email"
                placeholder="Username/Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-black rounded-none"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-black rounded-none"
              />
              <Button type="submit" disabled={loading} className='px-5 bg-[#0077B6] hover:bg-[#00689F] font-inter'>
                {loading ? 'Loading...' : 'Sign In'}
              </Button>
            </form>
            <p className="mt-8 bg-white text-left w-full"> 
              <button className="text-[#535353] hover:underline hover:text-gray-800 font-roboto" onClick={() => {/* Activate the forgot password function*/} }>
                Forgot password?
              </button>
            </p> 
            <p className="mt-0 bg-white text-left w-full"> 
              <button className="text-[#535353] hover:underline hover:text-gray-800 font-roboto" onClick={() => router.push('/auth/signup')}>
                Register new account?
              </button>
            </p> 
            <div className="flex items-center justify-center my-7 w-full">
              <hr className="w-1/3 h-0.5 bg-gray-400"/>
              <span className="mx-4 text-gray-500 text-center font-roboto">or continue with</span>
              <hr className="w-1/3 h-0.5 bg-gray-400"/>
            </div>

            <Button type="submit" disabled={loading} className='px-10 py-6  bg-[#0077B6] hover:bg-[#00689F] font-inter'>
              <Image 
                  src={googleIcon}
                  alt="Google Logo Png"
                  className="relative left-[-35px] h-[40px] w-[40px]"
              />
                Login with Google 
            </Button>
          </CardContent>
        </Card>
      {/* </div> */}
      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default LoginPage;

"use client"; // Add this line at the top

import { useState } from 'react';
import { signIn, handlePasswordReset, signInWithGoogle } from '../../../lib/authFactory'; // Adjust the import path
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input' // Make sure you have an Input component
import { Card, CardContent, CardTitle } from '@/components/ui/card'; // Ensure you have a Card component
import { useRouter } from 'next/navigation'; // For redirection
import { toast, ToastContainer } from 'react-toastify'; // Optional: For notifications
import 'react-toastify/dist/ReactToastify.css'; // Make sure to include this import for the toast styles
import loginPng  from "../../../public/images/login.jpg";
import logoPng from "../../../public/images/logo.png";
import googleIcon from "../../../public/images/google.png";
import Image from 'next/image'
import registerIcon from '../../../public/register.svg'
import { supabase } from '@/lib/supabaseClient';
import { getRecordById } from "@/lib/supabaseAPI";


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const router = useRouter(); // For redirection
  const [emailForReset, setEmailForReset] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleGoogleSignIn = async() => {
    setLoading(true);
    const { data, error } = await signInWithGoogle();
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully logged in with Google!", {
        autoClose: 1500,
      });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1800);
    }
  }

  const initiatePasswordReset = async () => {
    const { success, error } = await handlePasswordReset(emailForReset);
    if (success) {
        toast.success("Password reset email sent! Check your inbox.");
        setDialogOpen(false); // Close the dialog after success
        setEmailForReset(''); // Clear the email input
    } else {
        console.error("Error resetting password:", error);
        toast.error("Failed to send reset email. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { data: loginData, error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast.error(error.message); // Show error message
    } else {
      toast.success("Successfully logged in!", {
        autoClose: 1500, // Toast will disappear after 1500 ms
      });
      console.log("Data:", loginData);
      console.log("Login Data:", loginData);
      // Supbase user id
      const userId = loginData.session?.user.id
      console.log("Supabase UID: ", userId);

      // Retrieve user information from Supabase
      if (userId) {
        const { data: userData, error: fetchError } = await getRecordById('users', userId);
        
        if (fetchError) {
          console.error('Error fetching user data:', fetchError.message);
          return;
        }

        if (userData) {
          sessionStorage.setItem('user', JSON.stringify(userData)); // Store user data
          console.log('User data stored in session storage:', userData);
        } else {
          console.error("User data is undefined.");
        }
      } else {
        console.error("User ID is undefined.");
      }

      setTimeout(() => {
        router.push('/dashboard'); // Redirect to the dashboard after successful registration
      }, 1800);
    }
  };


  return (
    <div className="flex bg-blue-100 h-[100vh] min-h-[695px]">
      <div className="relative flex-[0%] md:flex-[60%]  w-full items-center justify-center bg-pink-100 overflow-hidden">
        <Image 
          src={loginPng} 
          alt="Login Png" 
          // width={500} 
          // height={300} 
          // objectFit=""
          className="h-full w-full object-cover transform scale-110" 
        />
        <div className="absolute flex justify-center items-center w-[410px] h-[110px] bottom-28 right-0 bg-[#0077b6] rounded-l-2xl"> {/*The overlay Care4Poverty System*/}
          <p className="font-giorgio font-bold text-[54px]">
            <span>CARE</span>
            <span className="text-white">4</span>
            <span>POVERTY SYSTEM</span>
          </p>
        </div>
      </div>
      {/* <div className="flex flex-1 item-center justify-center bg-gray-100"> */}
        <Card className="flex flex-[100%] md:flex-[40%] w-full h-full overflow-hidden item-center justify-center rounded-none">
          <CardContent className="transform scale-[0.9] h-full w-full max-w-[453px] my-2 [@media(min-height:730px)]:my-6 mx-8 lg:mx-20  flex flex-col justify-between items-center">  {/* Justify between to put space between the element vertically */}
            {/* <div className="flex justify-between  w-full mt-6 mb-6"> */}
            {/* <p className="flex relative right-[-5px] justify-end bg-white w-full mt-6 mb-6 "> 
              <button className="flex text-black hover:underline font-roboto text-[17px] gap-2" onClick={() => router.push('/') }>
              <svg width="20px" height="24px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"/><path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"/></svg>
                Back
              </button>
            </p>  */}
            <p className="flex relative right-[-5px] justify-end bg-white w-full mt-6 mb-6 "> 
              <button className="flex text-black hover:underline font-roboto text-[17px] gap-2" onClick={() => router.push('/auth/signup') }>
              <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <title>i</title>
                <g id="Complete">
                  <g id="user-add">
                    <g>
                      <path d="M17,21V19a4,4,0,0,0-4-4H5a4,4,0,0,0-4,4v2" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                      <circle cx="9" cy="7" r="4" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                      <line x1="17" y1="11" x2="23" y2="11" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                      <line x1="20" y1="8" x2="20" y2="14" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                    </g>
                  </g>
                </g>
              </svg>
                Signup
              </button>
            </p> 
            {/* </div> */}
            <div className='flex justify-center mb-4 w-full'>
              <a href="/">
                <Image 
                  src={logoPng}
                  alt="Logo Png"
                  className="w-[15rem]"
                />
              </a>
            </div>
            {/* <CardTitle className="text-center">Login</CardTitle> */}
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <Input
                type="email"
                placeholder="Username/Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-400 rounded-sm"
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-400 rounded-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <Button type="submit" disabled={loading} className='bg-[#0077B6] hover:bg-[#00689F] font-inter px-6'>
                {loading ? 'Loading...' : 'Sign In'}
              </Button>
            </form>
            {/* group div for additional actions */}
            <div className="bg-white text-[0.9rem] flex flex-col items-start mt-6 mb-4 w-full space-y-1">
                <button className="text-[#535353] hover:underline hover:text-gray-800 font-roboto" onClick={() => setDialogOpen(true) }>
                  Forgot password?
                </button>
                <button className="text-[#535353] hover:underline hover:text-gray-800 font-roboto" onClick={() => router.push('/auth/signup')}>
                  Register new account?
                </button>
            </div>

            <div className="flex items-center justify-center my-7 w-full">
              <hr className="w-1/3 h-0.5 bg-gray-400"/>
              <span className="mx-4 text-gray-500 text-center font-roboto whitespace-nowrap">or continue with</span>
              <hr className="w-1/3 h-0.5 bg-gray-400"/>
            </div>

            <Button onClick={handleGoogleSignIn} disabled={loading} className='bg-[#0077B6] hover:bg-[#00689F] font-inter px-10 py-6 mt-4 mb-10'>
              <Image 
                  src={googleIcon}
                  alt="Google Logo Png"
                  className="flex-shrink-0 relative left-[-35px] md:left-[-13%] [@media(min-width:980px)]:left-[-20%] [@media(min-width:1000px)]:left-[-35px]  h-[40px] w-[40px]"
              />
              {/* [@media(min-height:730px)]:my-6  */}
              <span className="flex-1">
                {loading ? 'Loading...' : 'Login with Google'}
              </span>
            </Button>

            <p className="mb-32 text-[0.9rem] text-center">
              By clicking continue, you agree to the <span className="underline">
                <a href="#">Terms and Service</a>
              </span> and <span className="underline">
                <a href="#">Privacy and Policy</a>
              </span>
            </p>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogOverlay className="fixed inset-0 bg-black/30 " />
          <DialogContent className="fixed top-1/2 left-1/2 w-96 p-6 bg-white rounded-lg transform -translate-x-1/2 -translate-y-1/2">
            <DialogTitle className="text-lg font-semibold">Reset Password</DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-500">
              Enter your email address to receive a password reset link.
            </DialogDescription>
            <Input
              type="email"
              placeholder="Email"
              value={emailForReset}
              onChange={(e) => setEmailForReset(e.target.value)}
              required
              className="mt-4 border-black rounded-none"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={initiatePasswordReset}>Send Reset Link</Button>
            </div>
          </DialogContent>
        </Dialog>
      {/* </div> */}
      {/* Toast container
      <ToastContainer /> */}
    </div>
  );
};

export default LoginPage;

// limmiinning@gmail.com

// http://localhost:3000/auth/reset-password?access_token=8a28b5259a95f68f6b74dd62377cca0a190935c3567951b3eb07fa3a
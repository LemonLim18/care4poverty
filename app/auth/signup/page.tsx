"use client";

import { useState, useEffect } from 'react';
import { signUp, checkEmailConfirmation, signInWithGoogle } from '../../../lib/authFactory'; // Assume this function checks confirmation status
import { Button } from "@/components/ui/button"; 
import { Input } from '@/components/ui/input'; 
import { Dialog, DialogTrigger, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import Image from 'next/image';
import loginPng  from "../../../public/images/login.jpg";
import logoPng from "../../../public/images/logo.png";
import googleIcon from "../../../public/images/google.png";
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdCheckCircle } from 'react-icons/md';
import ClipLoader from 'react-spinners/ClipLoader';
import { useUserContext } from "../../context/UserContext"; // Import the UserContext


const SignupPage = () => {
  const { setUserUid } = useUserContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('Waiting for email confirmation...');
  const [modalLoading, setModalLoading] = useState(true);
  const router = useRouter();

  // Temporary variables (Will delete later)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailForReset, setEmailForReset] = useState('');

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const { data, error } = await signInWithGoogle();
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully sign up with Google!", {
        autoClose: 1500,
      });
    }
  };

  // Add password validation function
  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(!validatePasswords()) {
      return;
    }

    handleSignup(event);
  };

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    const { data, error } = await signUp(email, password);
    setLoading(false);

    console.log("Data:", data)

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Check if user is not null before accessing id
    if (data.user) {
     const { id } = data.user; // Now it's safe to access id
     setUserUid(id); // Use the id as needed
     console.log("Id passed to userContext: ", id)
    } else {
        toast.error('User data is not available');
    }

  //   const data = {
  //     user: {
  //         app_metadata: {
  //             provider: "email",
  //             providers: ['email']
  //         },
  //         aud: "authenticated",
  //         confirmation_sent_at: "2024-10-30T18:32:32.17170897Z",
  //         created_at: "2024-10-30T18:32:32.17170897Z",
  //         email: "limmiinning@gmail.com",
  //         id: "f7194ea2-92f0-4513-a5d3-f6afe07d2f77",
  //         identities: [],
  //         is_anonymous: false,
  //         phone: "",
  //         role: "",
  //         updated_at: "2024-10-30T18:32:32.17170897Z",
  //         user_metadata: {}
  //     },
  //     session: null
  // };

    toast.success('Check your email for the confirmation link!');
    setIsModalOpen(true);
    setStatus('Waiting for email confirmation. Please check your email inbox.');
    setLoading(false);

    // Start polling for email confirmation
    startPollingForConfirmation();
  };

  const startPollingForConfirmation = () => {
    const pollInterval = setInterval(async () => {
      const isConfirmed = await checkEmailConfirmation(email); // Poll for confirmation status

      console.log("isConfirmed: ",isConfirmed)
      if (isConfirmed) {
        clearInterval(pollInterval);
        setModalLoading(false);
        setStatus('Email confirmed successfully! Redirecting to login...');
        
        setTimeout(() => {
          setIsModalOpen(false);
          router.push('/auth/register'); // Redirect after confirmation
        }, 2000);
      }
    }, 3000); // Check every 3 seconds
  };

  return (
  <div className="flex bg-blue-100 h-[100vh] min-h-[695px]">
      {/* <Card className="w-96">
        <CardContent>
          <CardTitle className="text-center">Sign Up</CardTitle>
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <button className="text-blue-500" onClick={() => router.push('/auth/login')}>
              Sign In
            </button>
          </p>
        </CardContent>
      </Card> */}
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
            <p className="flex justify-end bg-white text-right w-full mt-6 mb-6">
              <button onClick={() => router.push('/auth/login')} className="flex gap-4 text-[#0C8CE9] hover:font-bold cursor-pointer transition-all duration-150 ease-in-out">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5f6368"
                >
                  <title>I am a login icon :)</title>
                  <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/>
                  </svg>
                <span>Login</span>
              </button>
            </p> 
            <div onClick = {() => router.push('/')} className="flex justify-center mb-4 w-full cursor-pointer">
              <Image 
                src={logoPng}
                alt="Logo Png"
                className="w-[15rem]"
              />
            </div>
            {/* <CardTitle className="text-center">Login</CardTitle> */}
            {/* <form onSubmit={handleSubmit} className="space-y-4 w-full"> */}
            <form onSubmit={handleSubmit} className=" space-y-5 w-full">
              <Input
                type="email"
                placeholder="Enter your username / email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 px-4 border-2 border-custom-border-blue hover:border-[#0C8CE9] text-[#7D7D7D] focus:text-black focus:border-[#0C8CE9] bg-[#F5F9FE] placeholder:hover:text-[#0C8CE9] placeholder:focus:text-[#F5F9FE] rounded-lg transition-all duration-150 ease-in-out"
              />
              <div className="relative group">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError('');
                  }}
                  required
                  className={`h-11 px-4 border-2 border-custom-border-blue hover:border-[#0C8CE9] text-[#7D7D7D] focus:text-black focus:border-[#0C8CE9] bg-[#F5F9FE] placeholder:hover:text-[#0C8CE9] placeholder:focus:text-[#F5F9FE] group-hover:border-[#0C8CE9] rounded-lg transition-all duration-150 ease-in-out ${showPassword ? 'text-black' : 'text-[#7D7D7D]'} transition-colors duration-150`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${showPassword ? 'text-[#0C8CE9]' : 'text-[#7D7D7D]'} hover:text-[#0C8CE9]`}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="relative group">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setPasswordError('');
                  }}
                  required
                  className={`h-11 px-4 border-2 border-custom-border-blue hover:border-[#0C8CE9] text-[#7D7D7D] focus:text-black focus:border-[#0C8CE9] bg-[#F5F9FE] placeholder:hover:text-[#0C8CE9] placeholder:focus:text-[#F5F9FE] group-hover:border-[#0C8CE9] rounded-lg transition-all duration-150 ease-in-out ${showConfirmPassword ? 'text-black' : 'text-[#7D7D7D]'} transition-colors duration-150`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${showConfirmPassword ? 'text-[#0C8CE9]' : 'text-[#7D7D7D]'} hover:text-[#0C8CE9]`}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500"></p>
              )}
              <Button type="submit" disabled={loading} className='bg-[#0077B6] hover:bg-[#00689F] font-inter px-6'>
                {loading ? 'Loading...' : 'Sign Up'}
              </Button>
            </form>
            {/* group div for additional actions */}
            <div className="bg-white text-[0.9rem] flex flex-col items-start mt-3 w-full space-y-1">
                {/* <button className="text-[#535353] hover:underline hover:text-gray-800 font-roboto" onClick={() => setDialogOpen(true) }>
                  Forgot password?
                </button> */}
                <p className="mt-4 text-center">
                  Already have an account ?{' '}
                  <button className="text-[#0C8CE9] hover:font-bold"  onClick={() => router.push('/auth/login')}>
                    Login
                  </button>
                </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogOverlay className="fixed inset-0 bg-black/30" />
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
                  {/* <Button onClick={initiatePasswordReset}>Send Reset Link</Button> */}
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex items-center justify-center mt-7 mb-5 w-full">
              <hr className="w-1/3 h-0.5 bg-gray-400"/>
              <span className="mx-4 text-gray-500 text-center font-roboto whitespace-nowrap">or continue with</span>
              <hr className="w-1/3 h-0.5 bg-gray-400"/>
            </div>

            <Button onClick={handleGoogleSignUp} disabled={loading} className='bg-[#0077B6] hover:bg-[#00689F] font-inter px-10 py-6 mt-4 mb-10'>
              <Image 
                  src={googleIcon}
                  alt="Google Logo Png"
                  className="flex-shrink-0 relative left-[-35px] md:left-[-13%] [@media(min-width:980px)]:left-[-20%] [@media(min-width:1000px)]:left-[-35px] h-[30px] w-[30px] bg-white rounded-sm ml-1"
              />
              {/* [@media(min-height:730px)]:my-6  */}
              {/* <span className="flex-1">Sign Up with Google</span> Flexible text container */}
              <span className="flex-1">
                {loading ? 'Loading...' : 'Sign Up with Google'}
              </span>
            </Button>

            <p className="mb-32 text-[0.9rem] text-center">
              By clicking continue, you agree to the <span className="hover:text-[#0C8CE9] underline">
                <a href="#">Terms and Service</a>
              </span> and <span className="hover:text-[#0C8CE9] underline">
                <a href="#">Privacy and Policy</a>
              </span>
            </p>
          </CardContent>
        </Card>
      {/* Toast container */}
      {/* <ToastContainer /> */}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="p-8 max-w-md text-center bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Confirming Your Email</h2>
            {modalLoading ? (
              <div className="flex flex-col items-center">
                <ClipLoader size={50} color="#4A90E2" loading={modalLoading} />
                <p className="text-lg font-medium text-gray-600 mt-4">{status}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <MdCheckCircle className="text-green-500 mb-2" style={{ fontSize: '48px' }} />
                <p className="text-lg font-medium text-green-600">{status}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;

"use client"; // Add this line at the top

import { useState } from 'react';
import { signIn, handlePasswordReset } from '../../../lib/authFactory'; // Adjust the import path
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


const LoginPage =  () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // For redirection
  const [emailForReset, setEmailForReset] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

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
    <div className="flex bg-blue-100 h-[100vh] min-h-[700px]">
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
          <CardContent className="h-full w-full max-w-[453px] my-2 [@media(min-height:730px)]:my-6 mx-20 flex flex-col justify-between items-center">  {/* Justify between to put space between the element vertically */}
            <p className="flex justify-end bg-white text-right w-full mt-6 mb-6"> 
              <button className="flex text-black hover:underline font-roboto text-[17px] gap-2" onClick={() => router.push('/auth/signup') }>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fffff"><path d="M240-160q-33 0-56.5-23.5T160-240q0-33 23.5-56.5T240-320q33 0 56.5 23.5T320-240q0 33-23.5 56.5T240-160Zm0-240q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm0-240q-33 0-56.5-23.5T160-720q0-33 23.5-56.5T240-800q33 0 56.5 23.5T320-720q0 33-23.5 56.5T240-640Zm240 0q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Zm240 0q-33 0-56.5-23.5T640-720q0-33 23.5-56.5T720-800q33 0 56.5 23.5T800-720q0 33-23.5 56.5T720-640ZM480-400q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm40 240v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z"/></svg>
                Signup
              </button>
            </p> 
            <div className='flex justify-center mb-4 w-full'>
              <Image 
                src={logoPng}
                alt="Logo Png"
                className="w-[15rem]"
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
                  <Button onClick={initiatePasswordReset}>Send Reset Link</Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex items-center justify-center my-7 w-full">
              <hr className="w-1/3 h-0.5 bg-gray-400"/>
              <span className="mx-4 text-gray-500 text-center font-roboto whitespace-nowrap">or continue with</span>
              <hr className="w-1/3 h-0.5 bg-gray-400"/>
            </div>

            <Button type="submit" disabled={loading} className='bg-[#0077B6] hover:bg-[#00689F] font-inter px-10 py-6 mt-4 mb-10'>
              <Image 
                  src={googleIcon}
                  alt="Google Logo Png"
                  className="flex-shrink-0 relative left-[-35px] md:left-[-13%] [@media(min-width:980px)]:left-[-20%] [@media(min-width:1000px)]:left-[-35px]  h-[40px] w-[40px]"
              />
              {/* [@media(min-height:730px)]:my-6  */}
              <span className="flex-1">Login with Google</span> {/* Flexible text container */}
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
      {/* </div> */}
      {/* Toast container
      <ToastContainer /> */}
    </div>
  );
};

export default LoginPage;

// limmiinning@gmail.com

// http://localhost:3000/auth/reset-password?access_token=8a28b5259a95f68f6b74dd62377cca0a190935c3567951b3eb07fa3a
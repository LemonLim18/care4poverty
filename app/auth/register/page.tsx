"use client"; // Ensure this is a client component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from 'react-toastify'; // For notifications
import { registerUser } from '@/lib/authFactory'; // Import the registerUser function
import { useUserContext } from "../../context/UserContext";

function RegisterPage() {
    const { userUid } = useUserContext();
    const router = useRouter();
    console.log("userUid: ", userUid)

    const [formData, setFormData] = useState({
        id: userUid || '',
        email: '',
        fullName: '',
        birthDate: '',
        icNumber: '',
        telephoneNumber: '',
        homeAddress: ''
    });

    console.log("form DATA: ", formData)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // You should add your form validation logic here

        try {
            // Call your API to save the user data
            console.log("form Data:", formData)
            // await registerUser(formData);
            console.log("Registration successful")
            toast.success("Registration successful!", {
                autoClose: 2250, // Toast will disappear after 2500 ms
            });
            setTimeout(() => {
                router.push('/auth/login'); // Redirect to the dashboard after successful registration
            },2500)
        } catch (error) {
            toast.error("Failed to register. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Register</h1>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <Input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="text"
                    name="icNumber"
                    placeholder="IC Number"
                    value={formData.icNumber}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="tel"
                    name="telephoneNumber"
                    placeholder="Telephone Number"
                    value={formData.telephoneNumber}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="text"
                    name="homeAddress"
                    placeholder="Home Address"
                    value={formData.homeAddress}
                    onChange={handleChange}
                    required
                />
                <Button type="submit">Register</Button>
            </form>
            <ToastContainer position="top-right" /> {/* Ensure this is included */}
        </div>
    );
}

export default RegisterPage;

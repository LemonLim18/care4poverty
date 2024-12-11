"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'react-toastify';
import { registerUser, uploadFile } from '@/lib/authFactory';
import  { useUserContext } from '@/app/context/UserContext'

const RegisterPage = () => {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState('');
    
    const {userUid, setUserUid} = useUserContext();
   
    // Shared information state
    const [sharedInfo, setSharedInfo] = useState({
        id: userUid,
        fullName: '',
        email: '',
        icNumber: '',
        phoneNumber: '',
        profilePicture: null as File | null,
        idProof: null as File | null,
        role: ''
    });

    // useEffect to log sharedInfo whenever it changes
    useEffect(() => {
        console.log("Shared Info Updated:", sharedInfo);
    }, [sharedInfo.idProof, sharedInfo.profilePicture]); // Dependency array includes sharedInfo


    // Role-specific state
    const [roleSpecificInfo, setRoleSpecificInfo] = useState({
        // Charity Admin fields
        organizationName: '',
        registrationNumber: '',
        bankAccount: '',
        orgAddress: '',
        website: '',
        registrationCert: null as File | null,
        
        // Donor and Recipient fields
        homeAddress: '',
        incomeStatement: null as File | null,
        medicalReport: null as File | null
    });

    const handleSharedInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file' && files) {
            setSharedInfo({
                ...sharedInfo,
                [name]: files[0]
            });
        } else {
            setSharedInfo({
                ...sharedInfo,
                [name]: value
            });
        }
    };


    // Render the shared information form
    const renderSharedForm = () => (
        <div className="space-y-2">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            
            <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    name="fullName"
                    value={sharedInfo.fullName}
                    onChange={handleSharedInfoChange}
                    required
                    className="h-8 text-sm px-2 py-1"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={sharedInfo.email}
                    onChange={handleSharedInfoChange}
                    required
                    className="h-8 text-sm px-2 py-1"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="icNumber">IC Number</Label>
                <Input
                    id="icNumber"
                    name="icNumber"
                    value={sharedInfo.icNumber}
                    onChange={handleSharedInfoChange}
                    required
                    className="h-8 text-sm px-2 py-1"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={sharedInfo.phoneNumber}
                    onChange={handleSharedInfoChange}
                    required
                    className="h-8 text-sm px-2 py-1"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="profilePicture">Profile Picture</Label>
                <Input
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleSharedInfoChange}
                    required
                    className="h-8 text-sm px-2 py-1"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="idProof">ID Proof</Label>
                <Input
                    id="idProof"
                    name="idProof"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleSharedInfoChange}
                    required
                    className="h-8 text-sm px-2 py-1"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <select
                    id="role"
                    name="role"
                    value={selectedRole}
                    onChange={(e) => {
                        setSelectedRole(e.target.value);
                        setSharedInfo({...sharedInfo, role: e.target.value});
                    }}
                    required
                    className="w-full border border-gray-400 rounded-sm p-1 h-8 text-sm"
                >
                    <option value="">Select Role</option>
                    <option value="charity-admin">Charity Organization Admin</option>
                    <option value="donor">Donor</option>
                    <option value="recipient">Recipient</option>
                </select>
            </div>
        </div>
    );

    // Render role-specific forms
    const renderRoleSpecificForm = () => {
        switch(selectedRole) {
            case 'charity-admin':
                return (
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Organization Details</h2>
                        
                        <div className="space-y-1.5">
                            <Label htmlFor="organizationName">Organization Name</Label>
                            <Input
                                id="organizationName"
                                value={roleSpecificInfo.organizationName}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    organizationName: e.target.value
                                })}
                                required
                                className="h-8 text-sm px-2 py-1"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="registrationNumber">Registration Number</Label>
                            <Input
                                id="registrationNumber"
                                value={roleSpecificInfo.registrationNumber}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    registrationNumber: e.target.value
                                })}
                                required
                                className="h-8 text-sm px-2 py-1"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="bankAccount">Bank Account</Label>
                            <Input
                                id="bankAccount"
                                value={roleSpecificInfo.bankAccount}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    bankAccount: e.target.value
                                })}
                                required
                                className="h-8 text-sm px-2 py-1"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="website">Website/Social Media</Label>
                            <Input
                                id="website"
                                type="url"
                                value={roleSpecificInfo.website}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    website: e.target.value
                                })}
                                className="h-8 text-sm px-2 py-1"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="registrationCert">Certificate of Registration</Label>
                            <Input
                                id="registrationCert"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    registrationCert: e.target.files?.[0] || null
                                })}
                                required
                                className="h-8 text-sm px-2 py-1"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="orgAddress">Organization Address</Label>
                            <Textarea
                                id="orgAddress"
                                value={roleSpecificInfo.orgAddress}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    orgAddress: e.target.value
                                })}
                                required
                                className="text-sm px-2 py-1 min-h-[60px] resize-none"
                            />
                        </div>
                    </div>
                );
            
            case 'donor':
                return (
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Additional Details</h2>
                        <div className="space-y-1.5">
                            <Label htmlFor="homeAddress">Home Address</Label>
                            <Textarea
                                id="homeAddress"
                                value={roleSpecificInfo.homeAddress}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    homeAddress: e.target.value
                                })}
                                required
                                className="text-sm px-2 py-1 min-h-[60px] resize-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="incomeStatement">Income Statement</Label>
                            <Input
                                id="incomeStatement"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    incomeStatement: e.target.files?.[0] || null
                                })}
                                required
                                className="h-8 text-sm px-2 py-1"
                            />
                        </div>
                    </div>
                );
            
            case 'recipient':
                return (
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Additional Details</h2>
                        <div className="space-y-1.5">
                            <Label htmlFor="homeAddress">Home Address</Label>
                            <Textarea
                                id="homeAddress"
                                value={roleSpecificInfo.homeAddress}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    homeAddress: e.target.value
                                })}
                                required
                                className="text-sm px-2 py-1 min-h-[60px] resize-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="incomeStatement">Income Statement</Label>
                            <Input
                                id="incomeStatement"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    incomeStatement: e.target.files?.[0] || null
                                })}
                                required
                                className="h-8 text-sm px-2 py-1"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="medicalReport">Medical Report</Label>
                            <Input
                                id="medicalReport"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    medicalReport: e.target.files?.[0] || null
                                })}
                                required
                                className="h-8 text-sm px-2 py-1"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData = {
                ...sharedInfo,
                ...roleSpecificInfo,
                telephoneNumber: sharedInfo.phoneNumber,
                id: sharedInfo.id || '' // Provide empty string as fallback
            };
            
            const response = await registerUser(userData);
            
            if (response.success) {
                toast.success("Registration successful!");
                router.push('/auth/login');
            } else {
                toast.error(response.message || "Registration failed. Please try again.");
            }
            // setTimeout(() => router.push('/auth/login'), 2000);
        } catch (error) {
            toast.error("Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-6xl">
                <div className={`grid ${selectedRole ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                    <div className="mb-4">
                        {renderSharedForm()}
                    </div>
                    {selectedRole && (
                        <div className="mb-4">
                            {renderRoleSpecificForm()}
                        </div>
                    )}
                </div>
                <Button 
                    type="submit"
                    className="w-full mt-4 bg-[#0077B6] hover:bg-[#00689F]"
                >
                    Register
                </Button>
            </form>
        </div>
    );
};

export default RegisterPage;

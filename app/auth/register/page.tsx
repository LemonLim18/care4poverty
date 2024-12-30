"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'react-toastify';
import { registerUser, uploadFile, getUser} from '@/lib/authFactory';
import  { useUserContext } from '@/app/context/UserContext'
import Image from 'next/image';
import Link from 'next/link';

const RegisterPage = () => {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState('');
    const {userUid, setUserUid} = useUserContext();
    const [googleUserId, setGoogleUserId] = useState('');
   
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

    useEffect(() => {
        const fetchUserId = async () => {
            const user = await getUser();
            console.log("User: ", user);
            const userId = user?.id || null;
            setUserUid(userId);
            setSharedInfo(prevSharedInfo => ({ ...prevSharedInfo, id: userId || '' }));
        };
        fetchUserId();
    }, []);

    console.log("Shared Info Updated:", sharedInfo);

    // Role-specific state
    const [roleSpecificInfo, setRoleSpecificInfo] = useState({
        // Charity Admin fields
        organizationName: '',
        organizationDistrict: '',
        organizationDescription: '',
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
        <div className="space-y-5">
            <h2 className="text-3xl font-semibold font-giorgio mt-8 ml-40 mb-8">Basic Information</h2>
            
            <div className="space-y-1 ml-40">
                <Label htmlFor="fullName" className="text-base font-medium">
                    Full Name
                    <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                </Label>
                <Input
                    id="fullName"
                    name="fullName"
                    value={sharedInfo.fullName}
                    onChange={handleSharedInfoChange}
                    required
                    className={`h-11 ${selectedRole ? 'w-96' : 'w-[808px]'} text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out`}
                />
            </div>

            <div className="space-y-1 ml-40">
                <Label htmlFor="email" className="text-base font-medium">
                    Contact Email
                    <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={sharedInfo.email}
                    onChange={handleSharedInfoChange}
                    required
                    className={`h-11 ${selectedRole ? 'w-96' : 'w-[808px]'} text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out`}
                />
            </div>

            <div className="space-y-1 ml-40">
                <Label htmlFor="icNumber" className="text-base font-medium">
                    IC Number
                    <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                </Label>
                <Input
                    id="icNumber"
                    name="icNumber"
                    value={sharedInfo.icNumber}
                    onChange={handleSharedInfoChange}
                    required
                    className={`h-11 ${selectedRole ? 'w-96' : 'w-[808px]'} text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out`}
                />
            </div>

            <div className="space-y-1 ml-40">
                <Label htmlFor="phoneNumber" className="text-base font-medium"  >
                    Phone Number
                    <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                </Label>
                <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={sharedInfo.phoneNumber}
                    onChange={handleSharedInfoChange}
                    required
                    className={`h-11 ${selectedRole ? 'w-96' : 'w-[808px]'} text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out`}
                />
            </div>

            <div className="space-y-1 ml-40">
                <Label htmlFor="profilePicture" className="text-base font-medium">
                    Profile Picture
                    <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                </Label>
                <Input
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleSharedInfoChange}
                    required
                    className="hidden"
                />
                <label htmlFor="profilePicture" className={`h-11 ${selectedRole ? 'w-96' : 'w-[808px]'} text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black cursor-pointer flex items-center justify-between hover:font-bold hover:border-[#0C8CE9] transition-all duration-150 ease-in-out`}>
                    <span className={`mx-auto ${sharedInfo.profilePicture ? 'text-[#7D7D7D] hover:font-bold' : 'text-[#0C8CE9]'}`}>{sharedInfo.profilePicture ? sharedInfo.profilePicture.name : 'Choose File'}</span>
                </label>
                
            </div>

            <div className="space-y-1 ml-40">
                <Label htmlFor="idProof" className="text-base font-medium">
                    ID Proof
                    <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                </Label>
                <Input
                    id="idProof"
                    name="idProof"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleSharedInfoChange}
                    required
                    className="hidden"
                />
                <label htmlFor="idProof" className={`h-11 ${selectedRole ? 'w-96' : 'w-[808px]'} text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black cursor-pointer flex items-center justify-between hover:font-bold hover:border-[#0C8CE9] transition-all duration-150 ease-in-out`}>
                    <span className={`mx-auto ${sharedInfo.idProof ? 'text-[#7D7D7D] hover:font-bold' : 'text-[#0C8CE9]'}`}>{sharedInfo.idProof ? sharedInfo.idProof.name : 'Choose File'}</span>
                </label>
            </div>

            <div className="space-y-1 ml-40">
                <Label htmlFor="role" className="text-base font-medium">
                    Role
                    <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                </Label>
                <select
                    id="role"
                    name="role"
                    value={selectedRole}
                    onChange={(e) => {
                        setSelectedRole(e.target.value);
                        setSharedInfo({...sharedInfo, role: e.target.value});
                    }}
                    required
                    className={`h-11 ${selectedRole ? 'w-96' : 'w-[808px]'} text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg focus:text-black flex items-center justify-between hover:font-bold hover:border-[#0C8CE9] focus:outline-none transition-all duration-150 ease-in-out`}
                    style={{color: selectedRole ? '#7D7D7D' : '#0C8CE9'}}
                >
                    <option value="">Select Role</option>
                    <option value="charity-admin">Charity Organization Admin</option>
                    <option value="donor">Donor</option>
                    <option value="beneficiary">Beneficiary</option>
                </select>
            </div>
        </div>
    );

    // Render role-specific forms
    const renderRoleSpecificForm = () => {
        switch(selectedRole) {
            case 'charity-admin':
                return (
                    <div className="space-y-5">
                        <h2 className="text-3xl font-semibold font-giorgio mt-8 mb-8">Organization Details</h2>
                        <div className="space-y-1">
                            <Label htmlFor="organizationName" className="text-base font-medium">
                                Organization Name
                                <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                            </Label>
                            <Input
                                id="organizationName"
                                value={roleSpecificInfo.organizationName}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    organizationName: e.target.value
                                })}
                                required
                                className="h-11 w-96 text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="organizationDistrict" className="text-base font-medium">
                                Organization District
                                <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                            </Label>
                            <Input
                                id="organizationDistrict"
                                name="organizationDistrict"
                                value={roleSpecificInfo.organizationDistrict}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    organizationDistrict: e.target.value
                                })}
                                required
                                className="h-11 w-96 text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="organizationDescription" className="text-base font-medium">
                                Organization Description
                                <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                            </Label>
                            <Textarea
                                id="organizationDescription"
                                name="organizationDescription"
                                value={roleSpecificInfo.organizationDescription}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    organizationDescription: e.target.value
                                })}
                                required
                                className="h-[136px] w-96 text-sm px-4 py-4 border-2 border-custom-border-blue hover:border-[#0C8CE9] focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black transition-colors duration-150 ease-in-out"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="orgAddress" className="text-base font-medium">
                                Organization Address
                                <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                            </Label>
                            <Textarea
                                id="orgAddress"
                                value={roleSpecificInfo.orgAddress}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    orgAddress: e.target.value
                                })}
                                required
                                className="h-[136px] w-96 text-sm px-4 py-4 border-2 border-custom-border-blue hover:border-[#0C8CE9] focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black transition-colors duration-150 ease-in-out"
                            />
                        </div>

                        <div className="space-y-1 mt-4">
                            <Label htmlFor="registrationNumber" className="text-base font-medium">
                                Registration Number
                                <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                            </Label>
                            <Input
                                id="registrationNumber"
                                value={roleSpecificInfo.registrationNumber}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    registrationNumber: e.target.value
                                })}
                                required
                                className="h-11 w-96 text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="bankAccount" className="text-base font-medium">
                                Bank Account
                                <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                            </Label>
                            <Input
                                id="bankAccount"
                                value={roleSpecificInfo.bankAccount}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    bankAccount: e.target.value
                                })}
                                required
                                className="h-11 w-96 text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="website" className="text-base font-medium">
                                Website/Social Media
                                <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                            </Label>
                            <Input
                                id="website"
                                type="url"
                                value={roleSpecificInfo.website}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    website: e.target.value
                                })}
                                className="h-11 w-96 text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="registrationCert" className="text-base font-medium">
                                Certificate of Registration
                                <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                            </Label>
                            <Input
                                id="registrationCert"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    registrationCert: e.target.files?.[0] || null
                                })}
                                required
                                className="hidden"
                            />
                            <label htmlFor="registrationCert" className={`h-11 w-96 text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black cursor-pointer flex items-center justify-between hover:font-bold hover:border-[#0C8CE9] transition-all duration-150 ease-in-out`}>
                                <span className={`mx-auto ${roleSpecificInfo.registrationCert ? 'text-[#7D7D7D] hover:font-bold' : 'text-[#0C8CE9]'}`}>{roleSpecificInfo.registrationCert ? roleSpecificInfo.registrationCert.name : 'Choose File'}</span>
                            </label>
                        </div>
                    </div>
                );
            
            case 'donor':
                return (
                    <div className="space-y-5">
                        <h2 className="text-3xl font-semibold font-giorgio mt-8 mb-8">Additional Details</h2>
                        <div className="space-y-1">
                            <Label htmlFor="homeAddress" className="text-base font-medium">
                                Home Address
                                <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                            </Label>
                            <Textarea
                                id="homeAddress"
                                value={roleSpecificInfo.homeAddress}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    homeAddress: e.target.value
                                })}
                                required
                                className="h-[136px] w-96 text-sm px-4 py-4 border-2 border-custom-border-blue hover:border-[#0C8CE9] focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black transition-colors duration-150 ease-in-out"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="incomeStatement" className="text-base font-medium">
                                Income Statement
                                <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>    
                            </Label>
                            <Input
                                id="incomeStatement"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    incomeStatement: e.target.files?.[0] || null
                                })}
                                required
                                className="hidden"
                            />
                            <label htmlFor="incomeStatement" className={`h-11 ${selectedRole ? 'w-96' : 'w-[808px]'} text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black cursor-pointer flex items-center justify-between hover:font-bold hover:border-[#0C8CE9] transition-all duration-150 ease-in-out`}>
                                <span className={`mx-auto ${roleSpecificInfo.incomeStatement ? 'text-[#7D7D7D] hover:font-bold transition-all duration-150 ease-in-out' : 'text-[#0C8CE9]'}`}>{roleSpecificInfo.incomeStatement ? roleSpecificInfo.incomeStatement.name : 'Choose File'}</span>
                            </label>
                        </div>
                    </div>
                );
            
            case 'beneficiary':
                return (
                    <div className="space-y-5">
                        <h2 className="text-3xl font-semibold font-giorgio mt-8 mb-8">Additional Details</h2>
                        <div className="space-y-1">
                            <Label htmlFor="homeAddress" className="text-base font-medium">
                                Home Address
                                <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                            </Label>
                            <Textarea
                                id="homeAddress"
                                value={roleSpecificInfo.homeAddress}
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    homeAddress: e.target.value
                                })}
                                required
                                className="h-[136px] w-96 text-sm px-4 py-4 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="incomeStatement" className="text-base font-medium">
                                Income Statement
                                <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>    
                            </Label>
                            <Input
                                id="incomeStatement"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    incomeStatement: e.target.files?.[0] || null
                                })}
                                required
                                className="hidden"
                            />
                            <label htmlFor="incomeStatement" className={`h-11 ${selectedRole ? 'w-96' : 'w-[808px]'} text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black cursor-pointer flex items-center justify-between hover:font-bold hover:border-[#0C8CE9] transition-all duration-150 ease-in-out`}>
                                <span className={`mx-auto ${roleSpecificInfo.incomeStatement ? 'text-[#7D7D7D] hover:font-bold' : 'text-[#0C8CE9]'}`}>{roleSpecificInfo.incomeStatement ? roleSpecificInfo.incomeStatement.name : 'Choose File'}</span>
                            </label>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="medicalReport" className="text-base font-medium">
                                Medical Report
                                <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                            </Label>
                            <Input
                                id="medicalReport"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setRoleSpecificInfo({
                                    ...roleSpecificInfo,
                                    medicalReport: e.target.files?.[0] || null
                                })}
                                required
                                className="hidden"
                            />
                            <label htmlFor="medicalReport" className={`h-11 ${selectedRole ? 'w-96' : 'w-[808px]'} text-sm px-4 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black cursor-pointer flex items-center justify-between hover:font-bold hover:border-[#0C8CE9] transition-all duration-150 ease-in-out`}>
                                <span className={`mx-auto ${roleSpecificInfo.medicalReport ? 'text-[#7D7D7D] hover:font-bold' : 'text-[#0C8CE9]'}`}>{roleSpecificInfo.medicalReport ? roleSpecificInfo.medicalReport.name : 'Choose File'}</span>
                            </label>
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
                id: sharedInfo.id || '', // Provide empty string as fallback
                // Add organization details for charity-admin role
                ...(sharedInfo.role === 'charity-admin' && {
                    organization_description: roleSpecificInfo.organizationDescription,
                    organization_district: roleSpecificInfo.organizationDistrict
                })
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
        <div className="flex flex-col items-center justify-center min-h-screen p-4 font-roboto">
            <div className="absolute top-0 left-0 m-5"><Link href="/">
            <Image
                src="/images/logo.png"
                alt="Care4Poverty Logo"
                width={180}
                height={100}
            />
            </Link>
            </div>
            <h1 className="font-giorgio font-bold text-5xl text-center mt-20">Let's get you started</h1>
            <span className="text-center font-medium text-lg text-[#8B8B8B] mt-2">Enter the details to get going</span>
            <h1 className="absolute top-0 right-0 m-12 text-base">
                Already registered ? <span onClick={() => router.push('/auth/login')} className="ml-5 text-[#0C8CE9] hover:font-bold cursor-pointer"> Login</span>
            </h1>
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
                <div className="flex justify-center">
                    <Button 
                        type="submit"
                        className="mr-6 mt-2 h-11 w-32 bg-[#0077B6] hover:bg-[#00689F] rounded-lg text-base"
                    >
                        Register
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;

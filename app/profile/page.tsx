"use client";

import { useEffect, useState } from "react";
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { UserType } from "@/datatypes/types";
import { getUser, signOut } from "@/lib/authFactory";
import { updateRecord } from "@/lib/supabaseAPI";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("user");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setFormData(parsedUserData);
    } 

    console.log("Form Data: ", formData);
  }, []);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if(!formData) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData) {
      toast.error("An error occurred while updating the profile");
      return;
    }
  
    // Step 1: Update the local user data
    setUserData(formData as UserType);
    sessionStorage.setItem("user", JSON.stringify(formData));
  
    // Step 2: Update the data on the server
    try {
        console.log("Form Data Id: ", formData.id);
        console.log("Form Data to be Updated: ", formData);
        const { data: updatedData, error } = await updateRecord("users", formData.id, formData as UserType);
        console.log("Error: ", error);
        if (error) {
          // Handle the error case
          toast.error("An error occurred while updating the profile");
          console.error("Update error:", error);
        } else {
          // Successfully updated
          console.log("Updated Data to Supabase:", updatedData);
          toast.success("Profile updated successfully!");
        }
    } catch (err) {
      // Catch any unexpected errors during the update process
      toast.error("An error occurred while updating the profile");
      console.error("Unexpected error:", err);
    }
  
    // Step 3: Exit editing mode
    setIsEditing(false);
  };
  

  const renderField = (label: string, value: string, name: string, type = "text") => {
    if (!value) return null; // Skip rendering fields with empty values
    return (
      <div className="mb-4">
        <label className="block font-semibold text-gray-600 mb-1">{label}</label>
        {isEditing ? (
          <input
          type={type}
          name={name}
          value={(formData as any)[name] || ""}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded p-2 overflow-x-auto text-ellipsis"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        />
        ) : (
            <p className="bg-gray-100 p-2 rounded overflow-hidden text-ellipsis" style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {value}
              </p>
        )}
      </div>
    );
  };
  const handleLogout = async () => {
    await signOut();
    toast.success('Successfully logged out!', {
        autoClose: 1250, // Toast will disappear after 1500s
    });
    setTimeout(() => {
        router.push('/auth/login'); // Redirect to login page after logout
    }, 1000);
};

  return (
    <div className="h-screen flex">
      <SideBarComponent 
        userData={userData || undefined}
        onLogout={handleLogout}    
    />
      <main className="w-screen flex flex-col mt-8 mx-8 sm:mx-8 md:ml-16 md:mr-10">
        <div className="flex items-center gap-2">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem className="font-bold text-black">Profile</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
        <div className="mt-7 mb-7">
            <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">My Profile</h1>
            {userData ? (
              <div className="max-w-6xl mb-10 mx-auto shadow-lg rounded-lg p-6">
                <div className="flex items-center mb-6">
                  <img
                    src={userData.profile_picture}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-2 border-gray-300"
                  />
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{userData.full_name}</h2>
                    <p className="text-gray-500">
                      {userData.role === 'charity-admin' && 'Charity Admin'}
                      {userData.role === 'donor' && 'Donor'}
                      {userData.role === 'beneficiary' && 'Beneficiary'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderField("Full Name", userData.full_name, "full_name")}
                  {renderField("IC Number", userData.ic_number, "ic_number")}
                  {renderField("Contact Email", userData.email, "email", "email")}
                  {renderField(
                    "Telephone Number",
                    userData.telephone_number,
                    "telephone_number"
                  )}
                  {renderField("Bank Account", userData.bank_account, "bank_account")}
                  {renderField(
                    "Organization Name",
                    userData.organization_name,
                    "organization_name"
                  )}
                  {renderField(
                    "Organization Address",
                    userData.organization_address,
                    "organization_address"
                  )}
                  {renderField("Website", userData.website, "website", "url")}
                  {renderField(
                    "Registration Number",
                    userData.registration_number,
                    "registration_number"
                  )}
                  {renderField(
                    "Registration Certificate",
                    userData.registration_cert || "",
                    "registration_cert"
                  )}
                  {renderField("ID Proof", userData.id_proof, "id_proof")}
                  {renderField(
                    "Income Statement",
                    userData.income_statement || "",
                    "income_statement"
                  )}
                  {renderField("Medical Report", userData.medical_report || "", "medical_report")}
                  {renderField("Home Address", userData.home_address, "home_address")}
                  {/* {renderField("Created At", userData.created_at, "created_at")} */}
                  {renderField("Updated At", userData.updated_at, "updated_at")}
                </div>
                <div className="flex justify-end mt-6">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditToggle}
                        className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

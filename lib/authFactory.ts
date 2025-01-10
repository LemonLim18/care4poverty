import { supabase } from './supabaseClient';
import { createRecord } from "./supabaseAPI";
import { User, AuthResponse } from '@supabase/supabase-js';
import { useState } from 'react';


// Define an interface for the user registration data
interface UserRegistrationData {
  id: string,
  email: string,
  fullName: string,
  icNumber: string,
  idProof: File | null,
  telephoneNumber: string,
  profilePicture: File | null,
  role: string,
  // Role-specific fields
  organizationName?: string,
  organizationDescription?: string,
  organizationDistrict?: string,
  registrationNumber?: string,
  bankAccount?: string,
  orgAddress?: string,
  website?: string,
  registrationCert?: File | null,
  homeAddress?: string,
  incomeStatement?: File | null,
  medicalReport?: File | null,
  created_at?: Date,
  updated_at?: Date
}

// Sign Up Function
export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    // Check for errors and return the appropriate structure
    if (error) {
        return {
            data: {
                user: null,
                session: null,
            },
            error,  // Return the error received from Supabase
        };
    }

    const user = data.user;
    const session = data.session;

    return {
        data: {
            user,
            session,
        },
        error: null,  // No error
    };
};

// Register User Function
export const registerUser = async (data: UserRegistrationData) => {
  // Prepare base user data
  const baseUserData = {
    id: data.id,
    email: data.email,
    full_name: data.fullName,
    ic_number: data.icNumber,
    id_proof: '',
    profile_picture: '',
    telephone_number: data.telephoneNumber,
    role: data.role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // idProof is the pdf data type
  if (data.idProof) {
    const idUploadResult = await uploadFile(data.idProof);
    if (idUploadResult.data) {
      console.log("ID Proof: ", idUploadResult.data);
      baseUserData.id_proof = idUploadResult.data.file_url; // Store the file URL
    } else {
      console.error("Failed to push the ID proof", idUploadResult.error);
    }
  }

  // profile Picture is the png data type
  if (data.profilePicture) {
    const profileUploadResult = await uploadFile(data.profilePicture);
    if (profileUploadResult.data) {
      console.log("Profile Picture: ", profileUploadResult.data);
      baseUserData.profile_picture = profileUploadResult.data.file_url; // Store the file URL
    } else {
      console.error("Failed to push the Profile Picture", profileUploadResult.error);
    }
  }

  // Initialize role-specific fields
  let roleSpecificData: any = {};

  if (data.role === 'charity-admin') {
    roleSpecificData = {
      organization_name: data.organizationName,
      organization_address: data.orgAddress,
      organization_description: data.organizationDescription,
      organization_district: data.organizationDistrict,
      registration_number: data.registrationNumber,
      registration_cert: '', // Placeholder for the uploaded file URL
      bank_account: data.bankAccount,
      website: data.website,
    };

    // Upload registration certificate if provided
    if (data.registrationCert) {
      const certUploadResult = await uploadFile(data.registrationCert);
      if (certUploadResult.data) {
        console.log("Registration Certificate: ", certUploadResult.data);
        roleSpecificData.registration_cert = certUploadResult.data.file_url; // Store the file URL
      } else {
        console.error("Failed to push the certification", certUploadResult.error);
      }
    }
  } else {
    roleSpecificData = {
      home_address: data.homeAddress,
      income_statement: '', // Placeholder for the uploaded file URL
      medical_report: '', // Placeholder for the uploaded file URL
    };

    // Upload income statement if provided
    if (data.incomeStatement) {
      const incomeUploadResult = await uploadFile(data.incomeStatement);
      if (incomeUploadResult.data) {
        console.log("Income Upload: ", incomeUploadResult.data);
        roleSpecificData.income_statement = incomeUploadResult.data.file_url; // Store the file URL
      }else{
        console.error("Failed to push the incomeStatement");
      }
    }

    // Upload medical report if provided
    if (data.role === 'recipient' && data.medicalReport) {
      const medicalUploadResult = await uploadFile(data.medicalReport);
      // medicalUploadResult.data here refers to the file url
      if (medicalUploadResult.data) {
        console.log("Medical Reload: ", medicalUploadResult.data);
        roleSpecificData.medical_report = medicalUploadResult.data.file_url; // Store the file URL
        console.error("Failed to push the medicalStatement");
      }
    }
  }

  // Combine base user data with role-specific data
  const userData = {
    ...baseUserData,
    ...roleSpecificData,
  };

  console.log("before api call:", userData);
  const { data: userDataResponse, error: insertError } = await createRecord("users", userData);

  if (insertError) {
    console.log('Error posting data: ', insertError);
    return {
      success: false,
      message: insertError.message || 'Failed to create user record'
    };
  }

  console.log("Data posted successfully");
  return {
    success: true,
    data: userDataResponse
  };
};

export const uploadFile = async(file: File) => {
  const bucketName = file.type === 'application/pdf' ? 'documents' : 'photos';
  
  const filePath = `users/${file.name}`;

  // Upload file to storage bucket
  const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file);

  if (error) {
    console.log('Fail to upload to: ',filePath,' with ', error.message);
    return { data: null, error }; // Return an object with null data and the error
  }

  // Get public URL of the file
  // const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`public/${file.name}`);
  const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  const fileUrl = publicUrlData.publicUrl;
  console.log("The file url: ", fileUrl);

  // Insert file metadata into the database
  // const { data: dbData, error: dbError } = await supabase
  //   .from('users')
  //   .insert([{ file_name: file.name }]);

  // if (dbError) {
  //   console.log('Database insert failed:', dbError.message);
  //   return { data: null, error: dbError }; // Return an object with null data and the database error
  // }

  return { data: { file_url: fileUrl }, error: null }; // Return the file URL
};

// Sign In Function
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    // Check for errors and return the appropriate structure
    if (error) {
        return {
            data: {
                user: null,
                session: null,
            },
            error,  // Return the error received from Supabase
        };
    }

    const user = data.user;
    const session = data.session;

    return {
        data: {
            user,
            session,
        },
        error: null,  // No error
    };
};

// Sign Out Function
export const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    sessionStorage.clear(); // Clear session storage
};

// Get Current User Function
export const getUser = async (): Promise<User | null> => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }

    return user;
};

export const checkEmailConfirmation = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.getUser();

    console.log("confirmation data(isConfirmed?): ", data)

    // Handle cases where the session does not exist
    if (!data?.user || error) {
      console.log(`User with email ${email} is not authenticated or session is invalid:`, error?.message);
      return false;
    }

    // Check if the email is confirmed
    const isEmailConfirmed = data.user.email_confirmed_at !== null;
    return isEmailConfirmed;
  } catch (err) {
    console.error(`Unexpected error for user ${email}:`, err); 
    return false;
  }
};

export const handlePasswordReset = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/auth/reset-password' // Specify your redirect URL here after they click on the link in the email
    });

    if(error) {
        console.error("Error sending password reset email: ", error.message);
        return { success: false, error: error.message};
    }

    console.log("Password reset email sent to:", email);
    return { success: true, data };
};

export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `http://localhost:3000/auth/checkUser`, // Redirect to a temporary endpoint to check user existence
        },
    });

    if (error) {
        console.error('Google login error:', error.message);
        return { data: null, error }; // Return null data and the error
    }

    console.log('Login successful:', data);
    return { data, error: null }; // Return data and null error
};

// New function to check user existence and redirect accordingly
export const checkUserAndRedirect = async () => {
    const { data: { user }, error } = await supabase.auth.getUser(); // Get the currently logged-in user

    if (error) {
        console.error('Error fetching user:', error.message);
        return; // Handle the error appropriately
    }

    if (!user) {
        console.error('No user found after login.');
        return; // Handle the case where no user is found
    }

    // Check if the user exists in the database
    const { data: userData, error: fetchError } = await supabase
        .from('users') // Replace 'users' with your actual table name
        .select('*')
        .eq('email', user.email) // Check for the user's email
      .single(); // Get a single record

    // Redirect based on whether the user exists
    if (!userData) {
        // User does not exist, redirect to registration
        window.location.href = '/auth/register'; // Redirect to registration page
    } else {
        //
        if (userData) {
          sessionStorage.setItem('user', JSON.stringify(userData)); // Store user data
          console.log('User data stored in session storage:', userData);
        } else {
          console.error("User data is undefined.");
        }
        // User exists, redirect to dashboard
        setTimeout(() => {
          console.log("Redirected to dashboard page")
          if (userData?.role === 'charity-admin') {
            window.location.href = '/dashboard';
          } else if (userData?.role === 'donor') {
            window.location.href = '/donorDashboard';
          } else if (userData?.role === 'beneficiary') {
            window.location.href = '/beneficiaryDashboard';
          } else {
            console.error('User role not found!');
          }
        }, 1800);
    }
};

export const uploadEventPhoto = async(file: File) => {
  const bucketName = 'photos'; // Use the 'photos' bucket
  const filePath = `event/${file.name}`; // Use the 'event/' path

  // Upload file to storage bucket
  const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file);

  if (error) {
    console.log('Fail to upload to: ', filePath, ' with ', error.message);
    return { data: null, error }; // Return an object with null data and the error
  }

  // Get public URL of the file
  const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  const fileUrl = publicUrlData.publicUrl;
  console.log("The file url: ", fileUrl);

  return { data: { file_url: fileUrl }, error: null }; // Return the file URL
};

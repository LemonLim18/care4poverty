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
  telephoneNumber: string,
  role: string,
  // Role-specific fields
  organizationName?: string,
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
    telephone_number: data.telephoneNumber,
    role: data.role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Add role-specific fields
  const userData = data.role === 'charity-admin' 
    ? {
        ...baseUserData,
        organization_name: data.organizationName,
        registration_number: data.registrationNumber,
        bank_account: data.bankAccount,
        org_address: data.orgAddress,
        website: data.website,
        registration_cert: data.registrationCert,
      }
    : {
        ...baseUserData,
        home_address: data.homeAddress,
        income_statement: data.incomeStatement,
        medical_report: data.role === 'recipient' ? data.medicalReport : null,
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

export const signInWithGoogle = async() => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `http://localhost:3000/dashboard`,
        },
      });
    
      if (error) {
        console.error('Google login error:', error.message);
      } else {
        console.log('Login successful:', data);
      }
      return {data, error};
};

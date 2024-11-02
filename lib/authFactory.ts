import { supabase } from './supabaseClient';
import { createRecord } from "./supabaseAPI";
import { User, AuthResponse } from '@supabase/supabase-js';
import { useState } from 'react';


// Define an interface for the user registration data
interface UserRegistrationData {
  id?: string, // This should be replaced with the user ID from your authentication context after signup
  email: string, // Use email from the registration data
  fullName: string, // Change to match the column name in Supabase
  birthDate: string, // Change to match the column name in Supabase
  icNumber: string, // Change to match the column name in Supabase
  telephoneNumber: string, // Change to match the column name in Supabase
  homeAddress: string, // Change to match the column name in Supabase
  category?: string | null, // Set to null or appropriate value if needed, as it is not part of the registration data
  created_at?: Date, // Set to the current timestamp
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
  // Prepare the user data to insert into the users table
  console.log("Auth Data: ", data)

  const userData = {
    id: data.id, // This should be replaced with the user ID from your authentication context after signup
    email: data.email, // Use email from the registration data
    full_name: data.fullName, // Change to match the column name in Supabase
    birth_date: data.birthDate, // Change to match the column name in Supabase
    ic_number: data.icNumber, // Change to match the column name in Supabase
    telephone_number: data.telephoneNumber, // Change to match the column name in Supabase
    home_address: data.homeAddress, // Change to match the column name in Supabase
    category: "Donator", // Set to null or appropriate value if needed, as it is not part of the registration data
    created_at: new Date().toISOString(), // Set to the current timestamp
    updated_at: new Date().toISOString() // Set to the current timestamp
  };
  console.log("before api call")
  // Insert the user data into the users table
//   const { data: userDataResponse,  error: insertError } = await supabase
    //   .from('users') // Replace 'users' with the actual name of your table
    //   .insert([userData]);

  const { data: userDataResponse, error: insertError } = await createRecord("users", userData);
  console.log("after api call: ", userData)
  // Check for insertion errors
  if (insertError) {
      console.log('Error posting data: ', insertError);
      return;
  }

  // Return the inserted user data and null error
  console.log("Data posted successfully")
  return {
      data: userDataResponse,
      error: null,
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
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if(error) {
        console.error("Error sending password reset email: ", error.message);
        return { success: false, error: error.message};
    }

    console.log("Password reset email sent to:", email);
    return { success: true, data };
};

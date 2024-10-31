// lib/supabaseAPI.ts
import { supabase } from './supabaseClient'; // Adjust the import based on your file structure

export type DataRecord = {
  [key: string]: any; // Use a generic object type to allow for any fields
};

// Create a new record in a specified table
export const createRecord = async (table: string, data: DataRecord) => {
  const { data: responseData, error } = await supabase
    .from(table)
    .insert([data]);

  return { data: responseData, error };
};

// Get a single record by ID from a specified table
export const getRecordById = async (table: string, id: string) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single(); // Fetch a single record by ID

  return { data, error };
};

// Update a record by ID in a specified table
export const updateRecord = async (table: string, id: string, data: Partial<DataRecord>) => {
  const { data: responseData, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id);

  return { data: responseData, error };
};

// Delete a record by ID from a specified table
export const deleteRecord = async (table: string, id: string) => {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  return { data, error };
};

// Get all records from a specified table
export const getAllRecords = async (table: string) => {
  const { data, error } = await supabase
    .from(table)
    .select('*');

  return { data, error };
};

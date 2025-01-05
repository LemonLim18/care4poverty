// lib/supabaseAPI.ts
import { supabase } from './supabaseClient'; // Adjust the import based on your file structure

export type DataRecord = {
  [key: string]: any; // Use a generic object type to allow for any fields
};

// Create a new record in a specified table
export const createRecord = async (table: string, data: DataRecord) => {
  const { data: responseData, error } = await supabase
    .from(table)
    .insert([data])
    .select('*'); // Fetch the inserted record

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

// Get all records from a specified table based on a field and value
export const getRecordsByField = async (table: string, field: string, value: any) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(field, value); // Fetch records where the specified field matches the value

  return { data, error };
};

// Get records for notifications
export const getNotifications = async (table: string, userId?: string, filters?: object, orderBy?: string) => {
  let query = supabase.from(table).select(`
      *,
      users:other_id (full_name, profile_picture)
  `);

  if (userId) {
    query = query.eq('user_id', userId); // Filter by user ID
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value); // Apply additional filters
    });
  }

  if (orderBy) {
    query = query.order(orderBy, { ascending: false }); // Apply sorting
  }

  const { data, error } = await query;

  return { data, error };
};

// Get records for events
export const getEvents = async (table: string, userId: string | null = null, type: string | null = null, filters?: object, orderBy?: string) => {
  let query = supabase.from(table).select(`
      *,
      users:org_id (*)
  `);

  if (userId !== null) {
    query = query.eq('org_id', userId);
  }

  if (type !== null) {
    query = query.eq('event_type', type); // Filter by type
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value); // Apply additional filters
    });
  }

  if (orderBy) {
    query = query.order(orderBy, { ascending: false }); // Apply sorting
  }

  const { data, error } = await query;

  return { data, error };
};

export const getItems = async (table: string, userId: string | null = null, orgID: string | null = null, status: string | null = null) => {
  let query = supabase.from(table).select(`
      *,
      users:organization_id (*)
  `);

  if (userId !== null) {
    query = query.eq('beneficiary_id', userId);
  }

  if (orgID !== null) {
    query = query.eq('organization_id', orgID);
  }

  if (status !== null) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  return { data, error };
}

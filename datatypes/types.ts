export type UserType = {
    id: string;
    created_at: string; // Use 'string' to represent timestamps in ISO format
    updated_at: string; // Same as above
    full_name: string;
    ic_number: string;
    telephone_number: string;
    email: string;
    role: string;
    organization_name: string;
    organization_address: string;
    registration_number: string;
    bank_account: string;
    org_address: string;
    website: string;
    id_proof: string;
    profile_picture: string,
    registration_cert?: string;
    home_address: string;
    income_statement?: string;
    medical_report?: string;
};
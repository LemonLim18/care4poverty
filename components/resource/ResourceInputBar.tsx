import React, { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { createRecord } from '@/lib/supabaseAPI'; // Adjust the import path based on your project structure
import { toast } from 'react-toastify'; // Import the toast module

interface ResourceInputBarProps {
    onAddResource: (name: string, category: string, number: number) => void;
    className?: string; // Optional className prop for additional styling
}

const ResourceInputBar: React.FC<ResourceInputBarProps> = ({ onAddResource, className }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [number, setNumber] = useState(1);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (name && category && number >= 1) {
            const resourceData = {
                resource_name: name,
                resource_category: category,
                resource_amount: number,
            }
            
            // Insert the new resource into Supabase
            const { data, error } = await createRecord('resources', resourceData);
        
            if (error) {
                console.error('Error inserting resource:', error);
                toast.error('Failed to add resource. Please try again.', {autoClose: 1500}); // Show error toast
            } else {
                console.log('Resource added:', data);
                onAddResource(name, category, number); // Call the parent function to update the state
                toast.success('Resource added successfully!', {autoClose: 1500}); // Show success toast
                setName('');
                setCategory('');
                setNumber(1);
            }
        } else {
            toast.warn('Please fill in all fields correctly.', {autoClose: 1500}); // Show warning if fields are invalid
        }
    };

    return (
        <div 
            className={`
                mt-0
                flex 
                items-center 
                justify-between 
                p-4 
                bg-white 
                border 
                rounded-lg 
                shadow-sm 
                hover:shadow-md 
                transition-all 
                duration-300 
                ${className}
            `}
        >
            {/* Left Section: Icon */}
            <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <FaPlus className="text-blue-500 w-6 h-6" /> {/* Replace with your icon */}
                </div>
                
                {/* Name and Category */}
                <div>
                    <input
                        type="text"
                        placeholder="Enter the product name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-[#F3F3F3] text-sm border px-2 py-1 rounded-lg w-full"
                        required
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`bg-[#F3F3F3] text-sm border px-2 py-1 rounded-lg w-full mt-2 ${category === '' ? 'text-gray-500' : 'text-black'}`}
                        required
                    >
                        <option value="" className="text-gray-500">Select a category</option>
                        <option value="Foods">Foods</option>
                        <option value="Wearable Items">Wearable Items</option>
                    </select>
                </div>
            </div>

            {/* Right Section: Number and Action Button */}
            <div className="flex items-center space-x-4">
                <input
                    type="number"
                    placeholder="Enter the number"
                    value={number}
                    onChange={(e) => setNumber(Number(e.target.value))}
                    className="bg-[#F3F3F3] border px-2 py-1 rounded-lg w-10"
                    min="1"
                    required
                />
                <button 
                    onClick={handleSubmit} 
                    className="px-[26px] py-1 bg-[#038BD4] text-white rounded-md hover:bg-[#0077B6] transition-colors duration-300"
                >
                    Add Resource
                </button>
            </div>
        </div>
    );
};

export default ResourceInputBar; 
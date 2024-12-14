import React from 'react';
import { LucideIcon } from 'lucide-react';

// Define the props interface
interface ResourceBarProps {
    icon: LucideIcon;  // Lucide icon from lucide-react
    name: string;
    category: string;
    number: number | string;
    actionLabel?: string;
    onActionClick?: () => void;
    className?: string;
    onAdd?: () => void;
    onSubtract?: () => void;
    onDelete?: () => void;
    showActions?: boolean;  // Props to control the appearance of action buttons
    index: number; // Pass an index to calculate the color cycle
}

// Color arrays for cycling
const foodBgColors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500'];
const foodTxtColors = ['text-black', 'text-black', 'text-yellow-700'];
const foodOutlines = ['outline-red-700', 'outline-blue-700', 'outline-yellow-700'];
const wearableBgColors = ['bg-purple-500', 'bg-green-500', 'bg-orange-500'];
const wearableTxtColors = ['outline-purple-700', 'outline-green-700', 'outline-orange-700'];
const wearableOutlines = ['outline-purple-700', 'outline-green-700', 'outline-orange-700'];

const ResourceBar: React.FC<ResourceBarProps> = ({
    index,  // Destructure index from props
    icon: Icon,  // Destructure icon as Icon to use as a component
    name,
    category,
    number,
    actionLabel = 'Action',
    onActionClick,
    className = '',
    onAdd,
    onSubtract,
    onDelete,
    showActions = false,  // Default to false
    // index, // Use the index to calculate the color
}) => {
    // Determine the color based on category and index
    const isFood = category === 'Foods';
    const bgClass = isFood 
        ? foodBgColors[index % foodBgColors.length] 
        : wearableBgColors[index % wearableBgColors.length];
    const outlineClass = isFood 
        ? foodOutlines[index % foodOutlines.length] 
        : wearableOutlines[index % wearableOutlines.length];
    const textClass = isFood
        ? foodTxtColors[index % foodTxtColors.length]
        : wearableTxtColors[index % wearableTxtColors.length];

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
                <div className={`flex items-center justify-center w-12 mx-3 h-12 rounded-full outline outline-3 ${bgClass} ${outlineClass} ${textClass}`}>
                    <Icon className={`w-6 h-6 `} />
                </div>
                
                {/* Name and Category */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                    <p className="text-sm text-gray-500">Category: {category}</p>
                </div>
            </div>

            {/* Right Section: Number and Action Buttons */}
            <div className="flex items-center space-x-2">
                <div className="mr-6 text-xl font-bold text-black">
                    {number}
                </div>
                {showActions && (
                    <>
                        <button
                            onClick={onAdd}
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                        >
                            +
                        </button>
                        <button
                            onClick={onSubtract}
                            className="px-[14px] py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-300"
                        >
                            -
                        </button>
                        <button
                            onClick={onDelete}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResourceBar;

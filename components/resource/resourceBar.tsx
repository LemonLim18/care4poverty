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
}

const ResourceBar: React.FC<ResourceBarProps> = ({
    icon: Icon,  // Destructure icon as Icon to use as a component
    name,
    category,
    number,
    actionLabel = 'Action',
    onActionClick,
    className = ''
}) => {
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
                <Icon className="text-blue-500 w-8 h-8" />
                
                {/* Name and Category */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                    <p className="text-sm text-gray-500">{category}</p>
                </div>
            </div>

            {/* Middle Section: Number */}
            <div className="text-xl font-bold text-blue-600">
                {number}
            </div>

            {/* Right Section: Action Button */}
            {/* <button
                onClick={onActionClick}
                className="
                    px-4 
                    py-2 
                    bg-blue-500 
                    text-white 
                    rounded-md 
                    hover:bg-blue-600 
                    transition-colors 
                    duration-300
                "
            >
                {actionLabel}
            </button> */}
        </div>
    );
};

export default ResourceBar;
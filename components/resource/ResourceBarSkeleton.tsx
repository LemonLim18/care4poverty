import React from 'react';

const ResourceBarSkeleton: React.FC = () => {
    return (
        <div className="flex items-center justify-around w-full px-4 py-5 bg-gray-200 border rounded-lg shadow-sm animate-pulse">
            {/* Left Section: Icon + Name + Category */}
            <div className="flex items-center w-full h-full gap-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div> {/* Placeholder for icon */}
                <div className="flex flex-col gap-y-2 w-full">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div> {/* Placeholder for number */}
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div> {/* Placeholder for number */}
                </div>
            </div>
            {/* Right Section: Action Button Placeholder */}
            <div className="h-8 bg-gray-300 rounded w-6 "></div> {/* Placeholder for button */}
        </div>
    );
};

export default ResourceBarSkeleton; 
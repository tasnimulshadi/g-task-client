import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center space-x-2 h-[70vh]">
            <div className="w-4 h-4 rounded-full animate-pulse bg-gray-500"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-amber-500"></div>
        </div>
    );
};

export default LoadingSpinner;
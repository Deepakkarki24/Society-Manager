import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-(--color-primary) border-t-transparent animate-spin"></div>
      </div>

      {/* Text */}
      <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
        Loading, please wait...
      </p>
    </div>
  );
};

export default LoadingPage;

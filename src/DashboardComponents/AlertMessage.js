import React from "react";

export const AlertMessages = ({ success, error }) => (
  <>
    {success && (
      <div
        className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg shadow-md flex items-center"
        data-aos="fade-up"
      >
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        {success}
      </div>
    )}
    {error && (
      <div
        className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg shadow-md flex items-center"
        data-aos="fade-up"
      >
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        {error}
      </div>
    )}
  </>
);

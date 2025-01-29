import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
    >
      <ArrowLeft className="h-5 w-5" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
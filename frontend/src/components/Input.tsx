import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className="w-full">
      <label className="block text-lg text-[#612665] mb-2">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-lg border-2 border-purple-100 focus:border-purple-500 focus:outline-none transition-colors"
      />
    </div>
  );
};

export default Input;

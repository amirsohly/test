// src/components/ui/button.js

export function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );
}

export function Input({ value, onChange, placeholder, className }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border p-2 rounded-md ${className}`}
    />
  );
}

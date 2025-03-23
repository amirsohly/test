// src/components/ui/card.js

export function Card({ children }) {
    return (
      <div className="border rounded-lg shadow-md p-4">
        {children}
      </div>
    );
  }
  
  export function CardContent({ children }) {
    return <div className="space-y-2">{children}</div>;
  }
  

import React from 'react';

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white p-5 rounded-xl shadow-lg border border-slate-200 ${className}`}>
      <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
};

export default ResultCard;

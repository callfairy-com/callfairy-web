import React from 'react';

interface UseCaseCardProps {
  title: string;
  description: string;
}

export const UseCaseCard: React.FC<UseCaseCardProps> = ({ title, description }) => {
  return (
    <div className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <span className="mt-1" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
            <path d="M4 12h16M4 6h10M4 18h6"></path>
          </svg>
        </span>
        <div>
          <h4 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';

export interface Crumb {
  label: string;
  to?: string;
}

const Breadcrumbs: React.FC<{ items: Crumb[] } > = ({ items }) => {
  return (
    <nav className="w-full text-sm text-gray-600" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((c, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-2">
              {c.to && !isLast ? (
                <Link to={c.to} className="hover:text-blue-600 transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'font-semibold text-gray-900' : undefined}>
                  {c.label}
                </span>
              )}
              {!isLast && <span className="text-gray-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

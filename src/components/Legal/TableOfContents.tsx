import React from 'react';
import { toSlug } from '../../utils/slug';

interface TocProps {
  headings: string[];
  title?: string;
}

const TableOfContents: React.FC<TocProps> = ({ headings, title = 'On this page' }) => {
  if (!headings || headings.length === 0) return null;
  return (
    <nav aria-label="Table of contents" className="mb-8 p-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
      <div className="text-sm font-semibold text-gray-800 dark:text-slate-100 mb-2">{title}</div>
      <ul className="space-y-1 text-sm">
        {headings.map((h) => (
          <li key={h}>
            <a href={`#${toSlug(h)}`} className="text-blue-700 dark:text-blue-400 hover:underline">
              {h}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;

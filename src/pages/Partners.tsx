import React from 'react';
import partnersData from '../data/partners.json';

interface Partner {
  id: number;
  name: string;
  logo: string;
  description: string;
  website: string;
}

const Partners: React.FC = () => {
  const partners = partnersData.partners as Partner[];

  return (
    <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Partners</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          We collaborate with industry leaders to bring you the best AI-powered customer support
          solutions.
        </p>
      </div>

      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {partners.map(({ id, name, logo, description, website }) => (
          <a
            key={id}
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit partner website: ${name}`}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <img
              src={logo}
              alt={`${name} logo`}
              className="w-auto h-20 object-contain mb-4"
              loading="lazy"
            />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
          </a>
        ))}
      </section>
    </main>
  );
};

export default Partners;

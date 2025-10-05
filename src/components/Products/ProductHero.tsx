import React, { useEffect } from 'react';

interface ProductHeroProps {
  name: string;
  description: string;
  status?: string;
}

export const ProductHero: React.FC<ProductHeroProps> = ({ name, description, status }) => {
  // Basic SEO: title + meta description
  useEffect(() => {
    document.title = `${name} • CallFairy`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    } else {
      const m = document.createElement('meta');
      m.setAttribute('name', 'description');
      m.setAttribute('content', description);
      document.head.appendChild(m);
    }
    // Open Graph (optional minimal)
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', `${name} • CallFairy`);
    if (!ogTitle.parentNode) document.head.appendChild(ogTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    ogDesc.setAttribute('content', description);
    if (!ogDesc.parentNode) document.head.appendChild(ogDesc);
  }, [name, description]);

  return (
    <section className="pt-20 pb-12 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-3 text-sm text-gray-600 dark:text-gray-300">
          <a href="/" className="hover:underline">Home</a>
          <span className="mx-1">/</span>
          <a href="/products" className="hover:underline">Products</a>
          <span className="mx-1">/</span>
          <span className="font-medium">{name}</span>
        </div>
        {status && status.toLowerCase().includes('coming') && (
          <div className="inline-flex items-center text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 mb-3">
            Coming soon
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">{name}</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">{description}</p>
      </div>
    </section>
  );
};

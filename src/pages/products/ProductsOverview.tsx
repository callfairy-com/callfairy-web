import React from 'react';
import { Link } from 'react-router-dom';
import productsData from '../../data/products.json';
import { toSlug } from '../../utils/slug';

interface Feature { title: string; description: string }
interface Product {
  name: string;
  description: string;
  status?: string;
  keyFeatures?: Feature[];
}

interface ProductsDoc { products: Product[] }

const allProducts = (productsData as ProductsDoc).products || [];

const ProductsOverview: React.FC = () => {
  return (
    <div className="pt-20 pb-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <section className="max-w-6xl mx-auto px-4">
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-300">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-1">/</span>
          <span className="font-medium">Products</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Products</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-3xl">Explore the CallFairy AI Platform products.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.map((p) => {
            const slug = toSlug(p.name);
            return (
              <article key={slug} className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  <Link to={`/${slug}`} className="hover:underline">{p.name}</Link>
                </h3>
                {p.status && p.status.toLowerCase().includes('coming') && (
                  <span className="inline-block text-[10px] tracking-wide uppercase bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded mb-2">Coming soon</span>
                )}
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{p.description}</p>
                <div className="flex items-center gap-3 text-sm">
                  <Link to={`/${slug}`} className="text-blue-600 dark:text-blue-400">Open</Link>
                  <Link to={`/products/${slug}`} className="text-blue-600 dark:text-blue-400">Details</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ProductsOverview;

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import productsData from '../../data/products.json';
import { toSlug } from '../../utils/slug';
import { ProductHero } from '../../components/Products/ProductHero';
import { FeatureCard } from '../../components/Products/FeatureCard';
import { UseCaseCard } from '../../components/Products/UseCaseCard';
import { GettingStartedSteps } from '../../components/Products/GettingStartedSteps';

// Types consistent with products.json
interface Feature { title: string; description: string; }
interface UseCase { title: string; description: string; }
interface Product {
  name: string;
  description: string;
  status?: string;
  keyFeatures?: Feature[];
  useCases?: UseCase[];
  gettingStarted?: string[];
  whyYouNeedIt?: string;
  howItIncreasesProductivity?: string;
  howToUseIt?: string;
}

interface ProductsDoc { products: Product[] }

const allProducts = (productsData as ProductsDoc).products || [];

export default function ProductPage({ initialSlug }: { initialSlug?: string }) {
  const params = useParams();
  const slug = initialSlug || params.slug || '';

  const product = React.useMemo(() => {
    return allProducts.find(p => toSlug(p.name) === slug);
  }, [slug]);

  if (!product) {
    return (
      <div className="pt-20 pb-24 max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product not found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">We couldn't find a product for “{slug}”.</p>
        <Link to="/products" className="text-blue-600 dark:text-blue-400 font-medium">Browse all products</Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <ProductHero name={product.name} description={product.description} status={product.status} />

      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Optional Sections */}
            {product.whyYouNeedIt && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Why You Need It</h3>
                <p className="text-gray-700 dark:text-gray-300">{product.whyYouNeedIt}</p>
              </div>
            )}
            {product.howItIncreasesProductivity && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">How It Increases Productivity</h3>
                <p className="text-gray-700 dark:text-gray-300">{product.howItIncreasesProductivity}</p>
              </div>
            )}
            {product.howToUseIt && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">How To Use It</h3>
                <p className="text-gray-700 dark:text-gray-300">{product.howToUseIt}</p>
              </div>
            )}

            {/* Key Features */}
            {product.keyFeatures && product.keyFeatures.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.keyFeatures.map((f, idx) => (
                    <FeatureCard key={idx} title={f.title} description={f.description} />
                  ))}
                </div>
              </section>
            )}

            {/* Use Cases */}
            {product.useCases && product.useCases.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Use Cases</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.useCases.map((u, idx) => (
                    <UseCaseCard key={idx} title={u.title} description={u.description} />
                  ))}
                </div>
              </section>
            )}

            {/* Getting Started */}
            {product.gettingStarted && product.gettingStarted.length > 0 && (
              <GettingStartedSteps title={`Getting Started with ${product.name}`} steps={product.gettingStarted} />
            )}
          </div>

          {/* Right sidebar: quick info */}
          <aside className="space-y-4">
            <div className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">At a Glance</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                <li>Name: {product.name}</li>
                {product.status && <li>Status: {product.status}</li>}
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Links</h4>
              <div className="flex flex-col gap-2">
                <Link to="/products" className="text-blue-600 dark:text-blue-400 text-sm">All Products</Link>
                <Link to={`/` + toSlug(product.name)} className="text-blue-600 dark:text-blue-400 text-sm">Open Direct Link</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

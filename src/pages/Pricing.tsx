import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ChevronDown } from 'lucide-react';
import PricingData from '../data/pricing.json';

// PricingModern.tsx

type Plan = any;

const Pricing = () => {
  const [data, setData] = useState<any | null>(null);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [showExit, setShowExit] = useState(false);

  useEffect(() => {
    setData(PricingData);
  }, []);

  useEffect(() => {
    if (data && !activeGroup) {
      const firstKey = Object.keys(data.pricing || {})[0];
      setActiveGroup(firstKey || null);
    }
  }, [data, activeGroup]);

  // Exit-intent listener (desktop only), once per session via localStorage
  useEffect(() => {
    const seen = typeof window !== 'undefined' && localStorage.getItem('exit_pricing_seen') === '1';
    if (seen) return;
    const handler = (e: MouseEvent) => {
      if ((e.clientY || 0) <= 0 && window.innerWidth >= 768) {
        setShowExit(true);
        localStorage.setItem('exit_pricing_seen', '1');
      }
    };
    window.addEventListener('mouseout', handler);
    return () => window.removeEventListener('mouseout', handler);
  }, []);

  if (!data) return <div className="py-12 text-center">Loading plans...</div>;

  const groups = Object.entries(data.pricing || {});

  const formatINR = (val: number | string | null | undefined) => {
    if (val === undefined || val === null) return '-';
    if (typeof val === 'string') return val;
    if (val === 0) return 'Free';
    try {
      return `₹${Number(val).toLocaleString('en-IN')}`;
    } catch (e) {
      return String(val);
    }
  };

  const isNumeric = (v: any) => typeof v === 'number' && Number.isFinite(v);

  const getPriceValue = (plan: Plan, billingMode: 'monthly' | 'yearly') => {
    const p = plan.price || {};
    const monthly = p.monthly;
    const yearly = p.yearly;

    if (billingMode === 'monthly') {
      if (isNumeric(monthly)) return monthly;
      return monthly ?? yearly ?? null;
    }

    if (isNumeric(yearly)) return yearly;
    if (isNumeric(monthly)) {
      const computed = Math.round(monthly * 12 * (1 - 0.15));
      return computed;
    }
    return yearly ?? monthly ?? null;
  };

  const computeSavings = (plan: Plan) => {
    const p = plan.price || {};
    const monthly = p.monthly;
    const yearly = p.yearly;

    if (isNumeric(monthly) && isNumeric(yearly)) {
      const rawAnnual = monthly * 12;
      const saving = rawAnnual - yearly;
      return saving > 0 ? saving : 0;
    }

    if (isNumeric(monthly) && !isNumeric(yearly)) {
      const computedYearly = Math.round(monthly * 12 * (1 - 0.15));
      const saving = monthly * 12 - computedYearly;
      return saving > 0 ? saving : 0;
    }

    return 0;
  };

  return (
    <div className="pt-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Pricing Plans</h1>
          <p className="mt-2 text-sm text-slate-500">
            Switch between product categories using the tabs below.
          </p>
        </div>

        {/* Sticky Controls: Billing Toggle + Tabs */}
        <div className="sticky top-16 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-center gap-3 py-3">
          <span className={`text-sm ${billing === 'monthly' ? 'font-semibold' : 'text-slate-500'}`}>Monthly</span>
          <button
            aria-label="Toggle billing"
            onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex items-center h-7 w-14 rounded-full p-1 bg-slate-200"
          >
            <motion.span
              layout
              transition={{type: "spring", stiffness: 500, damping: 30}}
              className={`bg-white w-6 h-6 rounded-full shadow-sm flex items-center justify-center`}
              style={{ boxShadow: '0 4px 10px rgba(2,6,23,0.08)' }}
              animate={{
                x:billing === 'monthly' ? 0 : 24,
              }}
            />
          </button>
          <span className={`text-sm ${billing === 'yearly' ? 'font-semibold' : 'text-slate-500'}`}>Yearly</span>
        </div>

        {/* Tabs */}
        <div className="pb-3">
          {/* Desktop horizontal tabs */}
          <div className="hidden sm:flex items-center gap-4 overflow-auto" role="tablist" aria-label="Product categories">
            {groups.map(([key, val]: any) => {
              const active = key === activeGroup;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setActiveGroup(key)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                      const idx = groups.findIndex((g) => g[0] === key);
                      const prev = groups[Math.max(0, idx - 1)][0];
                      setActiveGroup(prev);
                    }
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                      const idx = groups.findIndex((g) => g[0] === key);
                      const next = groups[Math.min(groups.length - 1, idx + 1)][0];
                      setActiveGroup(next);
                    }
                  }}
                  className={`relative px-4 py-2 rounded-full focus:outline-none transition-all duration-200 text-sm ${active ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500 dark:text-white' : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-300'}`}
                >
                  {val.title || key.replace(/_/g, ' ')}
                  {val.plans?.some((p: any) => p.popular) && (
                    <span className="ml-2 inline-block text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full dark:bg-amber-900/50 dark:text-amber-300">Popular</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile select fallback */}
          <div className="sm:hidden">
            <label htmlFor="group-select" className="sr-only">Choose category</label>
            <div className="relative">
              <select
                id="group-select"
                className="w-full rounded-lg border py-3 pl-4 pr-10 text-sm"
                value={activeGroup ?? ''}
                onChange={(e) => setActiveGroup(e.target.value)}
              >
                {groups.map(([key, val]: any) => (
                  <option key={key} value={key}>{val.title || key.replace(/_/g, ' ')}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>

        {/* Active group content */}
        {activeGroup && (() => {
          const groupValue = (data.pricing || {})[activeGroup];
          return (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold capitalize">{groupValue.title || activeGroup.replace(/_/g, ' ')}</h2>
                {groupValue.description && <p className="text-sm text-slate-500">{groupValue.description}</p>}
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {groupValue.plans.map((plan: Plan) => {
                  const priceVal = getPriceValue(plan, billing);
                  const savings = computeSavings(plan);
                  const isContact = !isNumeric(priceVal) && priceVal !== 0; // strings like 'Custom' or null
                  const priceDisplay = isContact ? 'Contact Us' : (priceVal === 0 ? 'Free' : formatINR(priceVal));
                  const isFree = (isNumeric(priceVal) && priceVal === 0) || priceVal === 0 || (typeof priceVal === 'string' && /free/i.test(priceVal));

                  return (
                    <motion.div
                      key={plan.name}
                      whileHover={{ scale: 1.02 }}
                      className={`relative rounded-2xl border p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between ${plan.popular ? 'ring-2 ring-amber-400' : ''}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 right-4 inline-flex items-center gap-2 bg-amber-500 text-white px-3 py-1.5 text-xs rounded-full">
                          <Star size={14} />
                          Popular
                        </div>
                      )}

                      <div>
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-lg font-semibold">{plan.name}</h3>
                          <span className="text-xs text-slate-500">{plan.billing_cycle ?? ''}</span>
                        </div>

                        <div className="mt-4 flex items-end gap-3">
                          <div>
                            <div className="text-3xl sm:text-4xl font-extrabold leading-none">{priceDisplay}</div>
                            {!isContact && (
                              <div className="text-sm text-slate-500">/ {billing === 'monthly' ? 'month' : 'year'}</div>
                            )}
                          </div>

                          {savings > 0 && (
                            <div className="ml-auto text-sm text-emerald-600 font-medium">Save {formatINR(savings)}</div>
                          )}
                        </div>

                        <div className="mt-4 text-sm text-slate-600">{plan.ideal_for}</div>

                        <hr className="my-4" />

                        <ul className="space-y-2 text-sm">
                          {Array.isArray(plan.features) && plan.features.map((f: string, i: number) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="mt-0.5"><Check size={16} /></span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 text-sm text-slate-700">
                          <strong>Limitations</strong>
                          <ul className="mt-2 space-y-1 text-sm text-slate-600">
                            {plan.limitations && Object.entries(plan.limitations).map(([k, v]: any) => (
                              <li key={k} className="flex items-center gap-2">
                                <span className="text-slate-400 text-xs capitalize w-36">{k.replace(/_/g, ' ')}:</span>
                                <span className="font-medium">{v}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6">
                        {isContact ? (
                          <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg py-3 px-4 border border-slate-300 font-semibold" onClick={() => alert('Contact sales for pricing')}>
                            Contact Sales
                          </button>
                        ) : (
                          <button
                            className={`w-full inline-flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-semibold shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isFree ? 'bg-emerald-600 text-white focus:ring-emerald-300 dark:bg-emerald-500' : 'bg-slate-900 text-white focus:ring-slate-300 dark:bg-slate-700 dark:focus:ring-slate-400'} font-semibold shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300`}
                            onClick={() => alert(`Selected ${plan.name} (${billing}) - ${isNumeric(priceVal) ? formatINR(priceVal) : String(priceVal)}`)}
                          >
                            {isFree ? 'Get Started' : 'Choose plan'}
                          </button>
                        )}

                        <div className="mt-3 text-xs text-slate-500 text-center">No credit card required</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })()}

        <div className="mt-8 text-center text-sm text-slate-500">Need a custom plan or enterprise pricing? Contact our sales team.</div>
      </div>

      {/* Exit-intent modal */}
      {showExit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Get a personalized demo"
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowExit(false)} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 mx-4"
          >
            <button onClick={() => setShowExit(false)} aria-label="Close" className="absolute top-3 right-3 text-slate-500 hover:text-slate-700">✕</button>
            <h3 className="text-xl font-bold mb-2">Want a personalized demo?</h3>
            <p className="text-slate-600 mb-6">See how CallFairy fits your needs. Our team can walk you through features and pricing.</p>
            <a href="/demo" className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-4 py-3 w-full font-semibold hover:opacity-95">Get Demo</a>
            <button onClick={() => setShowExit(false)} className="mt-3 w-full text-sm text-slate-500 hover:text-slate-700">No thanks</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Pricing;

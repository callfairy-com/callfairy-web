import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Users, Clock, Check } from 'lucide-react';
import Button from '../components/UI/Button';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import Helmet from '../components/SEO/Helmet';
import productsData from '../data/products.json';

interface CalculatorInputs {
  monthlyTickets: number;
  avgResolutionTime: number;
  agentHourlyRate: number;
  customerAcquisitionCost: number;
  monthlyChurn: number;
}

const ROICalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyTickets: 1000,
    avgResolutionTime: 15,
    agentHourlyRate: 25,
    customerAcquisitionCost: 200,
    monthlyChurn: 50
  });

  const [results, setResults] = useState({
    monthlySavings: 0,
    annualSavings: 0,
    roiPercentage: 0,
    paybackMonths: 0,
    efficiencyGain: 0
  });

  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const calculateROI = () => {
    const {
      monthlyTickets,
      avgResolutionTime,
      agentHourlyRate,
      customerAcquisitionCost,
      monthlyChurn
    } = inputs;

    // Calculate current costs
    const currentMonthlyCost = (monthlyTickets * avgResolutionTime / 60) * agentHourlyRate;
    const churnCost = monthlyChurn * customerAcquisitionCost;
    
    // Calculate savings with CallFairy (assuming 60% efficiency improvement, 40% churn reduction)
    const efficiencyImprovement = 0.6;
    const churnReduction = 0.4;
    
    const newMonthlyCost = currentMonthlyCost * (1 - efficiencyImprovement);
    const reducedChurnCost = churnCost * (1 - churnReduction);
    
    const monthlySavings = (currentMonthlyCost - newMonthlyCost) + (churnCost - reducedChurnCost);
    
    // Assuming CallFairy costs ₹2,999/month (representative plan)
    const monthlyCallFairyCost = 2999;
    const netMonthlySavings = monthlySavings - monthlyCallFairyCost;
    const netAnnualSavings = netMonthlySavings * 12;
    
    const roiBase = monthlyCallFairyCost * 12;
    const roiPercentage = roiBase > 0 ? ((netAnnualSavings / roiBase) * 100) : 0;
    const monthlyNet = (monthlySavings - monthlyCallFairyCost);
    const paybackMonths = monthlyNet > 0 ? (monthlyCallFairyCost / monthlyNet) : Infinity;
    
    setResults({
      monthlySavings: Math.max(0, netMonthlySavings),
      annualSavings: Math.max(0, netAnnualSavings),
      roiPercentage: Math.max(0, roiPercentage),
      paybackMonths: Math.max(0, paybackMonths),
      efficiencyGain: efficiencyImprovement * 100
    });
  };

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <Helmet
        title="ROI Calculator • CallFairy"
        description="Estimate your savings and ROI with CallFairy's AI automation. Explore product impact on productivity and revenue."
      />
      <div className="pt-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: 'Resources', to: '/resources' },
          { label: 'ROI Calculator' }
        ]} />
      </div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Calculator className="w-12 h-12 text-blue-600 mr-4" />
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                ROI Calculator
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Discover how much you can save with CallFairy's AI-powered customer service automation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Current Metrics</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Support Tickets
                  </label>
                  <input
                    type="number"
                    value={inputs.monthlyTickets}
                    onChange={(e) => handleInputChange('monthlyTickets', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Average Resolution Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={inputs.avgResolutionTime}
                    onChange={(e) => handleInputChange('avgResolutionTime', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Agent Hourly Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={inputs.agentHourlyRate}
                    onChange={(e) => handleInputChange('agentHourlyRate', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Customer Acquisition Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={inputs.customerAcquisitionCost}
                    onChange={(e) => handleInputChange('customerAcquisitionCost', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Customer Churn
                  </label>
                  <input
                    type="number"
                    value={inputs.monthlyChurn}
                    onChange={(e) => handleInputChange('monthlyChurn', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Key Metrics */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6">Your Potential Savings</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">
                      {formatCurrency(results.monthlySavings)}
                    </div>
                    <div className="text-blue-200 text-sm">Monthly Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">
                      {formatCurrency(results.annualSavings)}
                    </div>
                    <div className="text-blue-200 text-sm">Annual Savings</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      {results.roiPercentage.toFixed(0)}%
                    </div>
                    <div className="text-blue-200 text-sm">ROI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      {Number.isFinite(results.paybackMonths) ? results.paybackMonths.toFixed(1) : '—'}
                    </div>
                    <div className="text-blue-200 text-sm">Payback (Months)</div>
                  </div>
                </div>
              </div>

              {/* Benefits Breakdown */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">What You Get with CallFairy</h3>
                
                <div className="space-y-4">
                  {[
                    { icon: TrendingUp, title: '60% Faster Resolution', description: 'AI-powered routing and automation' },
                    { icon: DollarSign, title: '40% Cost Reduction', description: 'Reduced operational expenses' },
                    { icon: Users, title: '40% Less Churn', description: 'Improved customer satisfaction' },
                    { icon: Clock, title: '24/7 Availability', description: 'Round-the-clock support coverage' }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                        <benefit.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{benefit.title}</div>
                        <div className="text-gray-600 dark:text-gray-300 text-sm">{benefit.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-8 rounded-2xl text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Ready to Start Saving?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  See these results in action with a free 14-day trial.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" to="/signup">
                    Start Free Trial
                    <Check size={20} />
                  </Button>
                  <Button variant="outline" size="lg" to="/demo">
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products & Services Impact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Products & Services Impact</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-3xl">Explore how each CallFairy product can transform your operations with realistic, directional impact metrics.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(productsData as { products: { name: string; description: string; status?: string }[] }).products.map((p) => (
              <article key={p.name} className="p-6 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{p.name}</h3>
                  {p.status?.toLowerCase().includes('coming') && (
                    <span className="text-[10px] uppercase tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded">Coming soon</span>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{p.description}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Productivity uplift</div>
                    <div className="font-semibold text-gray-900 dark:text-white">+20–30%</div>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Revenue impact</div>
                    <div className="font-semibold text-gray-900 dark:text-white">+10–15%</div>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 col-span-2">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Transformation</div>
                    <div className="text-gray-700 dark:text-gray-300">Scale operations, reduce manual work, and improve margins with automation.</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Assumptions */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Calculation Assumptions</h3>
            <div className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
              <p>• Efficiency improvement: 60% reduction in average resolution time</p>
              <p>• Churn reduction: 40% decrease in monthly customer churn</p>
              <p>• Representative plan cost: ₹2,999/month</p>
              <p>• Results may vary based on implementation and specific use cases</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
};

export default ROICalculator;
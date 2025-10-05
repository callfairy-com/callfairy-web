import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Button from '../components/UI/Button';
import contactData from '../data/contact.json';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    const required = ['firstName','lastName','email','company','phone','subject','message'];
    required.forEach((k) => {
      if (!formData[k]?.trim()) next[k] = 'This field is required';
    });
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = 'Enter a valid email address';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');
    if (!validate()) {
      // focus first error field
      const firstKey = Object.keys(errors)[0] || 'firstName';
      const el = document.getElementById(firstKey);
      el?.focus();
      setSubmitStatus('error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitStatus('success');
      setFormData({});
      // move focus to success region
      setTimeout(() => {
        const s = document.getElementById('contact-success');
        s?.focus();
      }, 50);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { form, contactInfo } = contactData;

  return (
    <div className="pt-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {form.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {form.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 rounded-2xl h-full">
                <h2 className="text-2xl font-bold mb-8">{contactInfo.title}</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 mt-1" />
                    <div>
                      <div className="font-medium mb-1">Email</div>
                      <a href={`mailto:${contactInfo.email}`} className="text-blue-100 hover:text-white transition-colors">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 mt-1" />
                    <div>
                      <div className="font-medium mb-1">Phone</div>
                      <a href={`tel:${contactInfo.phone}`} className="text-blue-100 hover:text-white transition-colors">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 mt-1" />
                    <div>
                      <div className="font-medium mb-1">Address</div>
                      <div className="text-blue-100 whitespace-pre-line">
                        {contactInfo.address}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 mt-1" />
                    <div>
                      <div className="font-medium mb-1">Business Hours</div>
                      <div className="text-blue-100">
                        {contactInfo.hours}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
                {submitStatus === 'success' ? (
                  <div id="contact-success" tabIndex={-1} className="text-center py-12" aria-live="polite">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                    <Button onClick={() => setSubmitStatus('idle')}>Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" aria-describedby="contact-status" aria-live="polite" noValidate>
                    <div id="contact-status" className="sr-only" aria-live="polite">
                      {submitStatus === 'error' ? 'Please fix the errors in the form' : ''}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {form.fields.slice(0, 2).map((field) => (
                        <div key={field.name}>
                          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={handleInputChange}
                            aria-invalid={!!errors[field.name]}
                            aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400"
                          />
                          {errors[field.name] && (
                            <div id={`${field.name}-error`} role="alert" className="mt-1 text-sm text-red-600">{errors[field.name]}</div>
                          )}
                        </div>
                      ))}
                    </div>

                    {form.fields.slice(2, 5).map((field) => (
                      <div key={field.name}>
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          required={field.required}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          aria-invalid={!!errors[field.name]}
                          aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        {errors[field.name] && (
                          <div id={`${field.name}-error`} role="alert" className="mt-1 text-sm text-red-600">{errors[field.name]}</div>
                        )}
                      </div>
                    ))}

                    {/* Subject Select */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject || ''}
                        onChange={handleInputChange}
                        aria-invalid={!!errors.subject}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      >
                        <option value="">Select a subject</option>
                        {form.fields.find(f => f.name === 'subject')?.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {errors.subject && (
                        <div id="subject-error" role="alert" className="mt-1 text-sm text-red-600">{errors.subject}</div>
                      )}
                    </div>

                    {/* Message Textarea */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        placeholder="Tell us how we can help you..."
                        value={formData.message || ''}
                        onChange={handleInputChange}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      {errors.message && (
                        <div id="message-error" role="alert" className="mt-1 text-sm text-red-600">{errors.message}</div>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      fullWidth
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : form.submitText}
                      <Send className="ml-3 h-5 w-5" />
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

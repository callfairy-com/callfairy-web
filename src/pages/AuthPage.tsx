import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Sparkles, Zap, Lock, User } from "lucide-react";
import Helmet from "../components/SEO/Helmet";

// Simple localStorage JSON helpers
const appendToStore = (key: string, value: any) => {
  try {
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push({ ...value, ts: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (_) {
    localStorage.setItem(key, JSON.stringify([{ ...value, ts: new Date().toISOString() }]));
  }
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  return (
    <>
      <Helmet
        title={`${isLogin ? "Login" : "Signup"} • CallFairy`}
        description="Access your CallFairy account or create a new one. Secure, fast, and optimized for all screens."
      />
      <div className="min-h-screen grid md:grid-cols-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {/* Left: Brand + Benefits */}
        <aside className="hidden md:flex flex-col justify-center gap-6 p-10 lg:p-16 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Experience the future of customer engagement
            </h1>
            <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">Run AI-powered conversations across channels and 5x your leads.</p>
          </div>
          <ul className="space-y-4">
            {[ 
              { icon: Sparkles, title: "AI Assistants", desc: "Deploy Fairybots with your brand voice" },
              { icon: Zap, title: "Fast Setup", desc: "Go live in minutes with guided onboarding" },
              { icon: ShieldCheck, title: "Enterprise Security", desc: "Best-in-class privacy and compliance" },
              { icon: Lock, title: "Granular Controls", desc: "Fine‑tune behavior, directives, and access" },
            ].map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="p-2 rounded-md bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300" aria-hidden>
                  <f.icon className="w-5 h-5" />
                </span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{f.title}</div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 dark:text-gray-400">Trusted by 70,000+ brands worldwide</p>
          <div>
            <button
              onClick={() => setIsLogin((v) => !v)}
              type="button"
              className="text-sm text-blue-700 dark:text-blue-400 hover:underline"
              aria-label={isLogin ? "Switch to Signup" : "Switch to Login"}
            >
              {isLogin ? "Don’t have an account? Create one" : "Already a member? Log in"}
            </button>
          </div>
        </aside>

        {/* Right: Card with Tabs */}
        <main className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-4 flex rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800">
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${isLogin ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-gray-300"}`}
                onClick={() => setIsLogin(true)}
                type="button"
                aria-pressed={isLogin}
              >
                Log in
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${!isLogin ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-gray-300"}`}
                onClick={() => setIsLogin(false)}
                type="button"
                aria-pressed={!isLogin}
              >
                Sign up
              </button>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg p-6">
              <AnimatePresence mode="wait" initial={false}>
                {isLogin ? (
                  <motion.div key="login" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <LoginForm onSuccess={(payload) => appendToStore('auth_logins', payload)} />
                  </motion.div>
                ) : (
                  <motion.div key="signup" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <SignupForm onSuccess={(payload) => appendToStore('auth_users', payload)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function LoginForm({ onSuccess }: { onSuccess?: (payload: { email: string }) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validate = () => {
    const next: Record<string, string> = {};
    if (!email) next.loginEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.loginEmail = 'Enter a valid email';
    if (!password) next.loginPassword = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    if (!validate()) {
      const firstErrId = Object.keys(errors)[0] || (email ? 'loginPassword' : 'loginEmail');
      const el = document.getElementById(firstErrId);
      el?.focus();
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      onSuccess?.({ email });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate aria-describedby="login-status" aria-live="polite">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Log in to Your CallFairy Account</h2>
      <div id="login-status" className="sr-only" aria-live="polite">
        {status === 'error' ? 'Please fix the errors in the form' : status === 'success' ? 'Logged in successfully' : ''}
      </div>

      <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input
        id="loginEmail"
        type="email"
        placeholder="Enter your email"
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-invalid={!!errors.loginEmail}
        aria-describedby={errors.loginEmail ? 'loginEmail-error' : undefined}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.loginEmail && (
        <div id="loginEmail-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{errors.loginEmail}</div>
      )}

      <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
      <input
        id="loginPassword"
        type="password"
        placeholder="Enter your password"
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-invalid={!!errors.loginPassword}
        aria-describedby={errors.loginPassword ? 'loginPassword-error' : undefined}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.loginPassword && (
        <div id="loginPassword-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{errors.loginPassword}</div>
      )}

      <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
        <Lock className="w-4 h-4" /> Log In
      </button>
    </form>
  );
}

function SignupForm({ onSuccess }: { onSuccess?: (payload: { fullName: string; email: string; phone: string }) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validate = () => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Full name is required';
    if (!email) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';
    if (!phone) next.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(phone)) next.phone = 'Enter 10 digit phone';
    if (!password) next.password = 'Password is required';
    if (!confirmPassword) next.confirmPassword = 'Confirm your password';
    else if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    if (!validate()) {
      const first = ['fullName','email','phone','password','confirmPassword'].find((k) => (k in errors)) || 'fullName';
      document.getElementById(first)?.focus();
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      onSuccess?.({ fullName, email, phone });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate aria-describedby="signup-status" aria-live="polite">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Your CallFairy Account</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">Fill in the details below to get started with your FREE FOREVER plan.</p>

      <div id="signup-status" className="sr-only" aria-live="polite">
        {status === 'error' ? 'Please fix the errors in the form' : status === 'success' ? 'Account created successfully' : ''}
      </div>

      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
      <input
        id="fullName"
        type="text"
        placeholder="Enter your full name"
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-invalid={!!errors.fullName}
        aria-describedby={errors.fullName ? 'fullName-error' : undefined}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      {errors.fullName && <div id="fullName-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{errors.fullName}</div>}

      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? 'email-error' : undefined}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <div id="email-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{errors.email}</div>}

      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">🇮🇳 India +91</label>
      <input
        id="phone"
        type="tel"
        placeholder="Personal WhatsApp Number"
        required
        pattern="[0-9]{10}"
        maxLength={10}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-invalid={!!errors.phone}
        aria-describedby={errors.phone ? 'phone-error' : undefined}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {errors.phone && <div id="phone-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{errors.phone}</div>}

      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter Password</label>
      <input
        id="password"
        type="password"
        placeholder="Enter your password"
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-invalid={!!errors.password}
        aria-describedby={errors.password ? 'password-error' : undefined}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && <div id="password-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{errors.password}</div>}

      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
      <input
        id="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-invalid={!!errors.confirmPassword}
        aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {errors.confirmPassword && <div id="confirmPassword-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</div>}

      <p className="text-xs text-gray-600 dark:text-gray-400">The Google Privacy Policy and Terms of Service apply.</p>

      <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
        <User className="w-4 h-4" /> Create Account
      </button>
    </form>
  );
}

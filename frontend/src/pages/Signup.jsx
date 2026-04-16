import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

// The Official Google G Logo SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
    <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8766 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7253 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
    <path d="M11.0051 28.6006C9.9996 25.6199 9.9996 22.3633 11.0051 19.3827V13.2008H3.02419C-0.954281 21.1051 -0.954281 30.8782 3.02419 38.7825L11.0051 28.6006Z" fill="#FBBC04"/>
    <path d="M24.48 9.49932C27.9016 9.442 31.2086 10.7339 33.6863 13.0973L40.5387 6.24494C36.2058 2.18703 30.4061 -0.0689237 24.48 0.00161733C15.4056 0.00161733 7.10718 5.11644 3.03296 13.2008L11.0139 19.3827C12.9096 13.7035 18.2275 9.49932 24.48 9.49932Z" fill="#EA4335"/>
  </svg>
);

export default function Signup() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  
  const { signup, loginWithGoogle, error } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleSubmitting(true);
      const success = await loginWithGoogle(tokenResponse.access_token);
      if (success) {
        navigate('/onboarding');
      }
      setIsGoogleSubmitting(false);
    },
    onError: (errorResponse) => {
      console.error(errorResponse);
      setIsGoogleSubmitting(false);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await signup(name, username, email, password);
    if (success) {
      navigate('/onboarding');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Dot Pattern specific to Signup */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-[radial-gradient(#111827_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <div className="w-full max-w-[420px] z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2 font-cal tracking-tight">Cal.com</h1>
          <p className="text-[#6B7280] text-[15px]">Create your account to get started.</p>
        </div>

        {/* Card Section */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_24px_rgba(0,0,0,0.04)] border border-[#E5E7EB] overflow-hidden p-8 sm:p-10">
          
          {/* SSO Buttons */}
          <div className="space-y-3 mb-6">
            <button 
              type="button"
              onClick={() => handleGoogleSignup()}
              disabled={isGoogleSubmitting}
              className="w-full relative flex items-center justify-center px-4 py-2.5 border border-[#E5E7EB] bg-white text-[#111827] rounded-xl text-sm font-semibold hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all disabled:opacity-70"
            >
              {isGoogleSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><GoogleIcon /> Sign up with Google</>}
            </button>
            <button 
              type="button"
              className="w-full relative flex items-center justify-center px-4 py-2.5 border border-[#E5E7EB] bg-white text-[#111827] rounded-xl text-sm font-semibold hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all"
            >
              Sign up with SAML SSO
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#9CA3AF] uppercase font-semibold tracking-wider">Or</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 mb-6 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827] transition-all placeholder:text-[#9CA3AF]"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">Username</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-[#9CA3AF] text-sm">cal.com/</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full pl-[72px] pr-3 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827] transition-all placeholder:text-[#9CA3AF]"
                  placeholder="john"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827] transition-all placeholder:text-[#9CA3AF]"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827] transition-all placeholder:text-[#9CA3AF]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[#6B7280] text-xs mt-1.5">Must be at least 8 characters.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-[#111827] rounded-xl shadow-sm text-sm font-semibold text-white bg-[#111827] hover:bg-[#1F2937] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111827] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[13px] text-[#6B7280]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#111827] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Lock, User, Mail, ArrowRight, Activity, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface LoginProps {
  onLogin: (role: string, token: string) => void;
}

interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cin: '',
    age: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (parseInt(formData.age) < 18) {
        setError('You must be at least 18 years old');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      const endpoint = isLogin ? 'http://localhost:8080/api/auth/login' : 'http://localhost:8080/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            name: formData.name, 
            email: formData.email, 
            cin: formData.cin, 
            age: parseInt(formData.age), 
            password: formData.password 
          };

      const response = await axios.post(endpoint, payload);
      const token = response.data.token;
      
      if (token) {
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Decode JWT to extract role
        const decoded = jwtDecode<JwtPayload>(token);
        const role = decoded.role || 'USER'; // Default to USER if missing
        
        // Pass to parent
        onLogin(role, token);
      } else {
        setError('Authentication failed. No token received.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] relative overflow-hidden font-sans selection:bg-[#064e3b] selection:text-white">
      {/* Insane Animated Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-gradient-to-br from-[#064e3b]/30 to-emerald-400/10 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite_alternate]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-gradient-to-tl from-emerald-600/20 to-teal-300/10 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite_alternate-reverse]"></div>
      
      {/* Floating subtle elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/40 rounded-3xl blur-xl rotate-45 animate-[bounce_10s_infinite]"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-[#064e3b]/20 rounded-full blur-xl animate-[bounce_8s_infinite_1s]"></div>

      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(6,78,59,0.1)] transition-all duration-500 hover:shadow-[0_30px_70px_-15px_rgba(6,78,59,0.15)]">
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#064e3b] to-emerald-600 text-white shadow-xl shadow-emerald-900/20 mb-6 transform hover:scale-105 transition-transform duration-300">
            {isLogin ? <ShieldCheck className="w-10 h-10" /> : <Activity className="w-10 h-10" />}
            <div className="absolute inset-0 bg-white/20 rounded-3xl animate-ping opacity-20"></div>
          </div>
          <h1 className="text-4xl font-black text-[#0f172a] mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#0f172a] to-[#064e3b]">
            Jama3a Nouirat
          </h1>
          <p className="text-gray-500 font-medium">
            {isLogin ? 'Connexion au Portail Digital' : 'Inscription aux services citoyens'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-[pulse_0.5s_ease-in-out]">
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="animate-fade-in-up" style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Nom Complet</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#064e3b] transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064e3b] focus:border-transparent focus:bg-white transition-all shadow-sm"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-5">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">CIN (ID)</label>
                  <input
                    type="text"
                    name="cin"
                    value={formData.cin}
                    onChange={handleChange}
                    className="block w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064e3b] focus:border-transparent focus:bg-white transition-all shadow-sm"
                    placeholder="AB123456"
                    required={!isLogin}
                  />
                </div>
                <div className="w-28">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Âge</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    className="block w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064e3b] focus:border-transparent focus:bg-white transition-all shadow-sm"
                    placeholder="25"
                    required={!isLogin}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
              Adresse Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#064e3b] transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064e3b] focus:border-transparent focus:bg-white transition-all shadow-sm"
                placeholder="citoyen@exemple.ma"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Mot de passe</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#064e3b] transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064e3b] focus:border-transparent focus:bg-white transition-all shadow-sm"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#064e3b] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="animate-fade-in-up" style={{ animation: 'fadeInUp 0.4s ease-out forwards' }}>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Confirmer Mot de passe</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CheckCircle2 className="h-5 w-5 text-gray-400 group-focus-within:text-[#064e3b] transition-colors" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064e3b] focus:border-transparent focus:bg-white transition-all shadow-sm"
                  placeholder="••••••••"
                  required={!isLogin}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#064e3b] transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-4 px-4 rounded-2xl shadow-[0_8px_20px_-6px_rgba(6,78,59,0.4)] text-base font-bold text-white bg-gradient-to-r from-[#064e3b] to-emerald-600 hover:from-[#043d2e] hover:to-[#064e3b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#064e3b] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group mt-8 transform hover:-translate-y-1"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Accéder au Portail' : 'Créer mon compte'}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-200/60 pt-6">
          <p className="text-gray-500 font-medium">
            {isLogin ? "Nouveau citoyen ? " : "Déjà inscrit ? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-[#064e3b] hover:text-emerald-500 font-bold hover:underline transition-all duration-300"
            >
              {isLogin ? 'Créer un compte' : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}


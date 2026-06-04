"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { User, UserRole } from '@/lib/db-schema';

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
  addLog: (action: string, status: 'SUCCESS' | 'DENIED' | 'INFO', msg: string) => void;
  dbUsers: User[];
}

export function LoginForm({ onLoginSuccess, addLog, dbUsers }: LoginFormProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent, customCredentials?: { email: string; pass: string }) => {
    if (e) e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);
    setLoading(true);

    const email = customCredentials ? customCredentials.email : loginEmail;
    const password = customCredentials ? customCredentials.pass : loginPassword;

    if (!email || !password) {
      setLoginError('Por favor complete todos los campos.');
      setLoading(false);
      addLog('Login Attempt', 'DENIED', 'Intento fallido: campos incompletos.');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 450));

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          clientUsers: dbUsers,
        }),
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`Respuesta inválida del servidor (Status ${response.status})`);
      }

      if (!response.ok) {
        setLoginError(data.error || `Error del servidor (${response.status})`);
        addLog('Login Controller Reject', 'DENIED', `Rechazado: ${data.error || 'Credenciales inválidas'}`);
        setLoading(false);
        return;
      }

      setLoginSuccess(`Acceso autorizado. ¡Bienvenido/a, ${data.user.nombres}!`);
      addLog('Login Controller Grant', 'SUCCESS', `Sesión iniciada correctamente para ${data.user.email} con rol [${data.user.role}]`);

      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 500);

    } catch (err: any) {
      const errMsg = err?.message || 'Error de red con el middleware de autenticación.';
      setLoginError(`No se pudo conectar con el servidor: ${errMsg}`);
      addLog('Login Controller Fail', 'DENIED', `Error de red: ${errMsg}`);
      setLoading(false);
    }
  };

  const handleFastLogin = (role: UserRole, email: string, isInactive = false) => {
    const password = isInactive
      ? 'inactivo123'
      : role === UserRole.DIRECTOR
        ? 'director123'
        : role === UserRole.ADMIN
          ? 'admin123'
          : 'teacher123';
    setLoginEmail(email);
    setLoginPassword(password);
    handleLogin(undefined, { email, pass: password });
  };

  return (
    <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl shadow-orange-900/5 relative overflow-hidden group">
      {/* Decors */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100 to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 group-hover:translate-x-1/4 transition-transform duration-1000"></div>

      <div className="relative z-10">
        <h2 className="text-3xl font-extrabold text-slate-800 font-display mb-2">Ingreso al Portal</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium">Inicie sesión para acceder al panel de control de TCI.</p>

        {loginError && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl text-rose-700 text-sm font-semibold animate-in slide-in-from-top-2 fade-in duration-300">
            {loginError}
          </div>
        )}

        {loginSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl text-emerald-700 text-sm font-semibold flex items-center justify-between animate-in slide-in-from-top-2 fade-in duration-300">
            {loginSuccess}
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                disabled={loading || loginSuccess !== null}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700 placeholder-slate-400 disabled:opacity-50"
                placeholder="usuario@tci.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Contraseña</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading || loginSuccess !== null}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700 placeholder-slate-400 disabled:opacity-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none disabled:opacity-50"
                disabled={loading || loginSuccess !== null}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || loginSuccess !== null}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#fc7609] to-orange-500 hover:to-orange-400 text-white rounded-xl font-bold font-display tracking-wide shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : loginSuccess ? (
              <span>Redirigiendo...</span>
            ) : (
              <>
                <span>Ingresar al Sistema</span>
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

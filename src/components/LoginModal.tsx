import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound, AlertCircle, ArrowRight, RefreshCw, ShieldAlert, Users } from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: (role: 'admin' | 'staff') => void;
  adminPassword: string;
  staffPassword: string;
  onResetToDefaultPassword?: () => void;
}

const MASTER_ADMIN_KEY = 'ADMIN888'; // Secret master key for the owner

export const LoginModal: React.FC<LoginModalProps> = ({
  onLoginSuccess,
  adminPassword,
  staffPassword,
  onResetToDefaultPassword,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputClean = passwordInput.trim();
    if (inputClean === adminPassword || inputClean === MASTER_ADMIN_KEY) {
      setErrorMsg('');
      if (rememberMe) {
        localStorage.setItem('dashboard_authenticated', 'true');
        localStorage.setItem('dashboard_user_role', 'admin');
      } else {
        sessionStorage.setItem('dashboard_authenticated', 'true');
        sessionStorage.setItem('dashboard_user_role', 'admin');
      }
      onLoginSuccess('admin');
    } else if (inputClean === staffPassword) {
      setErrorMsg('');
      if (rememberMe) {
        localStorage.setItem('dashboard_authenticated', 'true');
        localStorage.setItem('dashboard_user_role', 'staff');
      } else {
        sessionStorage.setItem('dashboard_authenticated', 'true');
        sessionStorage.setItem('dashboard_user_role', 'staff');
      }
      onLoginSuccess('staff');
    } else {
      setErrorMsg('Mật khẩu không chính xác! Vui lòng kiểm tra lại.');
    }
  };

  const handleAdminReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterKeyInput.trim() === MASTER_ADMIN_KEY) {
      setRecoveryError('');
      setRecoverySuccess('Đã xác thực Quản trị viên! Đang khôi phục mật khẩu gốc...');
      if (onResetToDefaultPassword) {
        onResetToDefaultPassword();
      }
      setTimeout(() => {
        localStorage.setItem('dashboard_authenticated', 'true');
        localStorage.setItem('dashboard_user_role', 'admin');
        onLoginSuccess('admin');
      }, 1000);
    } else {
      setRecoveryError('Mật Khẩu Chủ (Master Key) không đúng!');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative">
        {/* Decorative Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Header Icon & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-8 ring-blue-500/10">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Yêu Cầu Mật Khẩu
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Nhập mật khẩu để truy cập
            </p>
          </div>
        </div>

        {!showRecoveryModal ? (
          /* Main Login Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Mật khẩu đăng nhập</span>
                <span className="text-[11px] text-slate-500">Admin / Nhân viên</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Nhập mật khẩu Admin hoặc Staff..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <button
                type="button"
                onClick={() => setShowRecoveryModal(true)}
                className="text-slate-400 hover:text-blue-400 font-medium transition-colors"
              >
                Khôi phục Admin?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span>Đăng Nhập Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Admin Recovery Form */
          <form onSubmit={handleAdminReset} className="space-y-4 animate-fadeIn">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                <ShieldAlert className="w-4 h-4" />
                <span>Khôi Phục Dành Cho Quản Trị Viên (Admin)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Nhập Mật Khẩu Chủ (Master Key) để mở khóa và đặt lại mật khẩu mặc định.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Mật Khẩu Chủ (Master Key)
              </label>
              <input
                type="password"
                value={masterKeyInput}
                onChange={(e) => {
                  setMasterKeyInput(e.target.value);
                  setRecoveryError('');
                }}
                placeholder="Nhập Master Key Admin..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
                autoFocus
              />
            </div>

            {recoveryError && (
              <div className="flex items-center gap-2 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{recoveryError}</span>
              </div>
            )}

            {recoverySuccess && (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{recoverySuccess}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowRecoveryModal(false);
                  setRecoveryError('');
                }}
                className="w-1/3 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Khôi Phục Mật Khẩu</span>
              </button>
            </div>
          </form>
        )}

        {/* Protected Footer Notice */}
        <div className="pt-3 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Administrator & User</span>
          </p>
        </div>
      </div>
    </div>
  );
};


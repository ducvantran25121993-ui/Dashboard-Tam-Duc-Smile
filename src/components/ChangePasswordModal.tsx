import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, AlertCircle, CheckCircle2, X, ShieldCheck, Users } from 'lucide-react';

interface ChangePasswordModalProps {
  adminPassword: string;
  staffPassword: string;
  onSaveAdminPassword: (newPassword: string) => void;
  onSaveStaffPassword: (newPassword: string) => void;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  adminPassword,
  staffPassword,
  onSaveAdminPassword,
  onSaveStaffPassword,
  onClose,
}) => {
  const [targetRole, setTargetRole] = useState<'admin' | 'staff'>('admin');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const currentExpectedPass = targetRole === 'admin' ? adminPassword : staffPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const oldClean = oldPassword.trim();
    if (oldClean !== currentExpectedPass && oldClean !== adminPassword) {
      setErrorMsg(
        targetRole === 'admin'
          ? 'Mật khẩu Quản trị hiện tại không đúng!'
          : 'Xác thực mật khẩu Quản trị không đúng!'
      );
      return;
    }
    if (!newPassword || newPassword.length < 3) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 3 ký tự!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Xác nhận mật khẩu mới không khớp!');
      return;
    }

    if (targetRole === 'admin') {
      onSaveAdminPassword(newPassword);
      setSuccessMsg('Đã cập nhật Mật khẩu Quản trị thành công!');
    } else {
      onSaveStaffPassword(newPassword);
      setSuccessMsg('Đã cập nhật Mật khẩu Nhân viên thành công!');
    }

    setErrorMsg('');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Quản Lý Mật Khẩu Truy Cập</h3>
            <p className="text-xs text-slate-400">Thay đổi mật khẩu Quản trị viên hoặc Mật khẩu Nhân viên</p>
          </div>
        </div>

        {/* Target Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setTargetRole('admin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              targetRole === 'admin'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Mật Khẩu Admin</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTargetRole('staff');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              targetRole === 'staff'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Mật Khẩu Nhân Viên</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {targetRole === 'admin' ? 'Mật khẩu Admin hiện tại' : 'Xác nhận bằng mật khẩu Admin'}
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setErrorMsg('');
              }}
              placeholder={targetRole === 'admin' ? 'Nhập mật khẩu Admin hiện tại...' : 'Nhập mật khẩu Admin của bạn...'}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {targetRole === 'admin' ? 'Mật khẩu Admin mới' : 'Mật khẩu Nhân viên mới'}
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrorMsg('');
              }}
              placeholder={targetRole === 'admin' ? 'Nhập mật khẩu Admin mới...' : 'Nhập mật khẩu Nhân viên mới...'}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Xác nhận mật khẩu mới</label>
            <input
              type={showPass ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Nhập lại mật khẩu mới..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
            >
              {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-purple-600/30"
            >
              Lưu Mật Khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

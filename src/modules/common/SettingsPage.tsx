import React, { useState } from "react";
import {
  Bell, Camera, Check, ChevronRight, LogOut, Moon,
  Pencil, Phone, Shield, Sun, User, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../layouts/Header";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";

// ─── Toggle Row ───────────────────────────────────────────────────────────────

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon: React.ReactNode;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, description, checked, onChange, icon }) => (
  <div className="flex items-center justify-between gap-4 py-4">
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gray-400 dark:text-slate-500">{icon}</span>
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{label}</p>
        <p className="text-xs text-gray-400 dark:text-slate-500">{description}</p>
      </div>
    </div>
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
        checked ? "bg-indigo-600 dark:bg-indigo-500" : "bg-gray-200 dark:bg-slate-600"
      }`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  </div>
);

// ─── Edit Profile Modal ───────────────────────────────────────────────────────

interface EditProfileModalProps {
  initialName: string;
  initialPhone: string;
  onSave: (name: string, phone: string) => void;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ initialName, initialPhone, onSave, onClose }) => {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const validate = () => {
    const e: { name?: string; phone?: string } = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (phone.trim() && !/^[6-9]\d{9}$/.test(phone.trim())) e.phone = "Enter a valid 10-digit Indian mobile number.";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700)); // simulate API
    onSave(name.trim(), phone.trim());
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-slate-700">
          <h2 className="font-semibold text-gray-800 dark:text-slate-100">Edit Profile</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-500">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-2xl font-bold text-white shadow-lg">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-600 dark:border-slate-900">
              <Camera className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400 dark:text-slate-500">Tap camera icon to change photo</p>
        </div>

        {/* Form */}
        <div className="space-y-4 px-6 pb-6">
          {/* Name */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300">
              <User className="h-3.5 w-3.5" /> Full Name
            </label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
              placeholder="Your full name"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 ${
                errors.name ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-slate-700"
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300">
              <Phone className="h-3.5 w-3.5" /> Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400 dark:text-slate-500">+91</span>
              <input
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors((prev) => ({ ...prev, phone: undefined })); }}
                placeholder="9876543210"
                maxLength={10}
                className={`w-full rounded-xl border pl-12 pr-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 ${
                  errors.phone ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-slate-700"
                }`}
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          {/* Info note */}
          <p className="rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
            Your email and role are managed by the AnyFeast team and cannot be changed here.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-70 ${
                saved ? "bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              }`}
            >
              {saved ? <><Check className="h-4 w-4" /> Saved!</> : saving ? "Saving…" : <><Pencil className="h-4 w-4" /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Settings Page ────────────────────────────────────────────────────────────

export const SettingsPage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleSaveProfile = (name: string, phone: string) => {
    updateUser({ name, phone });
    toast.success("Profile updated successfully!");
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 3000);
  };

  const isTrainer = user?.role === "trainer";
  const initials = user?.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "?";

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-slate-950 min-h-full">
      <Header title="Settings" subtitle="Manage your account & preferences" />

      <div className="flex-1 p-6 max-w-xl">

        {/* Save flash */}
        {saveFlash && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
            <Check className="h-4 w-4 shrink-0" />
            Profile updated successfully!
          </div>
        )}

        {/* Profile card */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/80">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">Profile</h3>
          </div>
          <div className="flex items-center gap-4 px-5 py-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-2xl font-bold text-white shadow-md">
                {initials}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-indigo-500 dark:border-slate-800">
                <Pencil className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 dark:text-slate-100 text-base">{user?.name ?? "—"}</p>
              <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">{user?.phone ?? user?.email ?? "—"}</p>
              <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                isTrainer
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400"
                  : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"
              }`}>
                {user?.role ?? "—"}
              </span>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-slate-700 px-5 py-3">
            <button
              onClick={() => setEditOpen(true)}
              className="flex w-full items-center justify-between py-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              <span className="flex items-center gap-2"><Pencil className="h-4 w-4" />Edit Profile</span>
              <ChevronRight className="h-4 w-4 text-gray-300 dark:text-slate-600" />
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/80">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">Preferences</h3>
          </div>
          <div className="divide-y divide-gray-100 px-5 dark:divide-slate-700">
            <ToggleRow
              label="Push Notifications"
              description="Get alerts when coupons are assigned or expire"
              checked={notificationsEnabled}
              onChange={setNotificationsEnabled}
              icon={<Bell className="h-4 w-4" />}
            />
            <ToggleRow
              label="Dark Mode"
              description={theme === "dark" ? "Currently using dark theme" : "Currently using light theme"}
              checked={theme === "dark"}
              onChange={() => toggleTheme()}
              icon={theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            />
          </div>
        </section>

        {/* Account */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/80">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">Account</h3>
          </div>
          <div className="divide-y divide-gray-100 px-5 dark:divide-slate-700">
            <button className="flex w-full items-center justify-between py-3.5 text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
              <span className="flex items-center gap-2"><Shield className="h-4 w-4" />Privacy Policy</span>
              <ChevronRight className="h-4 w-4 text-gray-300 dark:text-slate-600" />
            </button>
            <button className="flex w-full items-center justify-between py-3.5 text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
              <span className="flex items-center gap-2"><Shield className="h-4 w-4" />Terms of Service</span>
              <ChevronRight className="h-4 w-4 text-gray-300 dark:text-slate-600" />
            </button>
          </div>
        </section>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-600 active:scale-[0.98] dark:bg-red-600 dark:hover:bg-red-700"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>

        <p className="mt-5 text-center text-xs text-gray-300 dark:text-slate-700">AnyFeast Gym Platform · v0.3.0</p>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <EditProfileModal
          initialName={user?.name ?? ""}
          initialPhone={user?.phone ?? ""}
          onSave={handleSaveProfile}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  );
};

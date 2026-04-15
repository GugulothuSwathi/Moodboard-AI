'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, MapPin, Globe, Twitter, Instagram,
  Camera, CheckCircle, AlertCircle, ArrowLeft,
  Loader2, Sparkles, AtSign, FileText, Link2
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    nickname: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    instagram: '',
    profileImage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('google');
      return;
    }
    if (status !== 'authenticated') return;

    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.user) {
          setForm({
            nickname:     data.user.nickname     || '',
            bio:          data.user.bio          || '',
            location:     data.user.location     || '',
            website:      data.user.website      || '',
            twitter:      data.user.twitter      || '',
            instagram:    data.user.instagram    || '',
            profileImage: data.user.profileImage || null,
          });
          setPreviewImage(data.user.profileImage || data.user.image || null);
        }
      } catch (err) {
        showToast('error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [status]);

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('error', 'Image must be under 2 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setPreviewImage(base64);
      setForm((f) => ({ ...f, profileImage: base64 }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      showToast('success', 'Profile saved successfully!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-purple-500" />
      </div>
    );
  }

  const displayName = session?.user?.name || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      {}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-purple-500/8 dark:bg-purple-500/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full bg-brand-400/8 dark:bg-brand-400/5 blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto">

        {}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Back to My Boards
        </Link>

        {}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-brand-400 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-500">
              MoodBoard AI
            </span>
          </div>
          <h1 className="text-3xl font-display font-semibold text-gray-900 dark:text-white">
            Edit Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Personalise how you appear across MoodBoard AI
          </p>
        </div>

        {}
        <form
          onSubmit={handleSave}
          className="glass-card p-8 space-y-8"
        >

          {}
          <div className="flex items-center gap-6">
            <div className="relative group flex-shrink-0">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Avatar"
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-purple-500/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-brand-400 flex items-center justify-center ring-4 ring-purple-500/20">
                  <span className="text-2xl font-bold text-white">{initials}</span>
                </div>
              )}
              {}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                aria-label="Change avatar"
              >
                <Camera size={22} className="text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Profile Photo</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recommended size: 400x400px. Max 2MB.</p>
            </div>
          </div>

          {}
          <div className="border-t border-gray-100 dark:border-gray-800" />

          {}
          <div className="space-y-5">
            <SectionLabel icon={<User size={14} />} label="Identity" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {}
              <Field
                label="Full Name"
                hint="Managed by Google — sign in to change"
                readOnly
              >
                <input
                  type="text"
                  value={displayName}
                  readOnly
                  className="field-input opacity-60 cursor-not-allowed"
                />
              </Field>

              {}
              <Field label="Nickname" hint="How you'd like to be called (max 40 chars)">
                <div className="relative">
                  <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="nickname"
                    type="text"
                    maxLength={40}
                    placeholder="e.g. creative_swathi"
                    value={form.nickname}
                    onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
                    className="field-input pl-8"
                  />
                </div>
              </Field>
            </div>

            {}
            <Field label="Bio" hint={`${form.bio.length}/300`}>
              <div className="relative">
                <FileText size={14} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  id="bio"
                  rows={3}
                  maxLength={300}
                  placeholder="Tell the world a little about yourself…"
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  className="field-input pl-8 resize-none"
                />
              </div>
            </Field>

            {}
            <Field label="Location" hint="City, Country">
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="location"
                  type="text"
                  maxLength={80}
                  placeholder="e.g. Hyderabad, India"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="field-input pl-8"
                />
              </div>
            </Field>
          </div>

          {}
          <div className="border-t border-gray-100 dark:border-gray-800" />

          {}
          <div className="space-y-5">
            <SectionLabel icon={<Globe size={14} />} label="Online Presence" />

            {}
            <Field label="Website">
              <div className="relative">
                <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="website"
                  type="url"
                  maxLength={200}
                  placeholder="https://yourwebsite.com"
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  className="field-input pl-8"
                />
              </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {}
              <Field label="Twitter / X">
                <div className="relative">
                  <Twitter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="twitter"
                    type="text"
                    maxLength={50}
                    placeholder="@username"
                    value={form.twitter}
                    onChange={(e) => setForm((f) => ({ ...f, twitter: e.target.value }))}
                    className="field-input pl-8"
                  />
                </div>
              </Field>

              {}
              <Field label="Instagram">
                <div className="relative">
                  <Instagram size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="instagram"
                    type="text"
                    maxLength={50}
                    placeholder="@username"
                    value={form.instagram}
                    onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
                    className="field-input pl-8"
                  />
                </div>
              </Field>
            </div>
          </div>

          {}
          <div className="pt-2 flex items-center justify-between">
            <Link href="/dashboard" className="btn-secondary text-sm py-2.5 px-5">
              Cancel
            </Link>
            <button
              id="save-profile-btn"
              type="submit"
              disabled={saving}
              className="btn-primary text-sm py-2.5 px-6"
            >
              {saving ? (
                <><Loader2 size={15} className="animate-spin" /> Saving…</>
              ) : (
                <><CheckCircle size={15} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>

      {}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl
            text-sm font-medium animate-fade-in transition-all
            ${toast.type === 'success'
              ? 'bg-emerald-500 text-white shadow-emerald-500/30'
              : 'bg-red-500 text-white shadow-red-500/30'
            }`}
        >
          {toast.type === 'success'
            ? <CheckCircle size={16} />
            : <AlertCircle size={16} />
          }
          {toast.message}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-purple-500 dark:text-purple-400">
      {icon}
      {label}
    </div>
  );
}

function Field({ label, hint, children, readOnly }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {hint && (
          <span className="text-xs text-gray-400 dark:text-gray-500">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Upload,
  CheckCircle,
  CheckCircle2,
  Trash2,
  Eye,
  Save,
  Plus,
  Shield,
  Heart,
  Star,
  ShieldCheck,
  Check,
  RotateCcw,
  ExternalLink,
  UserCheck,
  Mail,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import { BannerItem, BusinessSettings } from '@/src/types/index.ts';
import { normalizeBannerUrl, isValidBannerUrl } from '@/src/utils/bannerUtils.ts';

export const BannerManager: React.FC = () => {
  const {
    settings,
    updateBusinessSettings,
    addBanner,
    deleteBanner,
    setActiveBanner,
    loginAsRipanAdmin,
    currentUser,
    userProfile,
    setActivePage,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Banner text settings form state
  const [bannerForm, setBannerForm] = useState({
    bannerTitle: settings.bannerTitle || 'Makeup',
    bannerSubtitle: settings.bannerSubtitle || 'A R T I S T',
    bannerSlogan: settings.bannerSlogan || 'LOOK GOOD • FEEL CONFIDENT',
    bannerTagline: settings.bannerTagline || 'Your Beauty Our Passion ♡',
    bannerRightBadge: settings.bannerRightBadge || 'BEAUTY BEGINS WITH SELF LOVE',
    bannerRightQuote: settings.bannerRightQuote || 'Be Your Own Kind of Beautiful',
    bannerTrust1: settings.bannerTrust1 || 'Professional Service',
    bannerTrust2: settings.bannerTrust2 || '100% Hygiene',
    bannerTrust3: settings.bannerTrust3 || 'Natural & Long Lasting Look',
    bannerUrl: settings.bannerUrl || settings.artistPhoto || '/images/ankita_banner.jpg',
  });

  // Add new banner item form state
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImageUrl, setNewBannerImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSizeKb, setImageSizeKb] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Admin emails form state
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminStatusMessage, setAdminStatusMessage] = useState<string | null>(null);

  // Feedback states
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bannerErrorMessage, setBannerErrorMessage] = useState<string | null>(null);

  // Client-side automatic canvas image compression (scales high-res photos to fast, lightweight web format < 150KB)
  const compressBannerImage = (file: File): Promise<{ dataUrl: string; sizeKb: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 675; // Standard 16:9 banner aspect ratio
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            const rawBase64 = event.target?.result as string;
            resolve({ dataUrl: rawBase64, sizeKb: Math.round(rawBase64.length / 1024) });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // High-efficiency JPEG at 0.72 quality creates crystal clear banners (~60KB - 110KB)
          // that load instantly for all customers on 4G/mobile networks and fit smoothly into Firestore
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
          const sizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
          resolve({ dataUrl: compressedDataUrl, sizeKb });
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // File Upload handler with automatic compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে একটি ছবি ফাইল সিলেক্ট করুন (Please select an image file).');
      return;
    }

    try {
      setIsCompressing(true);
      setBannerErrorMessage(null);
      const { dataUrl, sizeKb } = await compressBannerImage(file);
      setNewBannerImageUrl(dataUrl);
      setImagePreview(dataUrl);
      setImageSizeKb(sizeKb);
    } catch (err) {
      console.error('Failed to compress image:', err);
      setBannerErrorMessage('ছবি লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsCompressing(false);
    }
  };

  // Add new banner to bannerList
  const handleAddNewBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawUrl = (newBannerImageUrl.trim() || imagePreview || '').trim();
    if (!rawUrl) {
      alert('দয়া করে ব্যানার এর ছবির ফাইল আপলোড করুন অথবা ছবির লিংক লিখুন।');
      return;
    }

    if (rawUrl.startsWith('blob:')) {
      alert('টেম্পোরারি blob: লিংক সেভ করা যাবে না। দয়া করে ডিভাইসের ছবি ফাইল আপলোড করুন অথবা একটি স্থায়ী ওয়েব লিংক দিন।');
      return;
    }

    const validUrl = normalizeBannerUrl(rawUrl);
    if (!validUrl) {
      alert('ছবির লিংকটি সঠিক নয় (Invalid Image URL)। দয়া করে সঠিক ইমেজ লিংক অথবা ছবি আপলোড করুন।');
      return;
    }

    try {
      setIsSaving(true);
      setBannerErrorMessage(null);

      const titleToSave = newBannerTitle.trim() || 'Signature Makeover';
      const subtitleToSave = newBannerSubtitle.trim() || 'Ankita Makeup Artist';

      await addBanner({
        title: titleToSave,
        subtitle: subtitleToSave,
        imageUrl: validUrl,
        active: true,
      });

      setBannerForm((prev) => ({
        ...prev,
        bannerUrl: validUrl,
      }));

      setNewBannerTitle('');
      setNewBannerSubtitle('');
      setNewBannerImageUrl('');
      setImagePreview(null);
      setImageSizeKb(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Error adding banner:', err);
      setBannerErrorMessage('ব্যানার সংরক্ষণ করতে ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  // Save banner typography & text settings
  const handleSaveBannerTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateBusinessSettings({
        bannerTitle: bannerForm.bannerTitle,
        bannerSubtitle: bannerForm.bannerSubtitle,
        bannerSlogan: bannerForm.bannerSlogan,
        bannerTagline: bannerForm.bannerTagline,
        bannerRightBadge: bannerForm.bannerRightBadge,
        bannerRightQuote: bannerForm.bannerRightQuote,
        bannerTrust1: bannerForm.bannerTrust1,
        bannerTrust2: bannerForm.bannerTrust2,
        bannerTrust3: bannerForm.bannerTrust3,
        bannerUrl: bannerForm.bannerUrl,
        artistPhoto: bannerForm.bannerUrl,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save banner settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add an authorized admin email
  const handleAddAdminEmail = async () => {
    const cleanEmail = newAdminEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAdminStatusMessage('Please enter a valid email address.');
      return;
    }

    const currentList = settings.authorizedAdminEmails || ['ripan321321@gmail.com'];
    if (currentList.some((e) => e.toLowerCase() === cleanEmail)) {
      setAdminStatusMessage('This email is already an authorized admin.');
      return;
    }

    const updatedList = [...currentList, cleanEmail];
    await updateBusinessSettings({
      authorizedAdminEmails: updatedList,
    });
    setNewAdminEmail('');
    setAdminStatusMessage(`Email "${cleanEmail}" added as authorized admin.`);
    setTimeout(() => setAdminStatusMessage(null), 4000);
  };

  // Remove an authorized admin email
  const handleRemoveAdminEmail = async (emailToRemove: string) => {
    if (emailToRemove.toLowerCase() === 'ripan321321@gmail.com') {
      alert('Master admin email ripan321321@gmail.com cannot be removed.');
      return;
    }

    const currentList = settings.authorizedAdminEmails || [];
    const updatedList = currentList.filter((e) => e.toLowerCase() !== emailToRemove.toLowerCase());
    await updateBusinessSettings({
      authorizedAdminEmails: updatedList,
    });
  };

  // Preset ready-to-use aesthetic bridal banners
  const presetBanners = [
    {
      title: 'Bengali Royal Bridal',
      subtitle: 'Chandan & Mukut Design',
      url: '/images/ankita_banner.jpg',
    },
    {
      title: 'Golden Reception Glow',
      subtitle: 'Waterproof HD Airbrush',
      url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=1200&auto=format&fit=crop&q=80',
    },
    {
      title: 'Cocktail & Party Elegance',
      subtitle: 'Smokey Eyes & Modern Glam',
      url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------- */}
      {/* 1. ADMIN AUTHORIZATION & EMAIL PERMISSIONS PANEL               */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-stone-900 via-[#3a1523] to-stone-900 text-white p-6 rounded-3xl shadow-xl border border-rose-900/40 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  Admin Authorization Panel
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                  Active
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                এডমিন প্যানেল ইমেইল অ্যাক্সেস (Admin Panel Email Access)
              </h2>
              <p className="text-xs text-rose-200">
                এই ইমেইল দিয়ে লগইন করলে স্বয়ংক্রিয়ভাবে এডমিন প্যানেল এক্সেস পাবেন
              </p>
            </div>
          </div>

          {/* Quick Login As Ripan Button */}
          <button
            onClick={loginAsRipanAdmin}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 cursor-pointer transition-transform hover:scale-105"
            title="Log in immediately as ripan321321@gmail.com"
          >
            <UserCheck className="w-4 h-4" />
            <span>Login as ripan321321@gmail.com</span>
          </button>
        </div>

        {/* Current Super Admin & Authorized Emails */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Super Admin Card */}
          <div className="bg-stone-950/60 p-4 rounded-2xl border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Primary Super Admin (মূল এডমিন)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-900/60 text-rose-200 text-[10px] font-mono">
                Permanent
              </span>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <Mail className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-sm font-semibold">ripan321321@gmail.com</span>
            </div>
            <p className="text-[11px] text-stone-400">
              User Status:{' '}
              {userProfile?.email === 'ripan321321@gmail.com' ? (
                <span className="text-emerald-400 font-semibold">
                  Currently Logged In as Super Admin ✓
                </span>
              ) : (
                <span className="text-stone-400">Authorized Master Email</span>
              )}
            </p>
          </div>

          {/* Add / List Authorized Emails */}
          <div className="bg-stone-950/60 p-4 rounded-2xl border border-rose-500/30 space-y-3">
            <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wider block">
              অতিরিক্ত এডমিন ইমেইল যুক্ত করুন (Add Admin Email)
            </span>
            <div className="flex space-x-2">
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="নতুন এডমিন ইমেইল লিখুন..."
                className="flex-1 px-3 py-2 bg-stone-900 border border-rose-800/40 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddAdminEmail}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Add Email
              </button>
            </div>
            {adminStatusMessage && (
              <p className="text-[11px] text-amber-300 flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>{adminStatusMessage}</span>
              </p>
            )}

            {/* List of active admin emails */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                অনুমোদিত এডমিন তালিকা:
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/30">
                  <CheckCircle className="w-3 h-3" />
                  <span>ripan321321@gmail.com</span>
                </span>
                {(settings.authorizedAdminEmails || [])
                  .filter((e) => e.toLowerCase() !== 'ripan321321@gmail.com')
                  .map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-stone-800 text-stone-200 text-xs font-mono border border-stone-700"
                    >
                      <span>{email}</span>
                      <button
                        onClick={() => handleRemoveAdminEmail(email)}
                        className="text-stone-400 hover:text-red-400 ml-1 cursor-pointer"
                        title="Remove admin"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. LIVE BANNER PREVIEW                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-[#8e512d]" />
            <h3 className="text-lg font-serif font-bold text-stone-900">
              লাইভ ব্যানার প্রিভিউ (Live Banner Preview)
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>সব কাস্টমারের জন্য লাইভ (Visible to all customers)</span>
            </span>
            <button
              onClick={() => setActivePage('home')}
              className="px-3 py-1 text-xs font-semibold bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <span>হোমপেজে দেখুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The Exact Full Poster Banner Displayed to All Customers */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-rose-200 shadow-lg bg-stone-950 aspect-[16/9] sm:aspect-[21/9] max-h-[380px] flex items-center justify-center group">
          <img
            src={settings.bannerUrl || '/images/hero_banner_full.jpg'}
            alt="Customer live banner"
            className="w-full h-full object-contain mx-auto"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[11px] font-bold border border-white/20 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>হোমপেজে গ্রাহকরা এই ব্যানারটি দেখছেন</span>
          </div>
        </div>

        {/* Scaled Mini Preview of the Banner */}
        <div className="rounded-2xl overflow-hidden border border-rose-200 bg-gradient-to-br from-[#fef5f7] via-[#fdebed] to-[#fcd9e2] p-4 sm:p-6 relative shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-2">
              <div className="flex items-center space-x-2">
                <span
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                  className="text-4xl sm:text-5xl text-[#7a1236]"
                >
                  {bannerForm.bannerTitle || 'Makeup'}
                </span>
                <span className="text-lg sm:text-xl font-serif font-black tracking-[0.25em] text-stone-900 uppercase">
                  {bannerForm.bannerSubtitle || 'A R T I S T'}
                </span>
              </div>
              <p className="text-xs font-serif font-semibold text-stone-700 tracking-wider">
                {bannerForm.bannerSlogan || 'LOOK GOOD • FEEL CONFIDENT'}
              </p>
              <p
                style={{ fontFamily: "'Great Vibes', cursive" }}
                className="text-xl sm:text-2xl text-[#9f1239]"
              >
                {bannerForm.bannerTagline || 'Your Beauty Our Passion ♡'}
              </p>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <div className="w-36 h-44 rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-2 ring-rose-300">
                <img
                  src={bannerForm.bannerUrl || '/images/ankita_banner.jpg'}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Bottom Ribbon Preview */}
          <div className="mt-4 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 bg-[#740f2e] text-white py-2 px-4 flex justify-around text-[10px] sm:text-xs">
            <span>🛡 {bannerForm.bannerTrust1 || 'Professional Service'}</span>
            <span>♥ {bannerForm.bannerTrust2 || '100% Hygiene'}</span>
            <span>⭐ {bannerForm.bannerTrust3 || 'Natural & Long Lasting Look'}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. ADD NEW BANNER / UPLOAD BANNER PHOTO                       */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#8e512d] flex items-center justify-center font-bold">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              নতুন ব্যানার আপলোড করুন (Upload / Add New Banner)
            </h3>
            <p className="text-xs text-stone-500">
              আপনার ফোন বা কম্পিউটার থেকে ছবি আপলোড করুন অথবা ছবির লিংক দিন
            </p>
          </div>
        </div>

        <form onSubmit={handleAddNewBanner} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Banner Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                ব্যানার টাইটেল / নাম (Banner Name)
              </label>
              <input
                type="text"
                value={newBannerTitle}
                onChange={(e) => setNewBannerTitle(e.target.value)}
                placeholder="যেমন: Bengali Bridal 2025"
                className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8e512d]"
              />
            </div>

            {/* Banner Subtitle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                সাবটাইটেল (Subtitle)
              </label>
              <input
                type="text"
                value={newBannerSubtitle}
                onChange={(e) => setNewBannerSubtitle(e.target.value)}
                placeholder="যেমন: Signature Bridal & HD Makeover"
                className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8e512d]"
              />
            </div>
          </div>

          {/* Upload File / Image URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Direct File Uploader */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                ১. ফাইল থেকে আপলোড করুন (Direct Image Upload)
              </label>
              <div
                onClick={() => !isCompressing && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2 ${
                  isCompressing
                    ? 'border-amber-400 bg-amber-50 cursor-wait'
                    : 'border-rose-300 hover:border-rose-500 bg-rose-50/50 hover:bg-rose-50'
                }`}
              >
                {isCompressing ? (
                  <div className="flex flex-col items-center justify-center space-y-2 py-2">
                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                    <p className="text-xs font-bold text-amber-900">
                      ছবি অপ্টিমাইজ ও কম্প্রেস হচ্ছে...
                    </p>
                    <p className="text-[11px] text-amber-700">দয়া করে এক মুহূর্ত অপেক্ষা করুন</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[#8e512d] mx-auto" />
                    <p className="text-xs font-bold text-stone-800">
                      গ্যালারি বা ফাইল থেকে ছবি সিলেক্ট করুন
                    </p>
                    <p className="text-[11px] text-stone-500">
                      JPG, PNG, WebP • স্বয়ংক্রিয়ভাবে দ্রুত লোডিংয়ের জন্য অপ্টিমাইজ হবে
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isCompressing}
                  className="hidden"
                />
              </div>
            </div>

            {/* Image URL & Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                ২. অথবা ছবির সরাসরি লিংক (Image URL)
              </label>
              <input
                type="url"
                value={newBannerImageUrl}
                onChange={(e) => {
                  setNewBannerImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                  setImageSizeKb(null);
                }}
                placeholder="https://images.unsplash.com/... অথবা ছবির URL"
                className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8e512d]"
              />

              {imagePreview && (
                <div className="mt-2 flex items-center space-x-3 p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                  <img
                    src={imagePreview}
                    alt="Uploaded preview"
                    className="w-16 h-16 object-cover rounded-lg border border-emerald-300 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-emerald-900 flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ছবি প্রস্তুত হয়েছে</span>
                    </p>
                    {imageSizeKb && (
                      <p className="text-[11px] text-emerald-700 font-mono">
                        সাইজ: {imageSizeKb} KB (অপ্টিমাইজড)
                      </p>
                    )}
                    <p className="text-[10px] text-stone-500">
                      নিচের বাটনে ক্লিক করে ব্যানারটি একটিভ করুন
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {bannerErrorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{bannerErrorMessage}</span>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">
                  ✓ নতুন ব্যানার সফলভাবে যুক্ত ও হোমপেজে একটিভ হয়েছে!
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('home')}
                className="text-xs font-bold text-emerald-900 underline flex items-center space-x-1"
              >
                <span>হোমপেজে দেখুন</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving || isCompressing}
              className={`px-6 py-2.5 bg-[#8e512d] hover:bg-[#743e1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
                isSaving || isCompressing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>ব্যানার যোগ করুন এবং এক্টিভ করুন (Add & Set Active)</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preset Aesthetic Banners Section */}
        <div className="pt-4 border-t border-stone-100 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
            রেডিমেড ব্যানার প্রিভিউ (Quick Choose Preset)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {presetBanners.map((preset) => (
              <div
                key={preset.title}
                className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-rose-50/60 transition-colors flex items-center space-x-3"
              >
                <img
                  src={preset.url}
                  alt={preset.title}
                  className="w-12 h-14 object-cover rounded-lg border border-stone-200"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-900 truncate">{preset.title}</p>
                  <p className="text-[10px] text-stone-500 truncate">{preset.subtitle}</p>
                  <button
                    type="button"
                    onClick={async () => {
                      setBannerForm((prev) => ({ ...prev, bannerUrl: preset.url }));
                      await addBanner({
                        title: preset.title,
                        subtitle: preset.subtitle,
                        imageUrl: preset.url,
                        active: true,
                      });
                      await updateBusinessSettings({
                        bannerUrl: preset.url,
                        artistPhoto: preset.url,
                      });
                      setSavedSuccess(true);
                      setTimeout(() => setSavedSuccess(false), 3000);
                    }}
                    className="mt-1 text-[10px] font-bold text-[#8e512d] hover:underline cursor-pointer"
                  >
                    ব্যানার হিসেবে সিলেক্ট করুন →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. SAVED BANNERS LIST                                         */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-lg font-serif font-bold text-stone-900">
          সংরক্ষিত ব্যানার তালিকা (Saved Banners)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(settings.bannerList || []).map((b) => {
            const isCurrentlyActive =
              settings.bannerUrl === b.imageUrl || settings.artistPhoto === b.imageUrl;
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isCurrentlyActive
                    ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-300'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-100">
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isCurrentlyActive && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] shadow">
                      ✓ Active Banner
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-stone-900">{b.title}</h4>
                  <p className="text-xs text-stone-500">{b.subtitle}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  {!isCurrentlyActive ? (
                    <button
                      onClick={() => setActiveBanner(b.id)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Active করুন
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Currently Active</span>
                    </span>
                  )}

                  <button
                    onClick={() => deleteBanner(b.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                    title="Delete banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. BANNER TYPOGRAPHY & TEXT CUSTOMIZATION                     */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                ব্যানার টেক্সট ও ক্যাপশন এডিটর (Banner Text & Typography)
              </h3>
              <p className="text-xs text-stone-500">
                ব্যানারে প্রদর্শিত টাইটেল, স্লো গান ও ট্রাস্ট ব্যাজ পরিবর্তন করুন
              </p>
            </div>
          </div>

          {savedSuccess && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>সেটিংস সংরক্ষিত হয়েছে!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveBannerTexts} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                মেইন টাইটেল (Cursive Main Title)
              </label>
              <input
                type="text"
                value={bannerForm.bannerTitle}
                onChange={(e) => setBannerForm({ ...bannerForm, bannerTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8e512d]"
              />
              <span className="text-[10px] text-stone-400">ডিফল্ট: Makeup</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                সাবটাইটেল (Block Font Subtitle)
              </label>
              <input
                type="text"
                value={bannerForm.bannerSubtitle}
                onChange={(e) => setBannerForm({ ...bannerForm, bannerSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8e512d]"
              />
              <span className="text-[10px] text-stone-400">ডিফল্ট: A R T I S T</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                স্লোগান (Middle Slogan with Heart)
              </label>
              <input
                type="text"
                value={bannerForm.bannerSlogan}
                onChange={(e) => setBannerForm({ ...bannerForm, bannerSlogan: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8e512d]"
              />
              <span className="text-[10px] text-stone-400">ডিফল্ট: LOOK GOOD • FEEL CONFIDENT</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                ট্যাগলাইন (Cursive Tagline)
              </label>
              <input
                type="text"
                value={bannerForm.bannerTagline}
                onChange={(e) => setBannerForm({ ...bannerForm, bannerTagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8e512d]"
              />
              <span className="text-[10px] text-stone-400">ডিফল্ট: Your Beauty Our Passion ♡</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                ডানপাশের ব্যাজ (Right Self-Love Badge)
              </label>
              <input
                type="text"
                value={bannerForm.bannerRightBadge}
                onChange={(e) =>
                  setBannerForm({ ...bannerForm, bannerRightBadge: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8e512d]"
              />
              <span className="text-[10px] text-stone-400">
                ডিফল্ট: BEAUTY BEGINS WITH SELF LOVE
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                ডানপাশের কোট (Right Cursive Quote)
              </label>
              <input
                type="text"
                value={bannerForm.bannerRightQuote}
                onChange={(e) =>
                  setBannerForm({ ...bannerForm, bannerRightQuote: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8e512d]"
              />
              <span className="text-[10px] text-stone-400">
                ডিফল্ট: Be Your Own Kind of Beautiful
              </span>
            </div>
          </div>

          {/* Bottom Ribbon Trust Badges */}
          <div className="pt-2 border-t border-stone-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              নিচের মেরুন রিবন ট্রাস্ট ব্যাজ (Bottom Ribbon 3 Features)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  value={bannerForm.bannerTrust1}
                  onChange={(e) => setBannerForm({ ...bannerForm, bannerTrust1: e.target.value })}
                  placeholder="Professional Service"
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={bannerForm.bannerTrust2}
                  onChange={(e) => setBannerForm({ ...bannerForm, bannerTrust2: e.target.value })}
                  placeholder="100% Hygiene"
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={bannerForm.bannerTrust3}
                  onChange={(e) => setBannerForm({ ...bannerForm, bannerTrust3: e.target.value })}
                  placeholder="Natural & Long Lasting Look"
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'ব্যানার সেটিংস সেভ করুন (Save Banner Settings)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

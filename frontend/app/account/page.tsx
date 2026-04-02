'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Headset,
  Heart,
  Loader2,
  LockKeyhole,
  LogOut,
  MapPin,
  MessageSquareText,
  Package,
  Pencil,
  ShieldCheck,
  Star,
  Trash2,
  User2,
} from 'lucide-react';

import { formatLek } from '@/lib/data';

type ProfileData = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  order_count: number;
  active_order_count: number;
  wishlist_count: number;
  address_count: number;
  review_count: number;
  question_count: number;
  open_support_count: number;
  total_spent: string;
};

type OrderData = {
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: string;
  created_at: string;
  items: { product: string; quantity: number; subtotal: string }[];
};

type AddressData = {
  id: number;
  title: string;
  full_name: string;
  phone: string;
  country: string;
  city: string;
  postal_code: string;
  address_line: string;
  address_line_2: string;
  company_name: string;
  is_default: boolean;
};

type ReviewData = {
  id: number;
  rating: number;
  title: string;
  comment: string;
  product_name: string;
  product_slug: string;
  product_image: string;
  is_verified_purchase: boolean;
  created_at: string;
};

type QuestionData = {
  id: number;
  product: number;
  product_name: string;
  product_slug: string;
  product_image: string;
  question: string;
  answer: string;
  created_at: string;
};

type SupportTicketData = {
  id: number;
  subject: string;
  category: string;
  message: string;
  preferred_contact: string;
  status: string;
  created_at: string;
};

type AccountSection = 'profile' | 'addresses' | 'orders' | 'reviews' | 'questions' | 'support' | 'security';

type AddressForm = {
  title: string;
  full_name: string;
  phone: string;
  country: string;
  city: string;
  postal_code: string;
  address_line: string;
  address_line_2: string;
  company_name: string;
  is_default: boolean;
};

const statusLabels: Record<string, string> = {
  pending: 'Beklemede',
  paid: 'Ödendi',
  processing: 'Hazırlanıyor',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi',
  authorized: 'Provizyonda',
  failed: 'Başarısız',
  refunded: 'İade Edildi',
  open: 'Açık',
  in_progress: 'İşlemde',
  resolved: 'Çözüldü',
  order: 'Sipariş',
  payment: 'Ödeme',
  delivery: 'Teslimat',
  account: 'Hesap',
  technical: 'Teknik',
  other: 'Diğer',
};

const accountNavItems = [
  { label: 'Kişisel Bilgiler', icon: User2, section: 'profile' as const },
  { label: 'Adreslerim', icon: MapPin, section: 'addresses' as const },
  { label: 'Siparişlerim', icon: Package, section: 'orders' as const },
  { label: 'Değerlendirmelerim', icon: Star, section: 'reviews' as const },
  { label: 'Soru ve Taleplerim', icon: MessageSquareText, section: 'questions' as const },
  { label: 'Destek Al', icon: Headset, section: 'support' as const },
  { label: 'Şifre & Güvenlik', icon: LockKeyhole, section: 'security' as const },
];

const emptyAddressForm: AddressForm = {
  title: '',
  full_name: '',
  phone: '',
  country: 'Albania',
  city: '',
  postal_code: '',
  address_line: '',
  address_line_2: '',
  company_name: '',
  is_default: false,
};

function createAddressForm(profile?: ProfileData | null): AddressForm {
  return {
    ...emptyAddressForm,
    full_name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : '',
    phone: profile?.phone || profile?.username || '',
  };
}

function sortAddresses(items: AddressData[]) {
  return [...items].sort((left, right) => {
    if (left.is_default !== right.is_default) {
      return Number(right.is_default) - Number(left.is_default);
    }
    return right.id - left.id;
  });
}

function extractErrorMessage(data: unknown, fallback: string) {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (Array.isArray(data) && typeof data[0] === 'string') return data[0];
  if (typeof data === 'object') {
    const entries = Object.values(data as Record<string, unknown>);
    for (const value of entries) {
      if (typeof value === 'string') return value;
      if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    }
  }
  return fallback;
}

export default function AccountPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicketData[]>([]);
  const [activeSection, setActiveSection] = useState<AccountSection>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [profileStatus, setProfileStatus] = useState('');
  const [profileError, setProfileError] = useState('');
  const [addressStatus, setAddressStatus] = useState('');
  const [addressError, setAddressError] = useState('');
  const [supportStatus, setSupportStatus] = useState('');
  const [supportError, setSupportError] = useState('');
  const [securityStatus, setSecurityStatus] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [isSupportSaving, setIsSupportSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    phone: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [profileForm, setProfileForm] = useState({ first_name: '', last_name: '', email: '', phone: '' });
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddressForm);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    category: 'other',
    preferred_contact: 'email',
    message: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirm: '',
  });

  useEffect(() => {
    async function loadAccount() {
      const responses = await Promise.all([
        fetch('/api/profile', { cache: 'no-store' }),
        fetch('/api/orders/history', { cache: 'no-store' }),
        fetch('/api/addresses', { cache: 'no-store' }),
        fetch('/api/reviews/mine', { cache: 'no-store' }),
        fetch('/api/questions', { cache: 'no-store' }),
        fetch('/api/support', { cache: 'no-store' }),
      ]);

      const [profileResponse, ordersResponse, addressResponse, reviewResponse, questionResponse, supportResponse] = responses;

      if (!profileResponse.ok) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      const profileData = (await profileResponse.json()) as ProfileData;
      const ordersData = ordersResponse.ok ? ((await ordersResponse.json()) as OrderData[]) : [];
      const addressData = addressResponse.ok ? ((await addressResponse.json()) as AddressData[]) : [];
      const reviewData = reviewResponse.ok ? ((await reviewResponse.json()) as ReviewData[]) : [];
      const questionData = questionResponse.ok ? ((await questionResponse.json()) as QuestionData[]) : [];
      const supportData = supportResponse.ok ? ((await supportResponse.json()) as SupportTicketData[]) : [];

      setProfile(profileData);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setAddresses(Array.isArray(addressData) ? sortAddresses(addressData) : []);
      setReviews(Array.isArray(reviewData) ? reviewData : []);
      setQuestions(Array.isArray(questionData) ? questionData : []);
      setSupportTickets(Array.isArray(supportData) ? supportData : []);
      setProfileForm({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        phone: profileData.phone || profileData.username,
      });
      setAddressForm(createAddressForm(profileData));
      setIsLoggedIn(true);
      setIsLoading(false);
    }

    loadAccount().catch(() => {
      setIsLoggedIn(false);
      setIsLoading(false);
    });
  }, []);

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsSubmitting(true);

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = authMode === 'login' ? loginForm : registerForm;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setAuthError(extractErrorMessage(data, 'İşlem tamamlanamadı.'));
        return;
      }

      setAuthSuccess(authMode === 'login' ? 'Giriş başarılı, hesabınız yükleniyor.' : 'Kayıt oluşturuldu, hesabınız açılıyor.');
      window.location.href = '/account';
    } catch {
      setAuthError('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    window.location.href = '/';
  }

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileStatus('');
    setProfileError('');
    setIsProfileSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setProfileError(extractErrorMessage(data, 'Bilgiler güncellenemedi.'));
        return;
      }

      const updatedProfile = data as ProfileData;
      setProfile(updatedProfile);
      setProfileForm({
        first_name: updatedProfile.first_name,
        last_name: updatedProfile.last_name,
        email: updatedProfile.email,
        phone: updatedProfile.phone || updatedProfile.username,
      });
      setProfileStatus('Kişisel bilgiler güncellendi.');
    } catch {
      setProfileError('Bağlantı hatası oluştu.');
    } finally {
      setIsProfileSaving(false);
    }
  }

  function updateAddressField<K extends keyof AddressForm>(field: K, value: AddressForm[K]) {
    setAddressForm((current) => ({ ...current, [field]: value }));
  }

  function openNewAddressForm() {
    setEditingAddressId(null);
    setAddressStatus('');
    setAddressError('');
    setAddressForm(createAddressForm(profile));
    setShowAddressForm(true);
  }

  function openEditAddressForm(address: AddressData) {
    setEditingAddressId(address.id);
    setAddressStatus('');
    setAddressError('');
    setAddressForm({
      title: address.title,
      full_name: address.full_name,
      phone: address.phone,
      country: address.country,
      city: address.city,
      postal_code: address.postal_code,
      address_line: address.address_line,
      address_line_2: address.address_line_2,
      company_name: address.company_name,
      is_default: address.is_default,
    });
    setShowAddressForm(true);
  }

  function resetAddressEditor(nextProfile?: ProfileData | null) {
    setEditingAddressId(null);
    setShowAddressForm(false);
    setAddressForm(createAddressForm(nextProfile ?? profile));
  }

  async function reloadAddresses() {
    const response = await fetch('/api/addresses', { cache: 'no-store' });
    if (!response.ok) {
      return false;
    }

    const data = await response.json().catch(() => []);
    setAddresses(Array.isArray(data) ? sortAddresses(data) : []);
    return true;
  }

  async function handleAddressSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAddressStatus('');
    setAddressError('');
    setIsAddressSaving(true);

    try {
      const isEditing = editingAddressId !== null;
      const response = await fetch(isEditing ? `/api/addresses/${editingAddressId}` : '/api/addresses', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setAddressError(extractErrorMessage(data, isEditing ? 'Adres güncellenemedi.' : 'Adres kaydedilemedi.'));
        return;
      }

      await reloadAddresses();
      resetAddressEditor();
      setAddressStatus(isEditing ? 'Adres bilgileri güncellendi.' : 'Adres hesabınıza eklendi.');
      if (!isEditing) {
        setProfile((current) => current ? { ...current, address_count: current.address_count + 1 } : current);
      }
    } catch {
      setAddressError('Bağlantı hatası oluştu.');
    } finally {
      setIsAddressSaving(false);
    }
  }

  async function handleDeleteAddress(addressId: number) {
    const confirmed = window.confirm('Bu adresi silmek istediğinize emin misiniz?');
    if (!confirmed) {
      return;
    }

    setAddressStatus('');
    setAddressError('');
    setDeletingAddressId(addressId);

    try {
      const response = await fetch(`/api/addresses/${addressId}`, { method: 'DELETE' });
      if (!response.ok && response.status !== 204) {
        const data = await response.json().catch(() => null);
        setAddressError(extractErrorMessage(data, 'Adres silinemedi.'));
        return;
      }

      await reloadAddresses();
      setProfile((current) => current ? { ...current, address_count: Math.max(0, current.address_count - 1) } : current);
      setAddressStatus('Adres silindi.');
      if (editingAddressId === addressId) {
        resetAddressEditor();
      }
    } catch {
      setAddressError('Bağlantı hatası oluştu.');
    } finally {
      setDeletingAddressId(null);
    }
  }

  async function handleSupportSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSupportStatus('');
    setSupportError('');
    setIsSupportSaving(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supportForm),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setSupportError(extractErrorMessage(data, 'Destek talebi gönderilemedi.'));
        return;
      }

      const createdTicket = data as SupportTicketData;
      setSupportTickets((current) => [createdTicket, ...current]);
      setSupportForm({ subject: '', category: 'other', preferred_contact: 'email', message: '' });
      setSupportStatus('Destek talebiniz alındı.');
      setProfile((current) => current ? { ...current, open_support_count: current.open_support_count + 1 } : current);
    } catch {
      setSupportError('Bağlantı hatası oluştu.');
    } finally {
      setIsSupportSaving(false);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSecurityStatus('');
    setSecurityError('');
    setIsPasswordSaving(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setSecurityError(extractErrorMessage(data, 'Şifre güncellenemedi.'));
        return;
      }

      setPasswordForm({ current_password: '', new_password: '', new_password_confirm: '' });
      setSecurityStatus('Şifreniz başarıyla güncellendi.');
    } catch {
      setSecurityError('Bağlantı hatası oluştu.');
    } finally {
      setIsPasswordSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container-main flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn || !profile) {
    return (
      <div className="container-main py-10">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-card border border-border bg-white shadow-soft lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-ink px-8 py-10 text-white md:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-light">AlbaniaShop Hesabım</p>
            <h1 className="mt-4 text-3xl font-black">Giriş yapın veya yeni hesap oluşturun</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
              Siparişlerinizi takip etmek, adreslerinizi yönetmek ve destek taleplerinizi tek yerden görmek için hesabınızı kullanın.
            </p>

            <div className="mt-8 space-y-3 text-sm text-white/80">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Adresler, siparişler ve yorumlar aynı panelde</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Soru geçmişi ve destek taleplerine hızlı erişim</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Güvenlik ve şifre işlemleri tek ekranda</div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="flex rounded-xl bg-surface p-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${authMode === 'login' ? 'bg-white text-ink shadow-soft' : 'text-muted hover:text-ink'}`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${authMode === 'register' ? 'bg-white text-ink shadow-soft' : 'text-muted hover:text-ink'}`}
              >
                Kayıt Ol
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <User2 className="h-10 w-10 rounded-full bg-primary-light p-2 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-ink">{authMode === 'login' ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}</h2>
                <p className="text-sm text-muted">
                  {authMode === 'login' ? 'Mevcut bilgilerinizle devam edin.' : 'Birkaç bilgiyle hesabınızı hemen açın.'}
                </p>
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleAuthSubmit}>
              {authMode === 'register' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-ink">Ad</span>
                    <input
                      value={registerForm.first_name}
                      onChange={(event) => setRegisterForm((current) => ({ ...current, first_name: event.target.value }))}
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-primary"
                      placeholder="Adınız"
                    />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-ink">Soyad</span>
                    <input
                      value={registerForm.last_name}
                      onChange={(event) => setRegisterForm((current) => ({ ...current, last_name: event.target.value }))}
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-primary"
                      placeholder="Soyadınız"
                    />
                  </label>
                </div>
              ) : null}

              <label className="block space-y-2 text-sm">
                <span className="font-medium text-ink">Telefon Numarası</span>
                <input
                  value={authMode === 'login' ? loginForm.phone : registerForm.phone}
                  onChange={(event) => authMode === 'login'
                    ? setLoginForm((current) => ({ ...current, phone: event.target.value }))
                    : setRegisterForm((current) => ({ ...current, phone: event.target.value }))}
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-primary"
                  placeholder="05xxxxxxxx"
                  required
                />
              </label>

              {authMode === 'register' ? (
                <label className="block space-y-2 text-sm">
                  <span className="font-medium text-ink">E-posta</span>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-primary"
                    placeholder="ornek@mail.com"
                    required
                  />
                </label>
              ) : null}

              <label className="block space-y-2 text-sm">
                <span className="font-medium text-ink">Şifre</span>
                <input
                  type="password"
                  value={authMode === 'login' ? loginForm.password : registerForm.password}
                  onChange={(event) => authMode === 'login'
                    ? setLoginForm((current) => ({ ...current, password: event.target.value }))
                    : setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-primary"
                  placeholder="Şifreniz"
                  required
                />
              </label>

              {authError ? <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">{authError}</p> : null}
              {authSuccess ? <p className="rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">{authSuccess}</p> : null}

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const initials = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.trim().toUpperCase() || profile.username.charAt(0).toUpperCase();

  return (
    <div className="container-main grid gap-6 py-6 lg:grid-cols-[280px_1fr]">
      <aside className="card h-fit p-5">
        <div className="mb-5 rounded-3xl bg-ink px-4 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm font-bold">{initials}</div>
            <div>
              <p className="text-sm font-semibold">{profile.first_name} {profile.last_name}</p>
              <p className="text-xs text-white/70">{profile.email}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/80">
            <div className="rounded-2xl bg-white/5 px-3 py-2">
              <p>Toplam Sipariş</p>
              <p className="mt-1 text-lg font-bold text-white">{profile.order_count}</p>
            </div>
            <div className="rounded-2xl bg-white/5 px-3 py-2">
              <p>Toplam Harcama</p>
              <p className="mt-1 text-lg font-bold text-white">{formatLek(Number(profile.total_spent || 0))}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {accountNavItems.map(({ label, icon: ItemIcon, section }) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveSection(section)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${activeSection === section ? 'bg-surface text-ink' : 'text-muted hover:bg-surface hover:text-ink'}`}
            >
              <ItemIcon className="h-4 w-4" />
              {label}
            </button>
          ))}
          <Link href="/wishlist" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface hover:text-ink">
            <Heart className="h-4 w-4" />
            Favorilerim
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-danger transition hover:bg-surface"
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </button>
        </nav>
      </aside>

      <section className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="card p-4">
            <p className="text-xs text-muted">Aktif Siparişler</p>
            <p className="mt-1 text-2xl font-bold text-ink">{profile.active_order_count}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-muted">Kayıtlı Adres</p>
            <p className="mt-1 text-2xl font-bold text-ink">{profile.address_count}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-muted">Yorumlar</p>
            <p className="mt-1 text-2xl font-bold text-ink">{profile.review_count}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-muted">Açık Destek Talebi</p>
            <p className="mt-1 text-2xl font-bold text-ink">{profile.open_support_count}</p>
          </div>
        </div>

        {activeSection === 'profile' ? (
          <div className="card space-y-5 p-5">
            <div>
              <h2 className="text-lg font-bold text-ink">Kişisel Bilgiler</h2>
              <p className="mt-1 text-sm text-muted">Hesap bilgileriniz burada güncellenir ve sipariş süreçlerinde kullanılır.</p>
            </div>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleProfileSubmit}>
              <label className="space-y-2 text-sm">
                <span className="font-medium text-ink">Ad</span>
                <input value={profileForm.first_name} onChange={(event) => setProfileForm((current) => ({ ...current, first_name: event.target.value }))} className="input-field" />
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-medium text-ink">Soyad</span>
                <input value={profileForm.last_name} onChange={(event) => setProfileForm((current) => ({ ...current, last_name: event.target.value }))} className="input-field" />
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-medium text-ink">E-posta</span>
                <input type="email" value={profileForm.email} onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))} className="input-field" required />
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-medium text-ink">Telefon</span>
                <input value={profileForm.phone} onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))} className="input-field" required />
              </label>
              <div className="rounded-card border border-border bg-surface px-4 py-4 text-sm md:col-span-2">
                <p className="text-xs text-muted">Hesap Özeti</p>
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  <p className="font-medium text-ink">Toplam harcama: {formatLek(Number(profile.total_spent || 0))}</p>
                  <p className="font-medium text-ink">Favoriler: {profile.wishlist_count}</p>
                  <p className="font-medium text-ink">Sorular: {profile.question_count}</p>
                </div>
              </div>
              {profileError ? <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger md:col-span-2">{profileError}</p> : null}
              {profileStatus ? <p className="rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success md:col-span-2">{profileStatus}</p> : null}
              <div className="md:col-span-2">
                <button type="submit" disabled={isProfileSaving} className="btn-primary disabled:opacity-70">
                  {isProfileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Bilgileri Güncelle
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {activeSection === 'addresses' ? (
          <div className="card space-y-5 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink">Adreslerim</h2>
                <p className="mt-1 text-sm text-muted">Teslimat ve fatura süreçlerinde kullanılacak adreslerinizi buradan yönetin.</p>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  if (showAddressForm && editingAddressId === null) {
                    resetAddressEditor();
                    return;
                  }
                  openNewAddressForm();
                }}
              >
                {showAddressForm && editingAddressId === null ? 'Formu Kapat' : 'Yeni Adres Ekle'}
              </button>
            </div>

            {addresses.length ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {addresses.map((address) => (
                  <article key={address.id} className="rounded-card border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">{address.title}</p>
                        <p className="text-sm text-muted">{address.full_name}</p>
                      </div>
                      {address.is_default ? <span className="rounded-full bg-success/10 px-2 py-1 text-[11px] font-semibold text-success">Varsayılan</span> : null}
                    </div>
                    <p className="mt-3 text-sm text-muted">{address.address_line}{address.address_line_2 ? `, ${address.address_line_2}` : ''}</p>
                    <p className="mt-1 text-sm text-muted">{address.city}, {address.country} {address.postal_code}</p>
                    <p className="mt-1 text-sm text-muted">{address.phone}</p>
                    {address.company_name ? <p className="mt-1 text-sm text-muted">{address.company_name}</p> : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" className="btn-secondary px-4 py-2 text-sm" onClick={() => openEditAddressForm(address)}>
                        <Pencil className="h-4 w-4" />
                        Düzenle
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-danger/20 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/5 disabled:opacity-60"
                        onClick={() => handleDeleteAddress(address.id)}
                        disabled={deletingAddressId === address.id}
                      >
                        {deletingAddressId === address.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        Sil
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-card border border-border bg-surface p-6 text-sm text-muted">
                Henüz kayıtlı adresiniz yok. Yeni adres ekleyerek bir sonraki siparişinizi hızlandırabilirsiniz.
              </div>
            )}

            {showAddressForm ? (
              <form className="grid gap-3 md:grid-cols-2" onSubmit={handleAddressSubmit}>
                <input value={addressForm.title} onChange={(event) => updateAddressField('title', event.target.value)} className="input-field" placeholder="Adres başlığı" required />
                <input value={addressForm.full_name} onChange={(event) => updateAddressField('full_name', event.target.value)} className="input-field" placeholder="Ad Soyad" required />
                <input value={addressForm.phone} onChange={(event) => updateAddressField('phone', event.target.value)} className="input-field" placeholder="Telefon" required />
                <input value={addressForm.city} onChange={(event) => updateAddressField('city', event.target.value)} className="input-field" placeholder="Şehir" required />
                <input value={addressForm.country} onChange={(event) => updateAddressField('country', event.target.value)} className="input-field" placeholder="Ülke" required />
                <input value={addressForm.postal_code} onChange={(event) => updateAddressField('postal_code', event.target.value)} className="input-field" placeholder="Posta kodu" />
                <input value={addressForm.company_name} onChange={(event) => updateAddressField('company_name', event.target.value)} className="input-field" placeholder="Şirket adı" />
                <input value={addressForm.address_line_2} onChange={(event) => updateAddressField('address_line_2', event.target.value)} className="input-field" placeholder="Adres satırı 2" />
                <textarea value={addressForm.address_line} onChange={(event) => updateAddressField('address_line', event.target.value)} className="input-field min-h-28 md:col-span-2" placeholder="Açık adres" required />
                <label className="flex items-center gap-2 text-sm text-muted md:col-span-2">
                  <input type="checkbox" checked={addressForm.is_default} onChange={(event) => updateAddressField('is_default', event.target.checked)} />
                  Varsayılan adres olarak ayarla
                </label>
                {addressError ? <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger md:col-span-2">{addressError}</p> : null}
                {addressStatus ? <p className="rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success md:col-span-2">{addressStatus}</p> : null}
                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <button type="submit" disabled={isAddressSaving} className="btn-primary disabled:opacity-70">
                    {isAddressSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {editingAddressId ? 'Adresi Güncelle' : 'Adresi Kaydet'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => resetAddressEditor()}>
                    İptal
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        ) : null}

        {activeSection === 'orders' ? (
          <div className="card space-y-4 p-5">
            <div>
              <h2 className="text-lg font-bold text-ink">Siparişlerim</h2>
              <p className="mt-1 text-sm text-muted">Geçmiş siparişlerinizi ve ödeme durumlarını buradan takip edebilirsiniz.</p>
            </div>
            {orders.length ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <article key={order.order_number} className="rounded-card border border-border p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink">Sipariş No: {order.order_number}</p>
                        <p className="mt-1 text-xs text-muted">{new Date(order.created_at).toLocaleDateString('tr-TR')}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-sm font-semibold text-primary">{formatLek(Number(order.total_amount))}</p>
                        <p className="mt-1 text-xs text-muted">Durum: {statusLabels[order.status] ?? order.status}</p>
                        <p className="text-xs text-muted">Ödeme: {statusLabels[order.payment_status] ?? order.payment_status}</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-muted">
                      {order.items.map((item, index) => (
                        <div key={`${order.order_number}-${index}`} className="flex items-center justify-between gap-3">
                          <span>{item.product} x {item.quantity}</span>
                          <span>{formatLek(Number(item.subtotal))}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-card border border-border bg-surface p-6 text-sm text-muted">
                Henüz oluşturulmuş bir siparişiniz yok.
              </div>
            )}
          </div>
        ) : null}

        {activeSection === 'reviews' ? (
          <div className="card space-y-4 p-5">
            <div>
              <h2 className="text-lg font-bold text-ink">Değerlendirmelerim</h2>
              <p className="mt-1 text-sm text-muted">Daha önce yorum bıraktığınız ürünleri burada görebilirsiniz.</p>
            </div>
            {reviews.length ? (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <article key={review.id} className="rounded-card border border-border p-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="h-20 w-20 overflow-hidden rounded-2xl bg-surface">
                        {review.product_image ? <img src={review.product_image} alt={review.product_name} className="h-full w-full object-cover" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <Link href={`/product/${review.product_slug}`} className="font-semibold text-ink hover:text-primary">
                              {review.product_name}
                            </Link>
                            <p className="mt-1 text-xs text-muted">{new Date(review.created_at).toLocaleDateString('tr-TR')}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                            <Star className="h-4 w-4 fill-star text-star" />
                            {review.rating}/5
                          </div>
                        </div>
                        {review.title ? <p className="mt-3 text-sm font-semibold text-ink">{review.title}</p> : null}
                        <p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p>
                        {review.is_verified_purchase ? <p className="mt-2 text-xs font-medium text-success">Doğrulanmış satın alma</p> : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-card border border-border bg-surface p-6 text-sm text-muted">
                Henüz hesabınıza bağlı bir değerlendirme bulunmuyor.
              </div>
            )}
          </div>
        ) : null}

        {activeSection === 'questions' ? (
          <div className="card space-y-4 p-5">
            <div>
              <h2 className="text-lg font-bold text-ink">Soru ve Taleplerim</h2>
              <p className="mt-1 text-sm text-muted">Soru sorduğunuz ürünleri ve cevap durumlarını bu bölümde takip edebilirsiniz.</p>
            </div>
            {questions.length ? (
              <div className="space-y-3">
                {questions.map((question) => (
                  <article key={question.id} className="rounded-card border border-border p-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="h-20 w-20 overflow-hidden rounded-2xl bg-surface">
                        {question.product_image ? <img src={question.product_image} alt={question.product_name} className="h-full w-full object-cover" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/product/${question.product_slug}`} className="font-semibold text-ink hover:text-primary">
                          {question.product_name}
                        </Link>
                        <p className="mt-1 text-xs text-muted">{new Date(question.created_at).toLocaleDateString('tr-TR')}</p>
                        <div className="mt-3 rounded-2xl bg-surface px-4 py-3 text-sm text-ink">
                          <p className="font-semibold">Sorunuz</p>
                          <p className="mt-1 leading-6 text-muted">{question.question}</p>
                        </div>
                        <div className="mt-3 rounded-2xl border border-border px-4 py-3 text-sm">
                          <p className="font-semibold text-ink">Yanıt Durumu</p>
                          <p className="mt-1 leading-6 text-muted">{question.answer || 'Henüz yanıtlanmadı. Yanıt geldiğinde burada görünecek.'}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-card border border-border bg-surface p-6 text-sm text-muted">
                Daha önce soru sorduğunuz bir ürün bulunmuyor.
              </div>
            )}
          </div>
        ) : null}

        {activeSection === 'support' ? (
          <div className="card space-y-5 p-5">
            <div>
              <h2 className="text-lg font-bold text-ink">Müşteri Hizmetleri - Destek Al</h2>
              <p className="mt-1 text-sm text-muted">Sipariş, ödeme, teslimat veya hesap konularında yeni destek talebi oluşturabilirsiniz.</p>
            </div>

            <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSupportSubmit}>
              <input value={supportForm.subject} onChange={(event) => setSupportForm((current) => ({ ...current, subject: event.target.value }))} className="input-field md:col-span-2" placeholder="Konu" required />
              <select value={supportForm.category} onChange={(event) => setSupportForm((current) => ({ ...current, category: event.target.value }))} className="input-field" required>
                <option value="order">Sipariş</option>
                <option value="payment">Ödeme</option>
                <option value="delivery">Teslimat</option>
                <option value="account">Hesap</option>
                <option value="technical">Teknik</option>
                <option value="other">Diğer</option>
              </select>
              <select value={supportForm.preferred_contact} onChange={(event) => setSupportForm((current) => ({ ...current, preferred_contact: event.target.value }))} className="input-field" required>
                <option value="email">E-posta ile dönüş</option>
                <option value="phone">Telefon ile dönüş</option>
              </select>
              <textarea value={supportForm.message} onChange={(event) => setSupportForm((current) => ({ ...current, message: event.target.value }))} className="input-field min-h-32 md:col-span-2" placeholder="Destek talebinizin detaylarını yazın" required />
              {supportError ? <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger md:col-span-2">{supportError}</p> : null}
              {supportStatus ? <p className="rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success md:col-span-2">{supportStatus}</p> : null}
              <div className="md:col-span-2">
                <button type="submit" disabled={isSupportSaving} className="btn-primary disabled:opacity-70">
                  {isSupportSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Destek Talebi Oluştur
                </button>
              </div>
            </form>

            <div>
              <h3 className="text-base font-bold text-ink">Geçmiş Destek Talepleri</h3>
              {supportTickets.length ? (
                <div className="mt-3 space-y-3">
                  {supportTickets.map((ticket) => (
                    <article key={ticket.id} className="rounded-card border border-border p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-semibold text-ink">{ticket.subject}</p>
                          <p className="mt-1 text-xs text-muted">{new Date(ticket.created_at).toLocaleDateString('tr-TR')}</p>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <span className="rounded-full bg-surface px-2 py-1 font-semibold text-ink">{statusLabels[ticket.category] ?? ticket.category}</span>
                          <span className="rounded-full bg-primary-light/50 px-2 py-1 font-semibold text-primary">{statusLabels[ticket.status] ?? ticket.status}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted">{ticket.message}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-card border border-border bg-surface p-6 text-sm text-muted">
                  Henüz oluşturulmuş bir destek talebiniz yok.
                </div>
              )}
            </div>
          </div>
        ) : null}

        {activeSection === 'security' ? (
          <div className="card space-y-5 p-5">
            <div>
              <h2 className="text-lg font-bold text-ink">Şifre Değiştir & Güvenlik</h2>
              <p className="mt-1 text-sm text-muted">Giriş bilgilerinizin güvenliğini bu bölümden yönetebilirsiniz.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-card border border-border p-4">
                <p className="text-xs text-muted">Giriş yöntemi</p>
                <p className="mt-1 font-semibold text-ink">Telefon numarası ve şifre</p>
              </div>
              <div className="rounded-card border border-border p-4">
                <p className="text-xs text-muted">Kayıtlı telefon</p>
                <p className="mt-1 font-semibold text-ink">{profile.phone || profile.username}</p>
              </div>
              <div className="rounded-card border border-border p-4">
                <p className="text-xs text-muted">Destek durumu</p>
                <p className="mt-1 font-semibold text-ink">{profile.open_support_count} açık talep</p>
              </div>
            </div>

            <form className="grid gap-3 md:grid-cols-2" onSubmit={handlePasswordSubmit}>
              <input type="password" value={passwordForm.current_password} onChange={(event) => setPasswordForm((current) => ({ ...current, current_password: event.target.value }))} className="input-field md:col-span-2" placeholder="Mevcut şifre" required />
              <input type="password" value={passwordForm.new_password} onChange={(event) => setPasswordForm((current) => ({ ...current, new_password: event.target.value }))} className="input-field" placeholder="Yeni şifre" required />
              <input type="password" value={passwordForm.new_password_confirm} onChange={(event) => setPasswordForm((current) => ({ ...current, new_password_confirm: event.target.value }))} className="input-field" placeholder="Yeni şifre tekrar" required />
              {securityError ? <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger md:col-span-2">{securityError}</p> : null}
              {securityStatus ? <p className="rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success md:col-span-2">{securityStatus}</p> : null}
              <div className="md:col-span-2">
                <button type="submit" disabled={isPasswordSaving} className="btn-primary disabled:opacity-70">
                  {isPasswordSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Şifreyi Güncelle
                </button>
              </div>
            </form>

            <div className="rounded-card border border-success/20 bg-success/5 p-4 text-sm text-success">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Şifre güncellendiğinde hesabınız mevcut oturumla açık kalır. Güçlü ve benzersiz bir şifre kullanmanız önerilir.</p>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
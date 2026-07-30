// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import * as XLSX from 'xlsx';
import { 
  Phone, Users, FolderKanban, LogOut, Menu, X, PackagePlus, Layers, ShoppingBag, Download, Bell, BellRing, ShieldCheck, Check, XCircle, FileText, Store, ExternalLink 
} from 'lucide-react';

import EnquiriesTab from '../components/admin/EnquiriesTab';
import CallsTab from '../components/admin/CallsTab';
import StaffTab from '../components/admin/StaffTab';
import ProjectsTab from '../components/admin/ProjectsTab';
import ProductsTab from '../components/admin/ProductsTab';
import CategoriesTab from '../components/admin/CategoriesTab';
import NotificationCenter from '../components/admin/NotificationCenter';
import DashboardModals from '../components/admin/DashboardModals';
import { useAdminData } from '../hooks/useAdminData';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('products');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notification & PWA State
  const [notiPermission, setNotiPermission] = useState('default');
  const [notifications, setNotifications] = useState([]);
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // Modals & Selection State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedCallIds, setSelectedCallIds] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, id: null, title: '', message: '' });

  // Play Notification Tone
  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
    } catch (err) {
      console.error('Audio playback failed', err);
    }
  };

  // Notification Trigger Callback
  const triggerNotification = useCallback(async (categoryName, bodyMessage, targetTab = 'enquiries') => {
    playNotificationSound();
    const title = `🚨 New ${categoryName}!`;
    const formattedBody = `Dear Sir, ${bodyMessage}`;

    setNotifications((prev) => [{ id: Date.now(), title, body: formattedBody, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false, targetTab }, ...prev]);

    if (('Notification' in window) && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          registration.showNotification(title, { body: formattedBody, icon: '/pwa-192x192.png', badge: '/pwa-192x192.png', vibrate: [200, 100, 200], data: { targetTab } });
          return;
        }
      }
      const noti = new Notification(title, { body: formattedBody, icon: '/pwa-192x192.png' });
      noti.onclick = () => { window.focus(); setActiveTab(targetTab); };
    }
  }, []);

  // Custom Data Hook
  const {
    isLoading, callRequests, staffList, projects, products, categories, combinedInquiries, warrantyClaims,
    setProducts, setWarrantyClaims, fetchEnquiries, fetchContactSubmissions, fetchCallRequests, fetchStaff, fetchProjects, fetchProducts, fetchCategories, fetchWarrantyClaims
  } = useAdminData(triggerNotification);

  // Manifest & PWA Lifecycle
  useEffect(() => {
    let manifestLink = document.querySelector('link[rel="manifest"]') || document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    if (!manifestLink.parentNode) document.head.appendChild(manifestLink);

    if ('Notification' in window) setNotiPermission(Notification.permission);

    const handleSWMessage = (e) => { if (e.data?.type === 'NAVIGATE_TAB') setActiveTab(e.data.tab); };
    if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', handleSWMessage);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024) {
        setDeferredPrompt(e);
        setShowInstallBtn(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      if ('serviceWorker' in navigator) navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return alert('Push notifications not supported.');
    const permission = await Notification.requestPermission();
    setNotiPermission(permission);
    if (permission === 'granted') {
      try {
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array('BLY_DF7rxRws6WU_RwoDuSjXC4ko4-Mrx1S3mwxivxZIpawK2PWJBS15Nj1uuhFp1C6nacWPrOfEvpwCdtT4bAs')
        });
        await supabase.from('push_subscriptions').upsert([{ subscription: subscription.toJSON() }]);
        triggerNotification('Inquiries', 'Background alerts enabled successfully!');
      } catch (err) {
        console.error('Error setting up Web Push:', err);
      }
    }
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowInstallBtn(false);
    setDeferredPrompt(null);
  };

  // Export & Action Handlers
  const filterByTime = (items) => {
    if (timeFilter === 'all') return items;
    const now = new Date();
    return items.filter((item) => {
      const itemDate = new Date(item.created_at);
      if (timeFilter === 'today') return itemDate.toDateString() === now.toDateString();
      const diffInDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
      return timeFilter === 'week' ? diffInDays <= 7 : diffInDays <= 30;
    });
  };

  const exportToExcel = (dataToExport, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(filterByTime(dataToExport));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${fileName}_${timeFilter}.xlsx`);
  };

  const toggleFeaturedStatus = async (id, currentStatus) => {
    const { error } = await supabase.from('products').update({ is_featured: !currentStatus }).eq('id', id);
    if (!error) setProducts((prev) => prev.map((item) => item.id === id ? { ...item, is_featured: !currentStatus } : item));
  };

  const toggleProjectStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'RUNNING' ? 'COMPLETED' : 'RUNNING';
    const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', id);
    if (!error) fetchProjects();
  };

  const handleUpdateClaimStatus = async (id, status) => {
    const { error } = await supabase.from('warranty_claims').update({ status }).eq('id', id);
    if (!error) {
      setWarrantyClaims((prev) => prev.map((item) => item.id === id ? { ...item, status } : item));
    }
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteModal;
    let error;
    if (type === 'enquiry') ({ error } = await supabase.from('enquiries').delete().eq('id', id));
    else if (type === 'contact_submission') ({ error } = await supabase.from('contact_submissions').delete().eq('id', id));
    else if (type === 'staff') ({ error } = await supabase.from('staff').delete().eq('id', id));
    else if (type === 'project') ({ error } = await supabase.from('projects').delete().eq('id', id));
    else if (type === 'product') ({ error } = await supabase.from('products').delete().eq('id', id));
    else if (type === 'category') ({ error } = await supabase.from('categories').delete().eq('id', id));
    else if (type === 'warranty_claim') ({ error } = await supabase.from('warranty_claims').delete().eq('id', id));

    if (!error) {
      if (type === 'enquiry') fetchEnquiries();
      else if (type === 'contact_submission') fetchContactSubmissions();
      else if (type === 'staff') fetchStaff();
      else if (type === 'project') fetchProjects();
      else if (type === 'product') fetchProducts();
      else if (type === 'category') fetchCategories();
      else if (type === 'warranty_claim') fetchWarrantyClaims();
    }
    setDeleteModal({ isOpen: false, type: null, id: null, title: '', message: '' });
  };

  const navTabs = [
    { id: 'products', label: 'Products', icon: PackagePlus },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'enquiries', label: 'Inquiries & Forms', icon: ShoppingBag, count: combinedInquiries.length },
    { id: 'warranty', label: 'Warranty Claims', icon: ShieldCheck, count: warrantyClaims.length },
    { id: 'calls', label: 'Call Requests', icon: Phone, count: callRequests.length },
    { id: 'staff', label: 'Staff Directory', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800 shrink-0 z-40">
        <h1 className="text-base font-black text-red-600 tracking-wider">TYTAN ADMIN</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowNotiDropdown(!showNotiDropdown)} className="relative p-2 bg-zinc-800 text-zinc-300 rounded-lg">
            <Bell size={18} />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">{unreadCount}</span>}
          </button>
          {notiPermission !== 'granted' && (
            <button onClick={requestNotificationPermission} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-600 text-white animate-pulse">
              <BellRing size={14} /> <span>Enable Alerts</span>
            </button>
          )}
          {showInstallBtn && (
            <button onClick={handleInstallApp} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg">
              <Download size={14} /> <span>Install</span>
            </button>
          )}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-400">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && <div onClick={() => setMobileMenuOpen(false)} className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-40" />}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between p-5 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 shrink-0 h-full`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-red-600 tracking-wider uppercase">TYTAN DOOR</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Control Panel</p>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-zinc-400"><X size={18} /></button>
          </div>

          <nav className="space-y-1.5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    isActive ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${isActive ? 'bg-white text-red-600' : 'bg-red-600/20 text-red-400 border border-red-500/30'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-800 space-y-2">
          {notiPermission !== 'granted' && (
            <button onClick={requestNotificationPermission} className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-3 rounded-xl bg-amber-600 text-white">
              <BellRing size={16} /> <span>Enable Notifications</span>
            </button>
          )}
          {showInstallBtn && (
            <button onClick={handleInstallApp} className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-zinc-800 text-red-500 py-2.5 px-3 rounded-xl">
              <Download size={16} /> <span>Install Tytan Admin App</span>
            </button>
          )}
          <button onClick={onLogout} className="w-full flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-red-500 hover:bg-zinc-800/50 py-2.5 px-3 rounded-xl">
            <LogOut size={16} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
        <div className="hidden md:flex justify-end items-center mb-6 relative">
          <button onClick={() => setShowNotiDropdown(!showNotiDropdown)} className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl">
            <Bell size={18} className="text-zinc-400" />
            <span className="text-xs font-bold">Notifications</span>
            {unreadCount > 0 && <span className="bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
          </button>
        </div>

        {showNotiDropdown && (
          <NotificationCenter
            notifications={notifications}
            onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
            onClearAll={() => setNotifications([])}
            onNotificationClick={(noti) => {
              setNotifications((prev) => prev.map((n) => n.id === noti.id ? { ...n, read: true } : n));
              setActiveTab(noti.targetTab);
              setShowNotiDropdown(false);
            }}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-full text-zinc-500">
            <p className="animate-pulse font-medium text-sm">Loading Dashboard Data...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {activeTab === 'products' && (
              <ProductsTab products={products} categories={categories} onOpenModal={() => setIsAddProductOpen(true)} onDeleteProduct={(id, name) => setDeleteModal({ isOpen: true, type: 'product', id, title: 'Delete Product', message: `Are you sure you want to delete product "${name}"?` })} onToggleFeatured={toggleFeaturedStatus} onProductUpdated={fetchProducts} />
            )}
            {activeTab === 'categories' && (
              <CategoriesTab categories={categories} onCategoryAdded={fetchCategories} onDeleteCategory={(id, name) => setDeleteModal({ isOpen: true, type: 'category', id, title: 'Delete Category', message: `Are you sure you want to delete category "${name}"?` })} />
            )}
            {activeTab === 'enquiries' && (
              <EnquiriesTab title="Inquiries & Contact Submissions" timeFilter={timeFilter} setTimeFilter={setTimeFilter} filteredEnquiries={filterByTime(combinedInquiries)} onExport={() => exportToExcel(combinedInquiries, 'All_Inquiries')} onDeleteEnquiry={(id, name) => {
                const target = combinedInquiries.find((item) => item.id === id);
                const isSub = target?.sourceType === 'contact_submission';
                setDeleteModal({ isOpen: true, type: isSub ? 'contact_submission' : 'enquiry', id, title: isSub ? 'Delete Submission' : 'Delete Enquiry', message: `Delete entry from ${name || 'user'}?` });
              }} />
            )}
            
            {/* WARRANTY CLAIMS TAB */}
            {activeTab === 'warranty' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="text-red-500" size={24} /> Warranty Claims
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">Manage customer warranty registration, view bills, and process claim approvals.</p>
                  </div>
                  <button onClick={() => exportToExcel(warrantyClaims, 'Warranty_Claims')} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-bold rounded-xl text-zinc-200 transition-all">
                    <Download size={14} /> Export Claims
                  </button>
                </div>

                {warrantyClaims.length === 0 ? (
                  <div className="p-12 text-center bg-zinc-900/50 border border-zinc-800/80 rounded-2xl text-zinc-500 text-sm">
                    No warranty claims recorded yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {warrantyClaims.map((claim) => {
                      const billUrl = claim.bill_url || claim.invoice_url || claim.bill_image || claim.file_url;
                      const dealerName = claim.dealer_name || claim.shop_name || claim.dealer || 'N/A';
                      
                      // Match against fetched products array using product_id foreign key
                      const matchedProduct = products.find((p) => String(p.id) === String(claim.product_id));

                      const productName = 
                        matchedProduct?.title || 
                        matchedProduct?.name || 
                        claim.products?.title || 
                        claim.products?.name || 
                        claim.product_name || 
                        claim.product || 
                        claim.product_title || 
                        claim.item_name || 
                        claim.product_details?.name || 
                        'N/A';

                      const modelNo = claim.model_no || claim.model || claim.serial_number;

                      return (
                        <div key={claim.id} className="p-5 bg-zinc-900 border border-zinc-800/80 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all hover:border-zinc-700/80">
                          
                          {/* Claim Details */}
                          <div className="space-y-2.5 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="font-extrabold text-white text-base">{claim.full_name || claim.name || 'Anonymous Customer'}</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                                claim.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                claim.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {claim.status || 'PENDING'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5 text-xs text-zinc-400">
                              <p className="flex items-center gap-1.5">
                                <Phone size={13} className="text-zinc-500 shrink-0" />
                                <span>Phone:</span> 
                                <span className="text-zinc-200 font-semibold">{claim.phone || claim.mobile || 'N/A'}</span>
                              </p>

                              <p className="flex items-center gap-1.5">
                                <Store size={13} className="text-zinc-500 shrink-0" />
                                <span>Shop / Dealer:</span> 
                                <span className="text-zinc-200 font-semibold">{dealerName}</span>
                              </p>

                              <p className="flex items-center gap-1.5">
                                <PackagePlus size={13} className="text-zinc-500 shrink-0" />
                                <span>Product / Model:</span> 
                                <span className="text-zinc-200 font-semibold">{productName} {modelNo ? `(${modelNo})` : ''}</span>
                              </p>
                            </div>

                            {/* Attached Bill Button */}
                            {billUrl ? (
                              <div className="pt-1">
                                <a 
                                  href={billUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700/80 text-red-400 hover:text-red-300 border border-zinc-700/60 rounded-xl text-xs font-bold transition-all"
                                >
                                  <FileText size={14} />
                                  <span>View Attached Bill / Invoice</span>
                                  <ExternalLink size={12} className="ml-0.5 opacity-70" />
                                </a>
                              </div>
                            ) : (
                              <p className="text-[11px] text-zinc-500 italic">No bill/invoice attached</p>
                            )}

                            {claim.issue_description && (
                              <p className="text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/50">
                                "{claim.issue_description}"
                              </p>
                            )}

                            <p className="text-[10px] text-zinc-500">
                              Submitted: {claim.created_at ? new Date(claim.created_at).toLocaleString() : 'N/A'}
                            </p>

                            {/* Debug helper: Shows actual fields returned by Supabase if productName still defaults to N/A */}
                            {productName === 'N/A' && (
                              <details className="mt-2 text-[10px] text-zinc-500 bg-zinc-950 p-2 rounded border border-zinc-800">
                                <summary className="cursor-pointer text-amber-500 font-mono">Debug raw claim fields</summary>
                                <pre className="mt-1 overflow-x-auto text-[9px] text-zinc-400">
                                  {JSON.stringify(claim, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t border-zinc-800/60 lg:border-t-0">
                            {/* Call Back Button */}
                            {claim.phone && (
                              <a 
                                href={`tel:${claim.phone}`}
                                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold rounded-xl transition-all"
                              >
                                <Phone size={14} /> Call Back
                              </a>
                            )}

                            {/* Approve Button */}
                            <button 
                              onClick={() => handleUpdateClaimStatus(claim.id, 'APPROVED')} 
                              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white text-xs font-bold rounded-xl transition-all"
                            >
                              <Check size={14} /> Approve
                            </button>

                            {/* Reject Button */}
                            <button 
                              onClick={() => handleUpdateClaimStatus(claim.id, 'REJECTED')} 
                              className="flex items-center gap-1.5 px-3 py-2 bg-amber-600/10 border border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-white text-xs font-bold rounded-xl transition-all"
                            >
                              <XCircle size={14} /> Reject
                            </button>

                            {/* Delete Button trigger Modal */}
                            <button 
                              onClick={() => setDeleteModal({ 
                                isOpen: true, 
                                type: 'warranty_claim', 
                                id: claim.id, 
                                title: 'Delete Warranty Claim', 
                                message: `Are you sure you want to permanently delete the warranty claim for "${claim.full_name || claim.name || 'this customer'}"?` 
                              })} 
                              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-colors"
                              title="Delete Warranty Claim"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'calls' && (
              <CallsTab callRequests={callRequests} selectedCallIds={selectedCallIds} onToggleSelect={(id) => setSelectedCallIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])} onDeleteSelected={async () => {
                if (selectedCallIds.length === 0) return;
                await supabase.from('call_requests').delete().in('id', selectedCallIds);
                setSelectedCallIds([]);
                fetchCallRequests();
              }} onCallsUpdated={fetchCallRequests} />
            )}
            {activeTab === 'staff' && (
              <StaffTab staffList={staffList} onOpenModal={() => setIsAddStaffOpen(true)} onDeleteStaff={(id, name) => setDeleteModal({ isOpen: true, type: 'staff', id, title: 'Delete Staff', message: `Delete staff member ${name}?` })} />
            )}
            {activeTab === 'projects' && (
              <ProjectsTab projects={projects} onOpenModal={() => setIsAddProjectOpen(true)} onToggleStatus={toggleProjectStatus} onDeleteProject={(id, name) => setDeleteModal({ isOpen: true, type: 'project', id, title: 'Delete Project', message: `Delete project "${name}"?` })} />
            )}
          </div>
        )}

        <DashboardModals
          isAddProductOpen={isAddProductOpen} setIsAddProductOpen={setIsAddProductOpen} fetchProducts={fetchProducts} categories={categories}
          isAddStaffOpen={isAddStaffOpen} setIsAddStaffOpen={setIsAddStaffOpen} fetchStaff={fetchStaff}
          isAddProjectOpen={isAddProjectOpen} setIsAddProjectOpen={setIsAddProjectOpen} fetchProjects={fetchProjects}
          deleteModal={deleteModal} setDeleteModal={setDeleteModal} onConfirmDelete={handleConfirmDelete}
        />
      </main>
    </div>
  );
}
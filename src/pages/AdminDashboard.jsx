// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import * as XLSX from 'xlsx';
import { 
  Phone, Users, FolderKanban, LogOut, Menu, X, PackagePlus, Layers, ShoppingBag, Download, Bell, BellRing, ShieldCheck 
} from 'lucide-react';

import EnquiriesTab from '../components/admin/EnquiriesTab';
import CallsTab from '../components/admin/CallsTab';
import StaffTab from '../components/admin/StaffTab';
import ProjectsTab from '../components/admin/ProjectsTab';
import ProductsTab from '../components/admin/ProductsTab';
import CategoriesTab from '../components/admin/CategoriesTab';
import WarrantyTab from '../components/admin/WarrantyTab';
import NotificationCenter from '../components/admin/NotificationCenter';
import DashboardModals from '../components/admin/DashboardModals';
import { useAdminData } from '../hooks/useAdminData';

const urlBase64ToUint8Array = (base64) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const rawData = window.atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

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

  const openDeleteModal = (type, id, title, message) => setDeleteModal({ isOpen: true, type, id, title, message });

  const playNotificationSound = () => {
    new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
  };

 const triggerNotification = useCallback(async (categoryName, bodyMessage, targetTab = 'enquiries') => {
  // 1. Play Sound
  playNotificationSound();

  const title = `🚨 New ${categoryName}!`;
  const formattedBody = `Dear Sir, ${bodyMessage}`;

  // 2. Update UI Dropdown State
  setNotifications((prev) => [
    {
      id: Date.now(),
      title,
      body: formattedBody,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetTab
    }, 
    ...prev
  ]);

  // 3. Trigger Native OS Popup
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.showNotification) {
          await reg.showNotification(title, {
            body: formattedBody,
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            vibrate: [200, 100, 200],
            tag: `tytan-${Date.now()}`,
            data: { targetTab }
          });
          return;
        }
      }

      // Fallback popup if SW isn't ready
      const noti = new Notification(title, {
        body: formattedBody,
        icon: '/pwa-192x192.png'
      });
      noti.onclick = () => {
        window.focus();
        setActiveTab(targetTab);
      };
    } catch (err) {
      console.error('Error showing direct notification:', err);
    }
  }
}, []);

  const {
    isLoading, callRequests, staffList, projects, products, categories, combinedInquiries, warrantyClaims,
    setProducts, setWarrantyClaims, fetchEnquiries, fetchContactSubmissions, fetchCallRequests, fetchStaff, fetchProjects, fetchProducts, fetchCategories, fetchWarrantyClaims
  } = useAdminData(triggerNotification);

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

  // FIXED: Instant UI Update + Supabase Sync
  const handleUpdateClaimStatus = async (id, status = 'APPROVED') => {
    const nextStatus = String(status).toUpperCase();
    
    // 1. Immediately update UI state
    setWarrantyClaims((prev) => 
      prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );

    // 2. Sync to Supabase
    const { error } = await supabase.from('warranty_claims').update({ status: nextStatus }).eq('id', id);
    if (error) {
      console.error("Failed to update status in Database:", error);
      fetchWarrantyClaims(); // Revert state if DB update fails
    }
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteModal;
    const deleteTargetMap = {
      enquiry: ['enquiries', fetchEnquiries],
      contact_submission: ['contact_submissions', fetchContactSubmissions],
      staff: ['staff', fetchStaff],
      project: ['projects', fetchProjects],
      product: ['products', fetchProducts],
      category: ['categories', fetchCategories],
      warranty_claim: ['warranty_claims', fetchWarrantyClaims]
    };

    const [table, fetchFn] = deleteTargetMap[type] || [];
    if (table) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (!error && fetchFn) fetchFn();
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
            {navTabs.map(({ id, label, icon: Icon, count }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    isActive ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="shrink-0" />
                    <span className="truncate">{label}</span>
                  </div>
                  {count > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${isActive ? 'bg-white text-red-600' : 'bg-red-600/20 text-red-400 border border-red-500/30'}`}>
                      {count}
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
              <ProductsTab products={products} categories={categories} onOpenModal={() => setIsAddProductOpen(true)} onDeleteProduct={(id, name) => openDeleteModal('product', id, 'Delete Product', `Are you sure you want to delete product "${name}"?`)} onToggleFeatured={toggleFeaturedStatus} onProductUpdated={fetchProducts} />
            )}
            {activeTab === 'categories' && (
              <CategoriesTab categories={categories} onCategoryAdded={fetchCategories} onDeleteCategory={(id, name) => openDeleteModal('category', id, 'Delete Category', `Are you sure you want to delete category "${name}"?`)} />
            )}
            {activeTab === 'enquiries' && (
              <EnquiriesTab title="Inquiries & Contact Submissions" timeFilter={timeFilter} setTimeFilter={setTimeFilter} filteredEnquiries={filterByTime(combinedInquiries)} onExport={() => exportToExcel(combinedInquiries, 'All_Inquiries')} onDeleteEnquiry={(id, name) => {
                const isSub = combinedInquiries.find((item) => item.id === id)?.sourceType === 'contact_submission';
                openDeleteModal(isSub ? 'contact_submission' : 'enquiry', id, isSub ? 'Delete Submission' : 'Delete Enquiry', `Delete entry from ${name || 'user'}?`);
              }} />
            )}
            
            {/* WARRANTY CLAIMS TAB */}
            {activeTab === 'warranty' && (
              <WarrantyTab 
                warrantyClaims={warrantyClaims}
                products={products}
                onUpdateClaimStatus={handleUpdateClaimStatus}
                onDeleteClaim={(id, name) => 
                  openDeleteModal(
                    'warranty_claim', 
                    id, 
                    'Delete Warranty Claim', 
                    `Are you sure you want to delete claim for "${name || 'this customer'}"?`
                  )
                }
                onExport={() => exportToExcel(warrantyClaims, 'Warranty_Claims')}
              />
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
              <StaffTab staffList={staffList} onOpenModal={() => setIsAddStaffOpen(true)} onDeleteStaff={(id, name) => openDeleteModal('staff', id, 'Delete Staff', `Delete staff member ${name}?`)} />
            )}
            {activeTab === 'projects' && (
              <ProjectsTab projects={projects} onOpenModal={() => setIsAddProjectOpen(true)} onToggleStatus={toggleProjectStatus} onDeleteProject={(id, name) => openDeleteModal('project', id, 'Delete Project', `Delete project "${name}"?`)} />
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
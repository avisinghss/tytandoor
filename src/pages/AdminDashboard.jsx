import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import * as XLSX from 'xlsx';
import { 
  Phone, Users, FolderKanban, LogOut, 
  Menu, X, PackagePlus, Layers, ShoppingBag, Download, Bell, BellRing
} from 'lucide-react';

import EnquiriesTab from '../components/admin/EnquiriesTab';
import CallsTab from '../components/admin/CallsTab';
import StaffTab from '../components/admin/StaffTab';
import ProjectsTab from '../components/admin/ProjectsTab';
import ProductsTab from '../components/admin/ProductsTab';
import CategoriesTab from '../components/admin/CategoriesTab';
import AddProductModal from '../components/admin/AddProductModal';
import AddStaffModal from '../components/admin/AddStaffModal';
import AddProjectModal from '../components/admin/AddProjectModal';
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('products');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Notification Permission State
  const [notiPermission, setNotiPermission] = useState('default');

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // Data States
  const [enquiries, setEnquiries] = useState([]);
  const [callRequests, setCallRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Modal Visibility States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  // Filters & Selections
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedCallIds, setSelectedCallIds] = useState([]);

  // Custom Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    id: null,
    title: '',
    message: '',
  });

  // ---------------- 1. DYNAMIC MANIFEST INJECTION FOR ADMIN ROUTE ----------------
  useEffect(() => {
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json';
      document.head.appendChild(manifestLink);
    }

    return () => {
      if (manifestLink && manifestLink.parentNode) {
        manifestLink.parentNode.removeChild(manifestLink);
      }
    };
  }, []);

  // ---------------- 2. PWA INSTALL PROMPT LISTENER (PHONES/TABLETS ONLY) ----------------
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();

      // Restrict install option: check if mobile/tablet user agent OR screen width < 1024px
      const isMobileOrTablet = 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 1024;

      if (isMobileOrTablet) {
        setDeferredPrompt(e);
        setShowInstallBtn(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  // ---------------- 3. NOTIFICATION PERMISSION & HELPER WITH REDIRECT ----------------
  useEffect(() => {
    if ('Notification' in window) {
      setNotiPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop or mobile push notifications.');
      return;
    }

    const permission = await Notification.requestPermission();
    setNotiPermission(permission);

    if (permission === 'granted') {
      triggerNotification('Notifications Enabled!', 'You will now receive instant alerts for new enquiries and calls.', 'enquiries');
    } else {
      alert('Notification permission was denied. Please enable it in your browser settings.');
    }
  };

  const triggerNotification = async (title, body, targetTab = 'enquiries') => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    // Mobile Service Worker notification logic
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          registration.showNotification(title, {
            body,
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            vibrate: [200, 100, 200],
            data: { targetTab }
          });
          return;
        }
      } catch (err) {
        console.error('Service worker notification error:', err);
      }
    }

    // Standard Desktop browser notification with click listener
    const noti = new Notification(title, {
      body,
      icon: '/pwa-192x192.png'
    });

    noti.onclick = () => {
      window.focus();
      setActiveTab(targetTab);
    };
  };

  // ---------------- FETCH DATA ----------------
  const fetchEnquiries = useCallback(async () => {
    const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching enquiries:', error.message);
    else if (data) setEnquiries(data);
  }, []);

  const fetchCallRequests = useCallback(async () => {
    const { data, error } = await supabase.from('call_requests').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching call requests:', error.message);
    else if (data) setCallRequests(data);
  }, []);

  const fetchStaff = useCallback(async () => {
    const { data, error } = await supabase.from('staff').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching staff:', error.message);
    else if (data) setStaffList(data);
  }, []);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching projects:', error.message);
    else if (data) setProjects(data);
  }, []);

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching products:', error.message);
    else if (data) setProducts(data);
  }, []);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching categories:', error.message);
    else if (data) setCategories(data);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchEnquiries(),
        fetchCallRequests(),
        fetchStaff(),
        fetchProjects(),
        fetchProducts(),
        fetchCategories(),
      ]);
      setIsLoading(false);
    };

    fetchAllData();
  }, [fetchEnquiries, fetchCallRequests, fetchStaff, fetchProjects, fetchProducts, fetchCategories]);

  // ---------------- REALTIME SUBSCRIPTION ----------------
  useEffect(() => {
    const enquiriesChannel = supabase
      .channel('realtime_enquiries')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'enquiries' },
        (payload) => {
          setEnquiries((prev) => [payload.new, ...prev]);
          triggerNotification('🚨 New Enquiry Received!', `From: ${payload.new.name || 'New Customer'}`, 'enquiries');
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'call_requests' },
        (payload) => {
          setCallRequests((prev) => [payload.new, ...prev]);
          triggerNotification('📞 New Call Request!', `Phone: ${payload.new.phone || 'New Request'}`, 'calls');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(enquiriesChannel);
    };
  }, []);

  // ---------------- FEATURED TOGGLE ----------------
  const toggleFeaturedStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error("Error toggling featured status:", error.message);
        return;
      }

      setProducts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_featured: !currentStatus } : item
        )
      );
    } catch (err) {
      console.error("Unexpected error in toggleFeaturedStatus:", err);
    }
  };

  // ---------------- FILTER & EXPORT ----------------
  const filterByTime = (items) => {
    if (timeFilter === 'all') return items;
    
    const now = new Date();
    return items.filter((item) => {
      const itemDate = new Date(item.created_at);
      
      if (timeFilter === 'today') {
        return itemDate.toDateString() === now.toDateString();
      }
      
      const diffInTime = now.getTime() - itemDate.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);

      if (timeFilter === 'week') return diffInDays <= 7;
      if (timeFilter === 'month') return diffInDays <= 30;
      return true;
    });
  };

  const exportToExcel = (dataToExport, fileName) => {
    const filtered = filterByTime(dataToExport);
    const worksheet = XLSX.utils.json_to_sheet(filtered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${fileName}_${timeFilter}.xlsx`);
  };

  // ---------------- HANDLERS ----------------
  const toggleSelectCall = (id) => {
    setSelectedCallIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const deleteSelectedCalls = async () => {
    if (selectedCallIds.length === 0) return;
    const { error } = await supabase.from('call_requests').delete().in('id', selectedCallIds);
    if (error) {
      console.error('Error deleting call requests:', error.message);
      return;
    }
    setSelectedCallIds([]);
    fetchCallRequests();
  };

  const handleDeleteEnquiry = (id, name) => {
    setDeleteModal({
      isOpen: true,
      type: 'enquiry',
      id,
      title: 'Delete Enquiry',
      message: `Are you sure you want to delete the enquiry from ${name || 'this user'}?`,
    });
  };

  const handleDeleteStaff = (id, name) => {
    setDeleteModal({
      isOpen: true,
      type: 'staff',
      id,
      title: 'Delete Staff Member',
      message: `Are you sure you want to delete ${name}?`,
    });
  };

  const handleDeleteProject = (id, name) => {
    setDeleteModal({
      isOpen: true,
      type: 'project',
      id,
      title: 'Delete Project',
      message: `Are you sure you want to delete project "${name}"?`,
    });
  };

  const handleDeleteProduct = (id, name) => {
    setDeleteModal({
      isOpen: true,
      type: 'product',
      id,
      title: 'Delete Product',
      message: `Are you sure you want to delete product "${name}"?`,
    });
  };

  const handleDeleteCategory = (id, name) => {
    setDeleteModal({
      isOpen: true,
      type: 'category',
      id,
      title: 'Delete Category',
      message: `Are you sure you want to delete category "${name}"?`,
    });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteModal;
    let error = null;

    if (type === 'enquiry') {
      ({ error } = await supabase.from('enquiries').delete().eq('id', id));
      if (!error) fetchEnquiries();
    } else if (type === 'staff') {
      ({ error } = await supabase.from('staff').delete().eq('id', id));
      if (!error) fetchStaff();
    } else if (type === 'project') {
      ({ error } = await supabase.from('projects').delete().eq('id', id));
      if (!error) fetchProjects();
    } else if (type === 'product') {
      ({ error } = await supabase.from('products').delete().eq('id', id));
      if (!error) fetchProducts();
    } else if (type === 'category') {
      ({ error } = await supabase.from('categories').delete().eq('id', id));
      if (!error) fetchCategories();
    }

    if (error) {
      console.error(`Error deleting ${type}:`, error.message);
    }

    setDeleteModal({ isOpen: false, type: null, id: null, title: '', message: '' });
  };

  const toggleProjectStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'RUNNING' ? 'COMPLETED' : 'RUNNING';
    const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', id);
    if (error) {
      console.error('Error toggling project status:', error.message);
      return;
    }
    fetchProjects();
  };

  const navTabs = [
    { id: 'products', label: 'Products', icon: PackagePlus },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'enquiries', label: 'Enquiries', icon: ShoppingBag, count: enquiries.length },
    { id: 'calls', label: 'Call Requests', icon: Phone, count: callRequests.length },
    { id: 'staff', label: 'Staff Directory', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
  ];

  return (
    <div className="h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800 shrink-0 z-40">
        <h1 className="text-base font-black text-red-600 tracking-wider">TYTAN ADMIN</h1>
        
        <div className="flex items-center gap-2">
          {/* Notification Alert Status Button */}
          <button
            onClick={requestNotificationPermission}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              notiPermission === 'granted'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
            }`}
            title="Enable/Test Notifications"
          >
            {notiPermission === 'granted' ? <Bell size={14} /> : <BellRing size={14} />}
            <span>{notiPermission === 'granted' ? 'Alerts On' : 'Enable Alerts'}</span>
          </button>

          {/* PWA Install Button */}
          {showInstallBtn && (
            <button 
              onClick={handleInstallApp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-md cursor-pointer"
            >
              <Download size={14} />
              <span>Install</span>
            </button>
          )}

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-400 focus:outline-none cursor-pointer">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dark Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-40"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between p-5 transform ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-200 ease-in-out shadow-2xl md:shadow-none shrink-0 h-full`}>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-red-600 tracking-wider uppercase">TYTAN DOOR</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Control Panel</p>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-zinc-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1.5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                      : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${
                      isActive ? 'bg-white text-red-600' : 'bg-red-600/20 text-red-400 border border-red-500/30'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-800 space-y-2">
          {/* Desktop/Tablet Notification Settings Switch */}
          <button
            onClick={requestNotificationPermission}
            className={`w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-3 rounded-xl transition cursor-pointer ${
              notiPermission === 'granted'
                ? 'bg-zinc-800 text-emerald-400 hover:bg-zinc-700'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {notiPermission === 'granted' ? <Bell size={16} /> : <BellRing size={16} />}
            <span>{notiPermission === 'granted' ? 'Notifications Active' : 'Enable Notifications'}</span>
          </button>

          {showInstallBtn && (
            <button
              onClick={handleInstallApp}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-red-500 py-2.5 px-3 rounded-xl transition cursor-pointer"
            >
              <Download size={16} />
              <span>Install Tytan Admin App</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-red-500 hover:bg-zinc-800/50 py-2.5 px-3 rounded-xl transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-zinc-500">
            <p className="animate-pulse font-medium text-sm">Loading Dashboard Data...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {activeTab === 'products' && (
              <ProductsTab
                products={products}
                onOpenModal={() => setIsAddProductOpen(true)}
                onDeleteProduct={handleDeleteProduct}
                onToggleFeatured={toggleFeaturedStatus}
                onProductUpdated={fetchProducts}
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesTab
                categories={categories}
                onCategoryAdded={fetchCategories}
                onDeleteCategory={handleDeleteCategory}
              />
            )}

            {activeTab === 'enquiries' && (
              <EnquiriesTab
                title="Enquiries"
                timeFilter={timeFilter}
                setTimeFilter={setTimeFilter}
                filteredEnquiries={filterByTime(enquiries)}
                onExport={() => exportToExcel(enquiries, 'Enquiries')}
                onDeleteEnquiry={handleDeleteEnquiry}
              />
            )}

            {activeTab === 'calls' && (
              <CallsTab
                callRequests={callRequests}
                selectedCallIds={selectedCallIds}
                onToggleSelect={toggleSelectCall}
                onDeleteSelected={deleteSelectedCalls}
                onCallsUpdated={fetchCallRequests}
              />
            )}

            {activeTab === 'staff' && (
              <StaffTab
                staffList={staffList}
                onOpenModal={() => setIsAddStaffOpen(true)}
                onDeleteStaff={handleDeleteStaff}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsTab
                projects={projects}
                onOpenModal={() => setIsAddProjectOpen(true)}
                onToggleStatus={toggleProjectStatus}
                onDeleteProject={handleDeleteProject}
              />
            )}
          </div>
        )}

        {/* Modals */}
        <AddProductModal
          isOpen={isAddProductOpen}
          onClose={() => setIsAddProductOpen(false)}
          onProductAdded={fetchProducts}
        />

        <AddStaffModal
          isOpen={isAddStaffOpen}
          onClose={() => setIsAddStaffOpen(false)}
          onStaffAdded={fetchStaff}
        />

        <AddProjectModal
          isOpen={isAddProjectOpen}
          onClose={() => setIsAddProjectOpen(false)}
          onProjectAdded={fetchProjects}
        />

        <DeleteConfirmModal
          modalData={deleteModal}
          onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
          onConfirm={handleConfirmDelete}
        />
      </main>
    </div>
  );
}
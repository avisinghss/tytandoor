import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import * as XLSX from 'xlsx';
import { 
  Phone, Users, FolderKanban, LogOut, 
  Menu, X, PackagePlus, Layers, ShoppingBag, Download, Bell, BellRing, Check, Trash2
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

  // Notification Permission & Center State
  const [notiPermission, setNotiPermission] = useState('default');
  const [notifications, setNotifications] = useState([]);
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // Data States
  const [enquiries, setEnquiries] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
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

  // ---------------- 1. DYNAMIC MANIFEST INJECTION ----------------
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

  // ---------------- 2. LISTEN FOR SERVICE WORKER NOTIFICATION CLICKS ----------------
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleSWMessage = (event) => {
        if (event.data && event.data.type === 'NAVIGATE_TAB') {
          setActiveTab(event.data.tab);
        }
      };

      navigator.serviceWorker.addEventListener('message', handleSWMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      };
    }
  }, []);

  // ---------------- 3. PWA INSTALL PROMPT LISTENER ----------------
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();

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

  // ---------------- 4. NOTIFICATION PERMISSION & SOUND TRIGGER ----------------
  useEffect(() => {
    if ('Notification' in window) {
      setNotiPermission(Notification.permission);
    }
  }, []);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {
        // Autoplay restrictions handle fallback
      });
    } catch (err) {
      console.error('Audio playback failed', err);
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support push notifications.');
      return;
    }

    const permission = await Notification.requestPermission();
    setNotiPermission(permission);

    if (permission === 'granted') {
      triggerNotification('Inquiries', 'Dear Sir, You got a new notification active status update.');
    } else {
      alert('Notifications are blocked by Chrome. Please tap the lock icon on your address bar to allow permissions.');
    }
  };

  const triggerNotification = async (categoryName, bodyMessage, targetTab = 'enquiries') => {
    // 1. Play Tone
    playNotificationSound();

    const title = `🚨 New ${categoryName}!`;
    const formattedBody = `Dear Sir, ${bodyMessage}`;

    // 2. Add to In-App Dropdown List
    const newNotiObj = {
      id: Date.now(),
      title,
      body: formattedBody,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetTab
    };
    setNotifications((prev) => [newNotiObj, ...prev]);

    // 3. Show System / Mobile Phone Push Notification
    if (('Notification' in window) && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            registration.showNotification(title, {
              body: formattedBody,
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

      const noti = new Notification(title, {
        body: formattedBody,
        icon: '/pwa-192x192.png'
      });

      noti.onclick = () => {
        window.focus();
        setActiveTab(targetTab);
      };
    }
  };

  // Notification Actions
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (noti) => {
    setNotifications((prev) => prev.map((n) => n.id === noti.id ? { ...n, read: true } : n));
    setActiveTab(noti.targetTab);
    setShowNotiDropdown(false);
  };

  // ---------------- FETCH DATA ----------------
  const fetchEnquiries = useCallback(async () => {
    const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching enquiries:', error.message);
    else if (data) setEnquiries(data);
  }, []);

  const fetchContactSubmissions = useCallback(async () => {
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching contact submissions:', error.message);
    else if (data) setContactSubmissions(data);
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
        fetchContactSubmissions(),
        fetchCallRequests(),
        fetchStaff(),
        fetchProjects(),
        fetchProducts(),
        fetchCategories(),
      ]);
      setIsLoading(false);
    };

    fetchAllData();
  }, [fetchEnquiries, fetchContactSubmissions, fetchCallRequests, fetchStaff, fetchProjects, fetchProducts, fetchCategories]);

  // ---------------- REALTIME SUBSCRIPTION ----------------
  useEffect(() => {
    const enquiriesChannel = supabase
      .channel('realtime_enquiries')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'enquiries' },
        (payload) => {
          setEnquiries((prev) => [payload.new, ...prev]);
          triggerNotification('Enquiry', `You got a new enquiry from ${payload.new.name || 'a customer'}.`, 'enquiries');
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contact_submissions' },
        (payload) => {
          setContactSubmissions((prev) => [payload.new, ...prev]);
          triggerNotification('Contact Submission', `You got a new contact form submission from ${payload.new.name || 'a user'}.`, 'enquiries');
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'call_requests' },
        (payload) => {
          setCallRequests((prev) => [payload.new, ...prev]);
          triggerNotification('Call Request', `You got a new call request for ${payload.new.phone || 'a phone number'}.`, 'calls');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(enquiriesChannel);
    };
  }, []);

  // ---------------- COMBINE INQUIRIES & CONTACT SUBMISSIONS ----------------
  const combinedInquiries = [
    ...enquiries.map((item) => ({ ...item, sourceType: 'enquiry' })),
    ...contactSubmissions.map((item) => ({ ...item, sourceType: 'contact_submission' })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

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

  const handleDeleteCombinedInquiry = (id, name) => {
    const targetItem = combinedInquiries.find((item) => item.id === id);
    const isSubmission = targetItem?.sourceType === 'contact_submission';

    setDeleteModal({
      isOpen: true,
      type: isSubmission ? 'contact_submission' : 'enquiry',
      id,
      title: isSubmission ? 'Delete Contact Submission' : 'Delete Enquiry',
      message: `Are you sure you want to delete the entry from ${name || 'this user'}?`,
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
    } else if (type === 'contact_submission') {
      ({ error } = await supabase.from('contact_submissions').delete().eq('id', id));
      if (!error) fetchContactSubmissions();
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
    { id: 'enquiries', label: 'Inquiries & Forms', icon: ShoppingBag, count: combinedInquiries.length },
    { id: 'calls', label: 'Call Requests', icon: Phone, count: callRequests.length },
    { id: 'staff', label: 'Staff Directory', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800 shrink-0 z-40">
        <h1 className="text-base font-black text-red-600 tracking-wider">TYTAN ADMIN</h1>
        
        <div className="flex items-center gap-2">
          {/* Notification Bell Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotiDropdown(!showNotiDropdown)}
              className="relative p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg cursor-pointer transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Show "Enable Alerts" Button ONLY IF permission is not granted */}
          {notiPermission !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer bg-amber-600 hover:bg-amber-700 text-white animate-pulse"
            >
              <BellRing size={14} />
              <span>Enable Alerts</span>
            </button>
          )}

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
          {/* Show "Enable Notifications" Button ONLY IF permission is NOT granted */}
          {notiPermission !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-3 rounded-xl transition cursor-pointer bg-amber-600 hover:bg-amber-700 text-white"
            >
              <BellRing size={16} />
              <span>Enable Notifications</span>
            </button>
          )}

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
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
        {/* Top Header Desktop Bar (With Notification Dropdown) */}
        <div className="hidden md:flex justify-end items-center mb-6 relative">
          <div className="relative">
            <button
              onClick={() => setShowNotiDropdown(!showNotiDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 rounded-xl cursor-pointer transition"
            >
              <Bell size={18} className="text-zinc-400" />
              <span className="text-xs font-bold">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Global Notification Center Dropdown */}
        {showNotiDropdown && (
          <div className="absolute right-4 md:right-8 top-16 w-80 md:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans">
            <div className="flex items-center justify-between p-3.5 bg-zinc-950 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-red-500" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-200">Notifications Center</h3>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead} 
                    className="text-[11px] font-semibold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Check size={12} /> Mark Read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    onClick={clearAllNotifications} 
                    className="text-[11px] font-semibold text-zinc-400 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={12} /> Clear
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-xs font-medium">
                  No notifications recorded yet.
                </div>
              ) : (
                notifications.map((noti) => (
                  <div
                    key={noti.id}
                    onClick={() => handleNotificationClick(noti)}
                    className={`p-3.5 transition cursor-pointer hover:bg-zinc-800/50 flex flex-col gap-1 ${
                      noti.read ? 'opacity-60 bg-zinc-900' : 'bg-zinc-900/90 border-l-4 border-red-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-500">{noti.title}</span>
                      <span className="text-[10px] text-zinc-500">{noti.time}</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-medium leading-relaxed">{noti.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

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
                title="Inquiries & Contact Submissions"
                timeFilter={timeFilter}
                setTimeFilter={setTimeFilter}
                filteredEnquiries={filterByTime(combinedInquiries)}
                onExport={() => exportToExcel(combinedInquiries, 'All_Inquiries')}
                onDeleteEnquiry={handleDeleteCombinedInquiry}
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
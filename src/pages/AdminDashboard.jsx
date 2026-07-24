import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import * as XLSX from 'xlsx';
import { Phone, Users, FolderKanban, MessageSquare, LogOut, Menu, X, PackagePlus, Layers } from 'lucide-react';

import EnquiriesTab from '../components/admin/EnquiriesTab';
import CallsTab from '../components/admin/CallsTab';
import StaffTab from '../components/admin/StaffTab';
import ProjectsTab from '../components/admin/ProjectsTab';
import ProductsTab from '../components/admin/ProductsTab';
import CategoriesTab from '../components/admin/CategoriesTab'; // Added Category Tab Component
import AddProductModal from '../components/admin/AddProductModal';
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('products');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data States
  const [enquiries, setEnquiries] = useState([]);
  const [callRequests, setCallRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Added Category State

  // Modal Visibility States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

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

  useEffect(() => {
    fetchEnquiries();
    fetchCallRequests();
    fetchStaff();
    fetchProjects();
    fetchProducts();
    fetchCategories(); // Added Fetch Categories
  }, []);

  // ---------------- FETCH DATA ----------------
  const fetchEnquiries = async () => {
    const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (data) setEnquiries(data);
  };

  const fetchCallRequests = async () => {
    const { data } = await supabase.from('call_requests').select('*').order('created_at', { ascending: false });
    if (data) setCallRequests(data);
  };

  const fetchStaff = async () => {
    const { data } = await supabase.from('staff').select('*').order('created_at', { ascending: false });
    if (data) setStaffList(data);
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (data) setCategories(data);
  };

  // ---------------- FILTER & EXPORT ----------------
  const filterByTime = (items) => {
    if (timeFilter === 'all') return items;
    const now = new Date();
    return items.filter((item) => {
      const itemDate = new Date(item.created_at);
      const diffDays = Math.ceil(Math.abs(now - itemDate) / (1000 * 60 * 60 * 24));
      if (timeFilter === 'today') return diffDays <= 1;
      if (timeFilter === 'week') return diffDays <= 7;
      if (timeFilter === 'month') return diffDays <= 30;
      return true;
    });
  };

  const exportToExcel = () => {
    const filtered = filterByTime(enquiries);
    const worksheet = XLSX.utils.json_to_sheet(filtered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");
    XLSX.writeFile(workbook, `Tytan_Door_Enquiries_${timeFilter}.xlsx`);
  };

  // ---------------- HANDLERS ----------------
  const toggleSelectCall = (id) => {
    setSelectedCallIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const deleteSelectedCalls = async () => {
    if (selectedCallIds.length === 0) return;
    await supabase.from('call_requests').delete().in('id', selectedCallIds);
    setSelectedCallIds([]);
    fetchCallRequests();
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
    if (type === 'staff') {
      await supabase.from('staff').delete().eq('id', id);
      fetchStaff();
    } else if (type === 'project') {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    } else if (type === 'product') {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    } else if (type === 'category') {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    }
    setDeleteModal({ isOpen: false, type: null, id: null, title: '', message: '' });
  };

  const toggleProjectStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'RUNNING' ? 'COMPLETED' : 'RUNNING';
    await supabase.from('projects').update({ status: newStatus }).eq('id', id);
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40">
        <h1 className="text-lg font-black text-red-600 tracking-wider">TYTAN ADMIN</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-400">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dark Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-50 w-72 md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between p-6 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out shadow-2xl md:shadow-none`}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-red-600 tracking-wider uppercase">TYTAN DOOR</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Control Panel</p>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-zinc-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'products', label: 'Products Collection', icon: PackagePlus },
              { id: 'categories', label: 'Categories', icon: Layers }, // Category Navigation Added
              { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
              { id: 'calls', label: 'Call Requests', icon: Phone },
              { id: 'staff', label: 'Staff Directory', icon: Users },
              { id: 'projects', label: 'Projects', icon: FolderKanban },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-400 hover:bg-zinc-800/60'}`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-red-500 transition py-2 px-4 cursor-pointer"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Dynamic Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            onOpenModal={() => setIsAddProductOpen(true)}
            onDeleteProduct={handleDeleteProduct}
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
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            filteredEnquiries={filterByTime(enquiries)}
            onExport={exportToExcel}
          />
        )}

        {activeTab === 'calls' && (
          <CallsTab
            callRequests={callRequests}
            selectedCallIds={selectedCallIds}
            onToggleSelect={toggleSelectCall}
            onDeleteSelected={deleteSelectedCalls}
          />
        )}

        {activeTab === 'staff' && (
          <StaffTab
            staffList={staffList}
            onOpenModal={() => {}}
            onDeleteStaff={handleDeleteStaff}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsTab
            projects={projects}
            onOpenModal={() => {}}
            onToggleStatus={toggleProjectStatus}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {/* Global Add Product Modal Popup */}
        <AddProductModal
          isOpen={isAddProductOpen}
          onClose={() => setIsAddProductOpen(false)}
          onProductAdded={fetchProducts}
        />

        {/* Global Confirmation Delete Popup */}
        <DeleteConfirmModal
          modalData={deleteModal}
          onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
          onConfirm={handleConfirmDelete}
        />
      </main>
    </div>
  );
}
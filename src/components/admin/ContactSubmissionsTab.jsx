import React, { useState } from 'react';
import { 
  Eye, Trash2, Download, Calendar, Search, Filter, X, 
  Phone, Mail, ShieldCheck, User, MessageSquare, Clock, 
  CheckCircle, AlertCircle 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../../services/supabaseClient';

export default function ContactSubmissionsTab({ 
  contactSubmissions = [], 
  onSubmissionsUpdated 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Time Filter Helper
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

  const filteredSubmissions = filterByTime(contactSubmissions).filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.includes(searchTerm) ||
      item.message?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || item.inquiry_type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact submission?")) {
      await supabase.from('contact_submissions').delete().eq('id', id);
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
      if (onSubmissionsUpdated) onSubmissionsUpdated();
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'RESOLVED' ? 'NEW' : 'RESOLVED';
    await supabase.from('contact_submissions').update({ status: newStatus }).eq('id', id);
    if (selectedSubmission) {
      setSelectedSubmission((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    if (onSubmissionsUpdated) onSubmissionsUpdated();
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSubmissions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Submissions");
    XLSX.writeFile(workbook, `Tytan_Contact_Submissions_${timeFilter}.xlsx`);
  };

  const getInquiryBadge = (type) => {
    switch (type) {
      case 'Warranty Claim':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'Architect/Builder':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Commercial':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Dealer':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
        <div>
          <h2 className="text-xl font-black text-white tracking-wide">Contact Page Submissions</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Direct messages submitted via the Contact page form & Warranty claims.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl text-xs">
            <Calendar size={14} className="text-zinc-400" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-transparent text-zinc-200 focus:outline-none font-medium cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl text-xs">
            <Filter size={14} className="text-zinc-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-zinc-200 focus:outline-none font-medium cursor-pointer"
            >
              <option value="ALL">All Topics</option>
              <option value="Warranty Claim">Warranty Claim</option>
              <option value="Homeowner">Homeowner</option>
              <option value="Architect/Builder">Architect / Builder</option>
              <option value="Commercial">Commercial</option>
              <option value="Dealer">Dealer Inquiry</option>
            </select>
          </div>

          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition cursor-pointer border border-zinc-700"
          >
            <Download size={14} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Search by client name, email, phone number, or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
        />
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-bold border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Client Name</th>
                <th className="py-3.5 px-4">Topic</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-zinc-500 font-medium">
                    No contact submissions found.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        {item.inquiry_type === 'Warranty Claim' && (
                          <ShieldCheck size={16} className="text-amber-500 shrink-0" />
                        )}
                        <span>{item.name || 'Anonymous'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getInquiryBadge(item.inquiry_type)}`}>
                        {item.inquiry_type || 'General'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <p className="font-medium text-zinc-200">{item.phone}</p>
                      <p className="text-[11px] text-zinc-500">{item.email}</p>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.status === 'RESOLVED' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {item.status || 'NEW'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedSubmission(item)}
                          className="p-1.5 bg-zinc-800 hover:bg-red-600 hover:text-white text-zinc-300 rounded-lg transition cursor-pointer"
                          title="View Message Modal"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-red-400 rounded-lg transition cursor-pointer"
                          title="Delete Submission"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- CONTACT SUBMISSION VIEW MODAL --- */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 space-y-6 shadow-2xl relative">
            
            <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase border ${getInquiryBadge(selectedSubmission.inquiry_type)}`}>
                    {selectedSubmission.inquiry_type || 'Inquiry'}
                  </span>
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(selectedSubmission.created_at).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 pt-1">
                  <User size={18} className="text-red-500" />
                  {selectedSubmission.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                  href={`tel:${selectedSubmission.phone}`}
                  className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800 hover:border-red-600/50 transition group"
                >
                  <div className="p-2 bg-red-600/10 text-red-500 rounded-lg group-hover:bg-red-600 group-hover:text-white transition">
                    <Phone size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Phone</p>
                    <p className="text-xs font-semibold text-zinc-200 truncate">{selectedSubmission.phone || 'N/A'}</p>
                  </div>
                </a>

                <a 
                  href={`mailto:${selectedSubmission.email}`}
                  className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800 hover:border-red-600/50 transition group"
                >
                  <div className="p-2 bg-red-600/10 text-red-500 rounded-lg group-hover:bg-red-600 group-hover:text-white transition">
                    <Mail size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Email</p>
                    <p className="text-xs font-semibold text-zinc-200 truncate">{selectedSubmission.email || 'N/A'}</p>
                  </div>
                </a>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                <p className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-red-500" />
                  Message Content
                </p>
                <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.message || 'No message.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
              <button
                onClick={() => handleStatusChange(selectedSubmission.id, selectedSubmission.status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                  selectedSubmission.status === 'RESOLVED'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {selectedSubmission.status === 'RESOLVED' ? (
                  <><CheckCircle size={14} /> Resolved</>
                ) : (
                  <><AlertCircle size={14} /> Mark Resolved</>
                )}
              </button>

              <button
                onClick={() => handleDelete(selectedSubmission.id)}
                className="px-3.5 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/30 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
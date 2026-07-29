import React from 'react';
import { Download, Trash2, Phone, Mail, MapPin, Calendar, MessageSquare, Tag, Package } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export default function EnquiriesTab({ 
  timeFilter, 
  setTimeFilter, 
  filteredEnquiries = [], 
  onExport, 
  onDeleteEnquiry 
}) {

  // Helper badge styling based on customer / inquiry type
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'Architect/Builder':
      case 'Architect':
      case 'Builder':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Commercial':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Dealer':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'PRODUCT':
      case 'Product Inquiry':
      case 'Product Enquiry':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  // Helper function to resolve the label for user type vs inquiry type
  const getCustomerTypeLabel = (e) => {
    // 1. Get the actual inquiry type sent from database (supports both inquiry_type & inquiryType)
    const typeFromModal = e.inquiry_type || e.inquiryType;

    // 2. If valid enquiry modal type exists and isn't 'PRODUCT', return it directly
    if (typeFromModal && typeFromModal !== 'PRODUCT') {
      return typeFromModal;
    }

    // 3. Fallback checks for user_type or Product Enquiries
    if (e.user_type) return e.user_type;
    if (typeFromModal === 'PRODUCT' || e.product_name) return 'Product Inquiry';

    // 4. Default fallback
    return 'Homeowner';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Customer Enquiries</h2>
            <span className="bg-red-500/10 text-[#e11d23] text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-500/20">
              {filteredEnquiries.length} {filteredEnquiries.length === 1 ? 'Lead' : 'Leads'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Manage incoming category leads, filter timeframe, or export data.</p>
        </div>

        {/* Filter & Export Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-zinc-700 transition cursor-pointer flex-1 sm:flex-none"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <button
            onClick={onExport}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-950/20 cursor-pointer whitespace-nowrap"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Excel Export</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* MOBILE & TABLET CARD VIEW (Visible below 'md' breakpoint) */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {filteredEnquiries.map((e) => {
          const customerType = getCustomerTypeLabel(e);

          return (
            <div key={e.id} className="bg-zinc-900 border border-zinc-800/90 rounded-2xl p-4 space-y-3.5 shadow-lg">
              
              {/* Card Header: Customer Name & Type Badge */}
              <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base">{e.name}</h3>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-0.5">
                    <Calendar size={12} className="text-zinc-500 shrink-0" />
                    <span>{e.created_at ? new Date(e.created_at).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getBadgeStyle(customerType)} shrink-0`}>
                  <Tag size={10} />
                  {customerType}
                </span>
              </div>

              {/* Product Badge if available */}
              {e.product_name && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-950/30 border border-red-500/20 px-3 py-1.5 rounded-xl w-fit">
                  <Package size={13} className="shrink-0" />
                  <span>{e.product_name}</span>
                </div>
              )}

              {/* Contact Info & Location Grid */}
              <div className="grid grid-cols-1 gap-2 text-xs">
                {/* Phone */}
                <div className="flex items-center gap-2 text-zinc-300">
                  <Phone size={13} className="text-zinc-500 shrink-0" />
                  <a href={`tel:${e.phone}`} className="hover:underline font-medium text-white">
                    {e.phone}
                  </a>
                </div>

                {/* Email */}
                {e.email && (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Mail size={13} className="text-zinc-500 shrink-0" />
                    <span className="truncate">{e.email}</span>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-center gap-2 text-zinc-300">
                  <MapPin size={13} className="text-red-500 shrink-0" />
                  <span>{e.city ? `${e.city}, ${e.state || 'UP'}` : 'Location unspecified'}</span>
                </div>
              </div>

              {/* Message Block */}
              {e.message && (
                <div className="bg-zinc-950/60 border border-zinc-800/50 p-2.5 rounded-xl text-xs text-zinc-300">
                  <div className="flex items-start gap-1.5">
                    <MessageSquare size={12} className="text-zinc-500 mt-0.5 shrink-0" />
                    <p className="line-clamp-3 leading-relaxed">{e.message}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/60">
                {/* Direct Call */}
                <a
                  href={`tel:${e.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition text-xs font-semibold"
                >
                  <Phone size={13} />
                  <span>Call</span>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${e.phone?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition text-xs font-semibold"
                >
                  <FaWhatsapp size={14} />
                  <span>WhatsApp</span>
                </a>

                {/* Delete */}
                <button
                  onClick={() => onDeleteEnquiry && onDeleteEnquiry(e.id, e.name)}
                  className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition text-xs font-semibold"
                  title="Delete Enquiry"
                >
                  <Trash2 size={13} />
                </button>
              </div>

            </div>
          );
        })}

        {/* Empty State Mobile */}
        {filteredEnquiries.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500">
            <p className="text-sm font-medium">No enquiries found</p>
            <p className="text-xs text-zinc-600 mt-1">Try changing your timeframe filter or check back later.</p>
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Visible on 'md' screens and up) */}
      <div className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/90 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Location</th>
                <th className="p-4">Inquiry / Product Interest</th>
                <th className="p-4">Message</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredEnquiries.map((e) => {
                const customerType = getCustomerTypeLabel(e);

                return (
                  <tr key={e.id} className="hover:bg-zinc-800/40 transition-colors group">
                    
                    {/* Name */}
                    <td className="p-4 font-bold text-white text-sm">
                      {e.name}
                    </td>

                    {/* Phone & Email */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
                        <Phone size={12} className="text-zinc-500 shrink-0" />
                        <a href={`tel:${e.phone}`} className="hover:underline hover:text-white">
                          {e.phone}
                        </a>
                      </div>
                      {e.email ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-1">
                          <Mail size={11} className="text-zinc-500 shrink-0" />
                          <span className="truncate max-w-[150px]">{e.email}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-600 italic block mt-0.5">No email</span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-zinc-300">
                        <MapPin size={13} className="text-red-500 shrink-0" />
                        <span>{e.city ? `${e.city}, ${e.state || 'UP'}` : '-'}</span>
                      </div>
                    </td>

                    {/* Inquiry Type & Product Interest */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        {/* Customer Type Badge */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getBadgeStyle(customerType)}`}>
                          <Tag size={10} />
                          {customerType}
                        </span>

                        {/* Display Product Badge if available */}
                        {e.product_name && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-950/30 border border-red-500/20 px-2.5 py-1 rounded-lg w-fit">
                            <Package size={12} className="shrink-0" />
                            <span>{e.product_name}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Message */}
                    <td className="p-4 max-w-xs">
                      {e.message ? (
                        <div className="flex items-start gap-1.5 text-zinc-300">
                          <MessageSquare size={12} className="text-zinc-500 mt-0.5 shrink-0" />
                          <p className="line-clamp-2 text-[11px] leading-relaxed">{e.message}</p>
                        </div>
                      ) : (
                        <span className="text-zinc-600 italic text-[11px]">No message provided</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-zinc-400 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-zinc-500 shrink-0" />
                        <span>{e.created_at ? new Date(e.created_at).toLocaleDateString() : '-'}</span>
                      </div>
                    </td>

                    {/* Actions (Call, WhatsApp, Delete) */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Call Quick Action */}
                        <a
                          href={`tel:${e.phone}`}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition cursor-pointer"
                          title="Call Customer"
                        >
                          <Phone size={14} />
                        </a>

                        {/* WhatsApp Quick Action */}
                        <a
                          href={`https://wa.me/${e.phone?.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition cursor-pointer"
                          title="Chat on WhatsApp"
                        >
                          <FaWhatsapp size={14} />
                        </a>

                        {/* Delete Button */}
                        <button
                          onClick={() => onDeleteEnquiry && onDeleteEnquiry(e.id, e.name)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
                          title="Delete Enquiry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {/* Empty State Desktop */}
              {filteredEnquiries.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-zinc-500">
                    <p className="text-sm font-medium">No enquiries found</p>
                    <p className="text-xs text-zinc-600 mt-1">Try changing your timeframe filter or check back later.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
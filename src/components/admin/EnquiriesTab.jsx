import React from 'react';
import { Download } from 'lucide-react';

export default function EnquiriesTab({ timeFilter, setTimeFilter, filteredEnquiries, onExport }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Customer Enquiries</h2>
          <p className="text-xs text-zinc-400">Filter and export incoming product leads</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <button
            onClick={onExport}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Download size={16} />
            <span>Excel Export</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Phone / Email</th>
                <th className="p-4">Location</th>
                <th className="p-4">Product</th>
                <th className="p-4">Message</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {filteredEnquiries.map((e) => (
                <tr key={e.id} className="hover:bg-zinc-800/30">
                  <td className="p-4 font-bold text-white">{e.name}</td>
                  <td className="p-4">
                    <div>{e.phone}</div>
                    <div className="text-[11px] text-zinc-500">{e.email || '-'}</div>
                  </td>
                  <td className="p-4">{e.city ? `${e.city}, ${e.state}` : '-'}</td>
                  <td className="p-4 font-semibold text-red-400">{e.product || 'General'}</td>
                  <td className="p-4 max-w-xs truncate text-zinc-400">{e.message || '-'}</td>
                  <td className="p-4 text-zinc-500">{new Date(e.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filteredEnquiries.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-zinc-500">
                    No enquiries found
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
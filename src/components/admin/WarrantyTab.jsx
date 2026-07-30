// src/components/admin/WarrantyTab.jsx
import React from 'react';
import { ExternalLink, Trash2, ShieldCheck, Check, Clock } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export default function WarrantyTab({ claims, onClaimUpdated, onDeleteClaim }) {

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'PENDING' ? 'VERIFIED' : 'PENDING';
    const { error } = await supabase.from('warranty_claims').update({ status: nextStatus }).eq('id', id);
    if (!error && onClaimUpdated) {
      onClaimUpdated();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Warranty Claims</h2>
          <p className="text-xs text-zinc-400">Review and verify product protection & guarantee requests</p>
        </div>
        <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full font-bold">
          Total: {claims.length}
        </span>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase font-extrabold text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Dealer / Shop</th>
                <th className="p-4">Purchase Date</th>
                <th className="p-4">Receipt Bill</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {claims.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-zinc-500 font-medium">
                    No warranty claims submitted yet.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-zinc-800/40 transition">
                    <td className="p-4">
                      <div className="font-bold text-white">{claim.full_name}</div>
                      <div className="text-[11px] text-zinc-500">{claim.phone}</div>
                    </td>
                    <td className="p-4 text-zinc-300">{claim.dealer_name}</td>
                    <td className="p-4">{new Date(claim.purchase_date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <a
                        href={claim.bill_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:underline font-bold"
                      >
                        <span>View Invoice</span>
                        <ExternalLink size={12} />
                      </a>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleStatusToggle(claim.id, claim.status)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition ${
                          claim.status === 'VERIFIED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {claim.status === 'VERIFIED' ? <Check size={12} /> : <Clock size={12} />}
                        <span>{claim.status}</span>
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onDeleteClaim(claim.id, claim.full_name)}
                        className="p-2 text-zinc-500 hover:text-red-400 transition hover:bg-zinc-800 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
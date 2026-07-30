// src/components/admin/WarrantyTab.jsx
import React from 'react';
import { ShieldCheck, Download } from 'lucide-react';
import ClaimCard from './ClaimCard';

export default function WarrantyTab({
  warrantyClaims = [],
  onUpdateClaimStatus,
  onDeleteClaim,
  onExport
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="text-red-500" size={24} /> Warranty Claims ({warrantyClaims.length})
        </h2>
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs font-bold rounded-xl text-zinc-200"
          >
            <Download size={14} /> Export
          </button>
        )}
      </div>

      {warrantyClaims.length === 0 ? (
        <div className="p-12 text-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 text-sm">
          No warranty claims recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {warrantyClaims.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onApprove={(id, status) => onUpdateClaimStatus && onUpdateClaimStatus(id, status)}
              onReject={(id, status) => onUpdateClaimStatus && onUpdateClaimStatus(id, status)}
              onDelete={onDeleteClaim}
            />
          ))}
        </div>
      )}
    </div>
  );
}
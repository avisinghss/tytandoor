// src/components/admin/ClaimCard.jsx
import React from 'react';
import { Phone, CheckCircle2, XCircle, FileText, ExternalLink, Clock, Trash2, RotateCcw } from 'lucide-react';

export default function ClaimCard({ claim, onApprove, onReject, onDelete }) {
  // Normalize status to uppercase and strip extra spaces
  const currentStatus = claim?.status ? String(claim.status).trim().toUpperCase() : 'PENDING';
  
  // Strict condition checks
  const isApproved = currentStatus === 'APPROVED' || currentStatus === 'VERIFIED';
  const isRejected = currentStatus === 'REJECTED';
  const isPending = !isApproved && !isRejected;

  const phone = claim?.phone || claim?.mobile || 'N/A';
  const invoiceUrl = claim?.bill_url || claim?.invoice_url || claim?.file_url;

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg text-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      {/* Left Details Section */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-bold text-white">
            {claim?.full_name || claim?.name || 'Customer'}
          </h3>

          {/* Status Badges */}
          {isApproved && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Approved
            </span>
          )}
          {isRejected && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
              Rejected
            </span>
          )}

          {isPending && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Pending
            </span>
          )}
        </div>

        {/* Info Rows */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-zinc-400">
          <div>Phone: <strong className="text-zinc-200">{phone}</strong></div>
          <div>Shop / Dealer: <strong className="text-zinc-200">{claim?.dealer_name || claim?.shop || 'N/A'}</strong></div>
          <div>Product / Model: <strong className="text-zinc-200">{claim?.product_name || claim?.model_no || 'N/A'}</strong></div>
        </div>

        {invoiceUrl && (
          <div>
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20"
            >
              <FileText className="w-3.5 h-3.5" /> View Attached Bill / Invoice <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2 self-start md:self-center shrink-0">
        {phone !== 'N/A' && (
          <a
            href={`tel:${phone}`}
            className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" /> Call Back
          </a>
        )}

        {/* BUTTONS LOGIC: Show Approve/Reject ONLY when status is Pending */}
        {isPending ? (
          <>
            <button
              onClick={() => onApprove && onApprove(claim.id, 'APPROVED')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
            </button>

            <button
              onClick={() => onReject && onReject(claim.id, 'REJECTED')}
              className="px-3.5 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" /> Reject
            </button>
          </>
        ) : (
          /* Show Reset Option when Approved or Rejected */
          <button
            onClick={() => onApprove && onApprove(claim.id, 'PENDING')}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-zinc-700"
            title="Reset status back to pending"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}

        {/* Delete Claim Button */}
        {onDelete && (
          <button
            onClick={() => onDelete(claim.id, claim?.full_name || claim?.name)}
            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-xl transition cursor-pointer"
            title="Delete Claim"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
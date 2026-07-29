import React from 'react';
import { Plus, Phone, Edit3, Trash2, UserX, Shield, Hammer, HardHat, User } from 'lucide-react';

// Helper to return role-specific badge styling and icon
function getRoleBadge(role) {
  const normalizedRole = role ? role.toLowerCase() : '';

  if (normalizedRole.includes('manager')) {
    return {
      style: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: <Shield size={10} className="mr-1 inline" />,
    };
  }
  if (normalizedRole.includes('carpenter')) {
    return {
      style: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: <Hammer size={10} className="mr-1 inline" />,
    };
  }
  if (normalizedRole.includes('supervisor') || normalizedRole.includes('engineer')) {
    return {
      style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: <HardHat size={10} className="mr-1 inline" />,
    };
  }

  // Default badge style
  return {
    style: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: <User size={10} className="mr-1 inline" />,
  };
}

export default function StaffTab({ staffList = [], onOpenModal, onDeleteStaff }) {
  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase">Staff Management</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Track and contact site managers, carpenters, and field supervisors</p>
        </div>

        <button
          onClick={() => onOpenModal()}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      {staffList.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-zinc-800/80 text-zinc-500 rounded-xl">
            <UserX size={32} />
          </div>
          <p className="text-sm font-semibold text-zinc-400">No staff members registered</p>
          <p className="text-xs text-zinc-600 max-w-sm">
            Click 'Add Staff Member' above to start building your site team roster.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffList.map((s) => {
            const roleBadge = getRoleBadge(s.role);
            const hasPhone = s.phone && s.phone.trim() !== '';

            return (
              <div
                key={s.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4.5 flex items-center justify-between shadow-md transition-all group"
              >
                {/* Staff Details */}
                <div className="space-y-1.5 pr-2 min-w-0">
                  <h3 className="font-bold text-white text-base truncate group-hover:text-red-400 transition-colors">
                    {s.name}
                  </h3>

                  <span
                    className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${roleBadge.style}`}
                  >
                    {roleBadge.icon}
                    {s.role || 'Staff'}
                  </span>

                  <p className="text-xs text-zinc-400 flex items-center gap-1.5 pt-0.5">
                    <Phone size={12} className="text-zinc-500 shrink-0" />
                    <span className="truncate">{hasPhone ? s.phone : 'No Phone Provided'}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {hasPhone ? (
                    <a
                      href={`tel:${s.phone}`}
                      className="p-2.5 bg-zinc-800 hover:bg-emerald-600 text-zinc-300 hover:text-white rounded-xl transition cursor-pointer"
                      title={`Call ${s.name}`}
                    >
                      <Phone size={15} />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="p-2.5 bg-zinc-800/50 text-zinc-600 rounded-xl cursor-not-allowed"
                      title="No phone number"
                    >
                      <Phone size={15} />
                    </button>
                  )}

                  <button
                    onClick={() => onOpenModal(s)}
                    className="p-2.5 bg-zinc-800 hover:bg-blue-600 text-zinc-300 hover:text-white rounded-xl transition cursor-pointer"
                    title="Edit Staff Member"
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    onClick={() => onDeleteStaff(s.id, s.name)}
                    className="p-2.5 bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white rounded-xl transition cursor-pointer"
                    title="Delete Staff Member"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
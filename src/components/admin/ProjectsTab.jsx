import React from 'react';
import { Plus, Clock, CheckCircle, MapPin, Edit3, Trash2 } from 'lucide-react';

export default function ProjectsTab({ projects, onOpenModal, onToggleStatus, onDeleteProject }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">Project Tracker</h2>
          <p className="text-xs text-zinc-400">Monitor running site door orders and completed installations</p>
        </div>

        <button
          onClick={() => onOpenModal()}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Running Projects */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
            <Clock size={16} /> Running Projects
          </h3>
          {projects.filter((p) => p.status === 'RUNNING').map((p) => (
            <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{p.name}</h4>
                <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={12} className="text-zinc-500" /> {p.location || 'N/A'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleStatus(p.id, p.status)}
                  className="text-xs bg-zinc-800 hover:bg-emerald-600 text-zinc-300 hover:text-white font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => onOpenModal(p)}
                  className="p-1.5 bg-zinc-800 hover:bg-blue-600 text-zinc-300 hover:text-white rounded-lg transition cursor-pointer"
                  title="Edit"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => onDeleteProject(p.id, p.name)}
                  className="p-1.5 bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white rounded-lg transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Completed Projects */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-2">
            <CheckCircle size={16} /> Completed Projects
          </h3>
          {projects.filter((p) => p.status === 'COMPLETED').map((p) => (
            <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between opacity-80">
              <div>
                <h4 className="font-bold text-white text-sm line-through">{p.name}</h4>
                <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={12} className="text-zinc-500" /> {p.location || 'N/A'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleStatus(p.id, p.status)}
                  className="text-xs bg-zinc-800 hover:bg-amber-600 text-zinc-300 hover:text-white font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Reopen
                </button>
                <button
                  onClick={() => onOpenModal(p)}
                  className="p-1.5 bg-zinc-800 hover:bg-blue-600 text-zinc-300 hover:text-white rounded-lg transition cursor-pointer"
                  title="Edit"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => onDeleteProject(p.id, p.name)}
                  className="p-1.5 bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white rounded-lg transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// src/components/admin/AnalyticsTab.jsx
import React, { useMemo } from 'react';
import { Users, Eye, ShoppingBag, PhoneCall, TrendingUp } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';

export default function AnalyticsTab({ visits = [], enquiries = [], callRequests = [] }) {
  
  // Calculate Totals & Metrics
  const totalVisits = visits.length;
  const uniqueVisitors = useMemo(() => {
    return new Set(visits.map(v => v.visitor_id)).size;
  }, [visits]);

  const totalEnquiries = enquiries.length;
  const totalCalls = callRequests.length;

  // Format Chart Data (Grouped by Date for the last 7 days)
  const chartData = useMemo(() => {
    const map = {};

    // Initialize past 7 days with zero counts
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      map[dateKey] = { date: dateKey, visits: 0, enquiries: 0, calls: 0 };
    }

    // Populate Visits
    visits.forEach(v => {
      const key = new Date(v.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (map[key]) map[key].visits += 1;
    });

    // Populate Enquiries
    enquiries.forEach(e => {
      const key = new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (map[key]) map[key].enquiries += 1;
    });

    // Populate Call Requests
    callRequests.forEach(c => {
      const key = new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (map[key]) map[key].calls += 1;
    });

    return Object.values(map);
  }, [visits, enquiries, callRequests]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-white flex items-center gap-2">
        <TrendingUp className="text-red-600" size={24} /> Overview Insights
      </h2>

      {/* 1. TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Page Views" value={totalVisits} icon={Eye} color="text-blue-400" bgColor="bg-blue-500/10" border="border-blue-500/20" />
        <MetricCard title="Unique Visitors" value={uniqueVisitors} icon={Users} color="text-purple-400" bgColor="bg-purple-500/10" border="border-purple-500/20" />
        <MetricCard title="Total Inquiries" value={totalEnquiries} icon={ShoppingBag} color="text-emerald-400" bgColor="bg-emerald-500/10" border="border-emerald-500/20" />
        <MetricCard title="Call Requests" value={totalCalls} icon={PhoneCall} color="text-amber-400" bgColor="bg-amber-500/10" border="border-amber-500/20" />
      </div>

      {/* 2. RECHARTS VISUAL GRAPH */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-base font-bold text-zinc-100 mb-4">Traffic & Conversion Trends (7 Days)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="visits" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVisits)" name="Visits" />
              <Area type="monotone" dataKey="enquiries" stroke="#10b981" fillOpacity={1} fill="url(#colorEnquiries)" name="Enquiries" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. BREAKDOWN TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-base font-bold text-zinc-100 mb-4">Daily Performance Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-bold border-b border-zinc-800 uppercase tracking-wider">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Page Visits</th>
                <th className="p-3">Inquiries Received</th>
                <th className="p-3">Call Requests</th>
                <th className="p-3">Conv. Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {chartData.map((row, idx) => {
                const convRate = row.visits > 0 ? (((row.enquiries + row.calls) / row.visits) * 100).toFixed(1) : 0;
                return (
                  <tr key={idx} className="hover:bg-zinc-800/50 transition">
                    <td className="p-3 font-semibold text-zinc-200">{row.date}</td>
                    <td className="p-3 font-medium text-blue-400">{row.visits}</td>
                    <td className="p-3 font-medium text-emerald-400">{row.enquiries}</td>
                    <td className="p-3 font-medium text-amber-400">{row.calls}</td>
                    <td className="p-3 font-bold text-zinc-200">{convRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color, bgColor, border }) {
  return (
    <div className={`p-4 rounded-2xl border ${border} ${bgColor} flex items-center justify-between`}>
      <div>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</p>
        <p className={`text-2xl font-black ${color} mt-1`}>{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-zinc-900/60 ${color}`}>
        <Icon size={22} />
      </div>
    </div>
  );
}
import React from 'react';
import { ServiceOrder, StatusOS, Part } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Wrench, AlertTriangle, DollarSign } from 'lucide-react';

interface DashboardProps {
  orders: ServiceOrder[];
  inventory: Part[];
}

export const Dashboard: React.FC<DashboardProps> = ({ orders, inventory }) => {
  // Stats
  const openOrders = orders.filter(o => o.status !== StatusOS.CONCLUIDO && o.status !== StatusOS.CANCELADO).length;
  const lowStockItems = inventory.filter(i => i.quantity <= i.minQuantity).length;

  // Calculate potential revenue from open orders
  const potentialRevenue = orders
    .filter(o => o.status !== StatusOS.CANCELADO)
    .reduce((acc, o) => {
      const partsTotal = o.parts.reduce((pAcc, p) => pAcc + (p.quantity * p.unitPrice), 0);
      return acc + partsTotal + o.laborCost;
    }, 0);

  // Chart Data: Status Distribution
  const statusData = Object.values(StatusOS).map(status => ({
    name: status,
    count: orders.filter(o => o.status === status).length
  }));

  const COLORS = ['#00d2b4', '#eab308', '#a855f7', '#22c55e', '#ef4444'];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Visão Geral</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-[#00d2b4]/10 text-[#00d2b4] rounded-full">
            <Wrench size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">O.S. Abertas</p>
            <p className="text-2xl font-bold text-gray-800">{openOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Estoque Baixo</p>
            <p className="text-2xl font-bold text-gray-800">{lowStockItems} itens</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Receita Estimada (Total)</p>
            <p className="text-2xl font-bold text-gray-800">R$ {potentialRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h3 className="text-lg font-bold text-gray-700 mb-6">Status das Ordens</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={10} interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Avisos Recentes</h3>
          {lowStockItems > 0 ? (
            <ul className="space-y-3">
              {inventory.filter(i => i.quantity <= i.minQuantity).map(item => (
                <li key={item.id} className="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  <AlertTriangle size={16} />
                  <span>O produto <b>{item.name}</b> está com estoque crítico ({item.quantity} un).</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Nenhum aviso no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

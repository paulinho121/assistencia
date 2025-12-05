import React, { useState } from 'react';
import { ServiceOrder, StatusOS, Customer, Part } from '../types';
import { Plus, Clock, CheckCircle, AlertCircle, Package } from 'lucide-react';

interface ServiceOrdersProps {
  orders: ServiceOrder[];
  setOrders: React.Dispatch<React.SetStateAction<ServiceOrder[]>>;
  customers: Customer[];
  inventory: Part[];
}

export const ServiceOrders: React.FC<ServiceOrdersProps> = ({ orders, setOrders, customers, inventory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Partial<ServiceOrder>>({});

  // Helpers for form
  const [selectedPartId, setSelectedPartId] = useState('');

  const handleSave = () => {
    if (activeOrder.id) {
      // Update
      setOrders(prev => prev.map(o => o.id === activeOrder.id ? { ...o, ...activeOrder } as ServiceOrder : o));
    } else {
      // Create
      const newOrder: ServiceOrder = {
        ...activeOrder,
        id: `OS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        parts: activeOrder.parts || [],
        status: StatusOS.ABERTO,
        createdAt: new Date().toISOString(),
        laborCost: activeOrder.laborCost || 0,
      } as ServiceOrder;
      setOrders([newOrder, ...orders]);
    }
    setIsModalOpen(false);
    setActiveOrder({});
  };

  const addPartToOrder = () => {
    if (!selectedPartId) return;
    const part = inventory.find(p => p.id === selectedPartId);
    if (!part) return;

    const currentParts = activeOrder.parts || [];
    setActiveOrder({
      ...activeOrder,
      parts: [...currentParts, { partId: part.id, quantity: 1, unitPrice: part.sellPrice }]
    });
    setSelectedPartId('');
  };

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || 'Cliente Desconhecido';

  const getStatusColor = (status: StatusOS) => {
    switch (status) {
      case StatusOS.ABERTO: return 'bg-blue-100 text-blue-700';
      case StatusOS.EM_ANDAMENTO: return 'bg-yellow-100 text-yellow-700';
      case StatusOS.CONCLUIDO: return 'bg-green-100 text-green-700';
      case StatusOS.AGUARDANDO_PECAS: return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Ordens de Serviço</h2>
        <button
          onClick={() => { setActiveOrder({ parts: [] }); setIsModalOpen(true); }}
          className="bg-[#00d2b4] hover:bg-[#00e5c8] text-[#1a1a1a] font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-colors"
        >
          <Plus size={18} /> Nova O.S.
        </button>
      </div>

      <div className="grid gap-6">
        {orders.map(os => {
          const totalParts = os.parts.reduce((acc, p) => acc + (p.unitPrice * p.quantity), 0);
          const total = totalParts + os.laborCost;

          return (
            <div key={os.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-gray-400">#{os.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStatusColor(os.status)}`}>
                      {os.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">{os.deviceModel} - {getCustomerName(os.customerId)}</h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Valor Total</div>
                  <div className="text-xl font-bold text-[#00d2b4]">R$ {total.toFixed(2)}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Defeito Relatado:</p>
                  <p>{os.description}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Laudo Técnico:</p>
                  <p>{os.technicalReport || 'Pendente'}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setActiveOrder(os); setIsModalOpen(true); }}
                  className="px-4 py-2 text-sm font-medium text-[#00d2b4] bg-[#00d2b4]/10 rounded-lg hover:bg-[#00d2b4]/20 transition-colors"
                >
                  Ver Detalhes / Editar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl m-4">
            <h3 className="text-xl font-bold mb-6 border-b pb-2">{activeOrder.id ? 'Editar O.S.' : 'Nova Ordem de Serviço'}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cliente</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={activeOrder.customerId || ''}
                  onChange={e => setActiveOrder({ ...activeOrder, customerId: e.target.value })}
                  disabled={!!activeOrder.id}
                >
                  <option value="">Selecione...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={activeOrder.status || StatusOS.ABERTO}
                  onChange={e => setActiveOrder({ ...activeOrder, status: e.target.value as StatusOS })}
                >
                  {Object.values(StatusOS).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Aparelho / Modelo</label>
                <input
                  className="w-full border rounded-lg p-2"
                  value={activeOrder.deviceModel || ''}
                  onChange={e => setActiveOrder({ ...activeOrder, deviceModel: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Número de Série</label>
                <input
                  className="w-full border rounded-lg p-2"
                  value={activeOrder.serialNumber || ''}
                  onChange={e => setActiveOrder({ ...activeOrder, serialNumber: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Defeito Relatado</label>
                <textarea
                  className="w-full border rounded-lg p-2"
                  rows={2}
                  value={activeOrder.description || ''}
                  onChange={e => setActiveOrder({ ...activeOrder, description: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Laudo Técnico</label>
                <textarea
                  className="w-full border rounded-lg p-2"
                  rows={2}
                  value={activeOrder.technicalReport || ''}
                  onChange={e => setActiveOrder({ ...activeOrder, technicalReport: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <Package size={16} /> Peças e Serviços
              </h4>

              <div className="flex gap-2 mb-3">
                <select
                  className="flex-1 border rounded-lg p-2 text-sm"
                  value={selectedPartId}
                  onChange={e => setSelectedPartId(e.target.value)}
                >
                  <option value="">Adicionar peça...</option>
                  {inventory.map(p => <option key={p.id} value={p.id}>{p.name} - R$ {p.sellPrice}</option>)}
                </select>
                <button
                  onClick={addPartToOrder}
                  className="bg-[#00d2b4] text-[#1a1a1a] font-semibold px-3 py-1 rounded-lg text-sm hover:bg-[#00e5c8] transition-colors"
                >
                  Add
                </button>
              </div>

              <ul className="space-y-2 mb-3">
                {activeOrder.parts?.map((part, idx) => {
                  const partDef = inventory.find(p => p.id === part.partId);
                  return (
                    <li key={idx} className="flex justify-between text-sm bg-white p-2 rounded border">
                      <span>{part.quantity}x {partDef?.name || 'Peça'}</span>
                      <span>R$ {(part.unitPrice * part.quantity).toFixed(2)}</span>
                    </li>
                  )
                })}
              </ul>

              <div className="flex items-center justify-between border-t pt-2">
                <label className="text-sm font-bold">Mão de Obra (R$)</label>
                <input
                  type="number"
                  className="border rounded p-1 w-32 text-right"
                  value={activeOrder.laborCost || 0}
                  onChange={e => setActiveOrder({ ...activeOrder, laborCost: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#00d2b4] text-[#1a1a1a] font-semibold rounded-lg hover:bg-[#00e5c8] transition-colors"
              >
                Salvar Ordem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

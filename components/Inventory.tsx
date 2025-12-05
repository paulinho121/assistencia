import React, { useState } from 'react';
import { Part } from '../types';
import { Plus, Edit2, Trash2, AlertTriangle, Search } from 'lucide-react';
import { productService } from '../services/productService';

interface InventoryProps {
  inventory: Part[];
  setInventory: React.Dispatch<React.SetStateAction<Part[]>>;
}

export const Inventory: React.FC<InventoryProps> = ({ inventory, setInventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Part>>({});

  const filteredInventory = inventory.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (part?: Part) => {
    if (part) {
      setEditingPart(part);
      setFormData(part);
    } else {
      setEditingPart(null);
      setFormData({
        quantity: 0,
        minQuantity: 0,
        costPrice: 0,
        sellPrice: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editingPart) {
        const updated = await productService.update(editingPart.id, formData);
        setInventory(prev => prev.map(p => p.id === editingPart.id ? updated : p));
      } else {
        const newPart = await productService.create(formData as Omit<Part, 'id'>);
        setInventory(prev => [...prev, newPart]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erro ao salvar produto. Verifique o console para mais detalhes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await productService.delete(id);
        setInventory(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Erro ao excluir produto. Verifique o console para mais detalhes.');
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Controle de Estoque</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Novo Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            className="bg-transparent border-none outline-none w-full text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
            <tr>
              <th className="p-4">SKU</th>
              <th className="p-4">Produto</th>
              <th className="p-4">Qtd.</th>
              <th className="p-4">Preço Custo</th>
              <th className="p-4">Preço Venda</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInventory.map((part) => (
              <tr key={part.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-600 text-sm font-mono">{part.sku}</td>
                <td className="p-4 font-medium text-gray-800">{part.name}</td>
                <td className="p-4">{part.quantity}</td>
                <td className="p-4 text-gray-600">R$ {part.costPrice.toFixed(2)}</td>
                <td className="p-4 text-green-600 font-medium">R$ {part.sellPrice.toFixed(2)}</td>
                <td className="p-4">
                  {part.quantity <= part.minQuantity ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                      <AlertTriangle size={12} /> Baixo Estoque
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      OK
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(part)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(part.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{editingPart ? 'Editar Item' : 'Novo Item'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={formData.sku || ''}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço Custo (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border rounded-lg p-2"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço Venda (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border rounded-lg p-2"
                  value={formData.sellPrice}
                  onChange={(e) => setFormData({ ...formData, sellPrice: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

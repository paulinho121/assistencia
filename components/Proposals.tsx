import React, { useState } from 'react';
import { ServiceOrder, Customer, Part, ServiceOrderPart, StatusOS } from '../types';
import { generateCommercialProposal } from '../services/geminiService';
import { Send, Copy, FileText, Printer, Plus, Trash2, User } from 'lucide-react';
import { ProposalHeader } from './ProposalHeader';

interface ProposalsProps {
    orders: ServiceOrder[];
    customers: Customer[];
    inventory: Part[];
}

interface ProposalFormData {
    customerId: string;
    deviceModel: string;
    description: string;
    parts: ServiceOrderPart[];
    laborCost: number;
}

export const Proposals: React.FC<ProposalsProps> = ({ orders, customers, inventory }) => {
    const [formData, setFormData] = useState<ProposalFormData>({
        customerId: '',
        deviceModel: '',
        description: '',
        parts: [],
        laborCost: 0
    });
    const [generatedProposal, setGeneratedProposal] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const selectedCustomer = customers.find(c => c.id === formData.customerId);

    const addPart = () => {
        setFormData({
            ...formData,
            parts: [...formData.parts, { partId: '', quantity: 1, unitPrice: 0 }]
        });
    };

    const removePart = (index: number) => {
        setFormData({
            ...formData,
            parts: formData.parts.filter((_, i) => i !== index)
        });
    };

    const updatePart = (index: number, field: keyof ServiceOrderPart, value: string | number) => {
        const newParts = [...formData.parts];
        newParts[index] = { ...newParts[index], [field]: value };
        setFormData({ ...formData, parts: newParts });
    };

    const calculateTotal = () => {
        const partsTotal = formData.parts.reduce((acc, p) => {
            return acc + (p.quantity * p.unitPrice);
        }, 0);
        return partsTotal + formData.laborCost;
    };

    const handleGenerate = async () => {
        if (!formData.customerId) {
            alert('Selecione um cliente');
            return;
        }

        setIsLoading(true);

        const tempOrder: ServiceOrder = {
            id: 'PROP-' + Date.now(),
            customerId: formData.customerId,
            deviceModel: formData.deviceModel,
            serialNumber: '',
            description: formData.description,
            status: StatusOS.ABERTO,
            parts: formData.parts,
            laborCost: formData.laborCost,
            createdAt: new Date().toISOString()
        };

        if (selectedCustomer) {
            const text = await generateCommercialProposal(tempOrder, selectedCustomer, inventory);
            setGeneratedProposal(text);
        }
        setIsLoading(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedProposal);
        alert('Proposta copiada!');
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <FileText className="text-[#00d2b4]" />
                Gerador de Propostas
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <User size={18} />
                            Dados da Proposta
                        </h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
                            <select
                                value={formData.customerId}
                                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#00d2b4] outline-none"
                            >
                                <option value="">Selecione um cliente</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Modelo do Aparelho</label>
                            <input
                                type="text"
                                value={formData.deviceModel}
                                onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                                placeholder="Ex: iPhone 13, Samsung S21, etc."
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#00d2b4] outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Serviço</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Descreva o problema ou serviço a ser realizado..."
                                rows={3}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#00d2b4] outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">Peças/Serviços</label>
                                <button
                                    onClick={addPart}
                                    className="text-sm text-[#00d2b4] hover:text-[#00e5c8] flex items-center gap-1 font-medium"
                                >
                                    <Plus size={16} /> Adicionar
                                </button>
                            </div>

                            <div className="space-y-2">
                                {formData.parts.map((part, index) => (
                                    <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg">
                                        <div className="flex-1">
                                            <select
                                                value={part.partId}
                                                onChange={(e) => {
                                                    const selectedPart = inventory.find(p => p.id === e.target.value);
                                                    updatePart(index, 'partId', e.target.value);
                                                    if (selectedPart) {
                                                        updatePart(index, 'unitPrice', selectedPart.sellPrice);
                                                    }
                                                }}
                                                className="w-full border rounded p-1 text-sm"
                                            >
                                                <option value="">Selecione uma peça</option>
                                                {inventory.map(item => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name} - R$ {item.sellPrice.toFixed(2)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <input
                                            type="number"
                                            value={part.quantity}
                                            onChange={(e) => updatePart(index, 'quantity', Number(e.target.value))}
                                            placeholder="Qtd"
                                            min="1"
                                            className="w-16 border rounded p-1 text-sm"
                                        />
                                        <input
                                            type="number"
                                            value={part.unitPrice}
                                            onChange={(e) => updatePart(index, 'unitPrice', Number(e.target.value))}
                                            placeholder="Preço"
                                            step="0.01"
                                            className="w-24 border rounded p-1 text-sm"
                                        />
                                        <button
                                            onClick={() => removePart(index)}
                                            className="text-red-600 hover:text-red-700 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mão de Obra (R$)</label>
                            <input
                                type="number"
                                value={formData.laborCost}
                                onChange={(e) => setFormData({ ...formData, laborCost: Number(e.target.value) })}
                                placeholder="0.00"
                                step="0.01"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="bg-[#00d2b4]/10 p-4 rounded-lg border border-[#00d2b4]/30">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-700">Valor Total:</span>
                                <span className="text-2xl font-bold text-[#00d2b4]">
                                    R$ {calculateTotal().toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!formData.customerId || isLoading}
                        className={'w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ' +
                            (!formData.customerId || isLoading
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#00d2b4] to-[#00e5c8] text-[#1a1a1a] shadow-lg hover:shadow-xl hover:scale-[1.02]'
                            )}
                    >
                        {isLoading ? (
                            <>Gerando Proposta...</>
                        ) : (
                            <>
                                <FileText size={24} /> Gerar Proposta
                            </>
                        )}
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-[800px]">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            <FileText size={18} /> Resultado
                        </h3>
                        {generatedProposal && (
                            <div className="flex gap-2">
                                <button
                                    onClick={copyToClipboard}
                                    className="text-sm text-[#00d2b4] font-medium hover:bg-[#00d2b4]/10 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                                >
                                    <Copy size={14} /> Copiar
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="text-sm text-gray-600 font-medium hover:bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-1"
                                >
                                    <Printer size={14} /> Imprimir
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
                        {generatedProposal && selectedCustomer ? (
                            <div className="space-y-6">
                                <ProposalHeader
                                    order={{
                                        id: 'PROP-' + Date.now(),
                                        customerId: formData.customerId,
                                        deviceModel: formData.deviceModel,
                                        serialNumber: '',
                                        description: formData.description,
                                        status: StatusOS.ABERTO,
                                        parts: formData.parts,
                                        laborCost: formData.laborCost,
                                        createdAt: new Date().toISOString()
                                    }}
                                    customer={selectedCustomer}
                                    technician="JONATHAN FERREIRA"
                                />

                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Proposta Comercial</h3>
                                    <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                                        {generatedProposal}
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <FileText size={48} className="mb-4 text-gray-300" />
                                <p>Preencha os dados e clique em gerar</p>
                            </div>
                        )}
                    </div>

                    {generatedProposal && (
                        <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl">
                            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                                <Send size={18} /> Enviar via WhatsApp
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { ServiceOrder, Customer } from '../types';
import { MapPin, Phone, Mail } from 'lucide-react';

interface ProposalHeaderProps {
    order: ServiceOrder;
    customer: Customer;
    technician?: string;
}

export const ProposalHeader: React.FC<ProposalHeaderProps> = ({ order, customer, technician }) => {
    const today = new Date().toLocaleDateString('pt-BR');

    return (
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden print:border-black">
            {/* Top Header with Logo and Locations */}
            <div className="bg-gradient-to-r from-[#1a1a1a] via-[#2d2d2d] to-[#00d2b4] p-4">
                <div className="flex items-center justify-between">
                    {/* Logo Area */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="flex-1 text-center">
                        <div className="bg-white inline-block px-8 py-2 rounded-full">
                            <h1 className="text-[#00d2b4] font-bold text-lg tracking-wide">ASSISTÊNCIA TÉCNICA</h1>
                        </div>
                    </div>

                    {/* Map placeholder */}
                    <div className="w-32 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                        <MapPin className="text-white" size={32} />
                    </div>
                </div>

                {/* Locations */}
                <div className="mt-4 flex justify-center gap-8 text-white text-sm">
                    <div className="text-center">
                        <div className="font-bold">🇧🇷 CEARÁ</div>
                        <div className="text-xs">(85) 3254-4700</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold">• SANTA CATARINA</div>
                        <div className="text-xs">• SÃO PAULO</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold">• MIAMI 🇺🇸</div>
                        <div className="text-xs">+1 (786) 925-6661</div>
                    </div>
                </div>

                {/* Brand Logos Strip */}
                <div className="mt-3 bg-white/90 py-2 px-4 rounded flex items-center justify-center gap-3 flex-wrap">
                    <span className="text-xs font-semibold text-gray-600">Aputure</span>
                    <span className="text-xs font-semibold text-gray-600">SCREAM</span>
                    <span className="text-xs font-semibold text-gray-600">YC ONION</span>
                    <span className="text-xs font-semibold text-gray-600">calibri</span>
                    <span className="text-xs font-semibold text-gray-600">godox</span>
                    <span className="text-xs font-semibold text-gray-600">Accsoon</span>
                    <span className="text-xs font-semibold text-gray-600">D2OFILM</span>
                    <span className="text-xs font-semibold text-gray-600">7artisans</span>
                    <span className="text-xs font-semibold text-gray-600">DEITY</span>
                    <span className="text-xs font-semibold text-gray-600">SWIT</span>
                </div>
            </div>

            {/* Order Information Bar */}
            <div className="bg-gray-100 px-4 py-2 flex items-center justify-between text-sm border-b-2 border-gray-300">
                <div className="flex items-center gap-6">
                    <div>
                        <span className="font-semibold">OS/Org:</span> {order.id}
                    </div>
                    <div>
                        <span className="font-semibold">Data:</span> {today}
                    </div>
                    <div>
                        <span className="font-semibold">Técnico:</span> {technician || 'N/A'}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div>
                        <span className="font-semibold">CONTATO:</span> {customer.phone}
                    </div>
                    <div>
                        <span className="font-semibold">EMAIL:</span> {customer.email}
                    </div>
                    <div>
                        <span className="font-semibold">Data proposta:</span> {today}
                    </div>
                </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-white text-sm">
                <div>
                    <div className="font-semibold text-gray-700">Cliente:</div>
                    <div className="text-gray-900">{customer.name}</div>
                </div>
                <div>
                    <div className="font-semibold text-gray-700">CONTATO:</div>
                    <div className="text-gray-900">{customer.phone}</div>
                </div>
                <div className="row-span-2">
                    <div className="font-semibold text-gray-700">E-MAIL 1:</div>
                    <div className="text-gray-900 break-all">{customer.email}</div>
                </div>

                <div>
                    <div className="font-semibold text-gray-700">Telefone:</div>
                    <div className="text-gray-900">{customer.phone}</div>
                </div>
                <div>
                    <div className="font-semibold text-gray-700">E-MAIL 2:</div>
                    <div className="text-gray-900">-</div>
                </div>

                <div className="col-span-2">
                    <div className="font-semibold text-gray-700">Endereço:</div>
                    <div className="text-gray-900">{customer.address}</div>
                </div>
                <div>
                    <div className="font-semibold text-gray-700">Bairro:</div>
                    <div className="text-gray-900">-</div>
                </div>

                <div>
                    <div className="font-semibold text-gray-700">Município:</div>
                    <div className="text-gray-900">-</div>
                </div>
                <div>
                    <div className="font-semibold text-gray-700">UF:</div>
                    <div className="text-gray-900">-</div>
                </div>
                <div>
                    <div className="font-semibold text-gray-700">Cep:</div>
                    <div className="text-gray-900">-</div>
                </div>

                <div className="col-span-3">
                    <div className="font-semibold text-gray-700">CPF/CNPJ:</div>
                    <div className="text-gray-900">-</div>
                </div>
            </div>
        </div>
    );
};

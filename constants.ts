import { Customer, Part, ServiceOrder, StatusOS } from './types';

export const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-0000', address: 'Rua A, 123' },
  { id: '2', name: 'Maria Oliveira', email: 'maria@email.com', phone: '(11) 98888-1111', address: 'Av B, 456' },
  { id: '3', name: 'Empresa Tech Ltda', email: 'contato@techltda.com', phone: '(11) 3030-4040', address: 'Centro Empresarial, Sala 10' },
];

export const MOCK_INVENTORY: Part[] = [
  { id: '1', name: 'Tela iPhone 13 Original', sku: 'TEL-IP13', costPrice: 400, sellPrice: 800, quantity: 5, minQuantity: 3 },
  { id: '2', name: 'Bateria Samsung S21', sku: 'BAT-S21', costPrice: 150, sellPrice: 350, quantity: 12, minQuantity: 5 },
  { id: '3', name: 'SSD 512GB NVMe', sku: 'SSD-512', costPrice: 200, sellPrice: 450, quantity: 2, minQuantity: 4 },
  { id: '4', name: 'Conector de Carga USB-C', sku: 'CON-USBC', costPrice: 10, sellPrice: 80, quantity: 50, minQuantity: 10 },
];

export const MOCK_SERVICE_ORDERS: ServiceOrder[] = [
  {
    id: 'OS-2023-001',
    customerId: '1',
    deviceModel: 'iPhone 13',
    serialNumber: 'SN12345678',
    description: 'Tela quebrada após queda.',
    technicalReport: 'Necessária troca do display frontal. FaceID intacto.',
    status: StatusOS.ABERTO,
    parts: [],
    laborCost: 0,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: 'OS-2023-002',
    customerId: '2',
    deviceModel: 'Samsung Galaxy S21',
    serialNumber: 'SN87654321',
    description: 'Bateria não segura carga.',
    technicalReport: 'Bateria com ciclos esgotados. Troca recomendada.',
    status: StatusOS.AGUARDANDO_PECAS,
    parts: [{ partId: '2', quantity: 1, unitPrice: 350 }],
    laborCost: 100,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

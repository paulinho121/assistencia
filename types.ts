export enum StatusOS {
  ABERTO = 'Aberto',
  EM_ANDAMENTO = 'Em Andamento',
  AGUARDANDO_PECAS = 'Aguardando Peças',
  CONCLUIDO = 'Concluído',
  CANCELADO = 'Cancelado'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  costPrice: number;
  sellPrice: number;
  quantity: number;
  minQuantity: number;
}

export interface ServiceOrderPart {
  partId: string;
  quantity: number;
  unitPrice: number;
}

export interface ServiceOrder {
  id: string;
  customerId: string;
  deviceModel: string;
  serialNumber: string;
  description: string; // Defeito relatado
  technicalReport?: string; // Laudo técnico
  status: StatusOS;
  parts: ServiceOrderPart[];
  laborCost: number; // Mão de obra
  createdAt: string;
  finishedAt?: string;
}

export interface Proposal {
  id: string;
  serviceOrderId: string;
  generatedText: string;
  totalValue: number;
  createdAt: string;
}

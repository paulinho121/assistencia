import { GoogleGenAI } from "@google/genai";
import { ServiceOrder, Customer, Part } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateCommercialProposal = async (
  os: ServiceOrder,
  customer: Customer,
  partsList: Part[]
): Promise<string> => {
  try {
    // Calculate totals for context
    const partsTotal = os.parts.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0);
    const total = partsTotal + os.laborCost;
    
    // Resolve part names
    const partsDetails = os.parts.map(p => {
      const partDef = partsList.find(i => i.id === p.partId);
      return `- ${p.quantity}x ${partDef?.name || 'Peça Desconhecida'} (R$ ${p.unitPrice.toFixed(2)})`;
    }).join('\n');

    const prompt = `
      Você é um assistente comercial experiente de uma assistência técnica chamada "TechFix Pro".
      Crie uma proposta comercial formal e empática para o cliente.
      
      Dados do Cliente:
      Nome: ${customer.name}
      
      Dados do Aparelho:
      Modelo: ${os.deviceModel}
      Defeito Relatado: ${os.description}
      Laudo Técnico: ${os.technicalReport || 'Em análise'}
      
      Serviços e Peças:
      ${partsDetails}
      Mão de Obra: R$ ${os.laborCost.toFixed(2)}
      
      Total do Orçamento: R$ ${total.toFixed(2)}
      
      Instruções:
      - Use um tom profissional e cortês.
      - Explique brevemente o problema técnico com base no laudo.
      - Liste os custos claramente.
      - Peça aprovação para iniciar o serviço.
      - Formate a resposta como texto simples (sem markdown complexo) ideal para enviar por WhatsApp ou E-mail.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a proposta.";
  } catch (error) {
    console.error("Erro ao gerar proposta com Gemini:", error);
    return "Erro ao conectar com o assistente de IA. Por favor, tente novamente.";
  }
};

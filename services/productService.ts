/// <reference types="vite/client" />
import { supabase } from './supabase';
import { Part } from '../types';

// Map Supabase column names to app types
interface SupabaseProduct {
    id: string;
    name: string;
    sku: string;
    cost_price: number;
    sell_price: number;
    quantity: number;
    min_quantity: number;
}

const mapSupabaseToApp = (product: any): Part => {
    if (!product) {
        throw new Error('Product data is null or undefined');
    }

    return {
        id: product.id || '',
        name: product.name || '',
        sku: product.sku || '',
        costPrice: product.cost_price || 0,
        sellPrice: product.sell_price || 0,
        quantity: product.quantity || 0,
        minQuantity: product.min_quantity || 0,
    };
};

const mapAppToSupabase = (part: Partial<Part>): Partial<SupabaseProduct> => ({
    ...(part.id && { id: part.id }),
    ...(part.name && { name: part.name }),
    ...(part.sku && { sku: part.sku }),
    ...(part.costPrice !== undefined && { cost_price: part.costPrice }),
    ...(part.sellPrice !== undefined && { sell_price: part.sellPrice }),
    ...(part.quantity !== undefined && { quantity: part.quantity }),
    ...(part.minQuantity !== undefined && { min_quantity: part.minQuantity }),
});

export const productService = {
    async getAll(): Promise<Part[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching products:', error);
            throw error;
        }

        if (!data) {
            return [];
        }

        return data.map(mapSupabaseToApp);
    },

    async getById(id: string): Promise<Part | null> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
            throw error;
        }

        return data ? mapSupabaseToApp(data) : null;
    },

    async create(part: Omit<Part, 'id'>): Promise<Part> {
        const supabaseProduct = mapAppToSupabase(part);

        const { data, error } = await supabase
            .from('products')
            .insert([supabaseProduct])
            .select()
            .single();

        if (error) {
            console.error('Error creating product:', error);
            throw error;
        }

        return mapSupabaseToApp(data);
    },

    async update(id: string, part: Partial<Part>): Promise<Part> {
        const supabaseProduct = mapAppToSupabase(part);

        const { data, error } = await supabase
            .from('products')
            .update(supabaseProduct)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating product:', error);
            throw error;
        }

        return mapSupabaseToApp(data);
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
};

/// <reference types="vite/client" />
import { supabase } from './supabase';
import { Customer } from '../types';

export const clientService = {
    async getAll(): Promise<Customer[]> {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }

        return data || [];
    },

    async getById(id: string): Promise<Customer | null> {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching client:', error);
            throw error;
        }

        return data;
    },

    async create(client: Omit<Customer, 'id'>): Promise<Customer> {
        const { data, error } = await supabase
            .from('clients')
            .insert([client])
            .select()
            .single();

        if (error) {
            console.error('Error creating client:', error);
            throw error;
        }

        return data;
    },

    async update(id: string, client: Partial<Customer>): Promise<Customer> {
        const { data, error } = await supabase
            .from('clients')
            .update(client)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating client:', error);
            throw error;
        }

        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting client:', error);
            throw error;
        }
    }
};

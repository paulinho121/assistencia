/// <reference types="vite/client" />
import { supabase } from './supabase';

export interface User {
    id: string;
    email: string;
    name?: string;
}

export const authService = {
    async signUp(email: string, password: string, name: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name
                }
            }
        });

        if (error) {
            console.error('Error signing up:', error);
            throw error;
        }

        return data;
    },

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Error signing in:', error);
            throw error;
        }

        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    },

    async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        return {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name
        };
    },

    onAuthStateChange(callback: (user: User | null) => void) {
        return supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                callback({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name
                });
            } else {
                callback(null);
            }
        });
    }
};

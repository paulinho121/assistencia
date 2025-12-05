import React from 'react';
import { Menu, X } from 'lucide-react';

interface HamburgerButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed top-4 left-4 z-50 p-2 bg-[#00d2b4] text-[#1a1a1a] rounded-lg shadow-lg md:hidden hover:bg-[#00e5c8] transition-colors"
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
    );
};

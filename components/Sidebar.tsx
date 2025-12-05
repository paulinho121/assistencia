import React from 'react';
import { LayoutDashboard, Package, Users, Wrench, FileText, LogOut, User } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, userName }) => {
  const { signOut } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Estoque', icon: Package },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'service-orders', label: 'Ordens de Serviço', icon: Wrench },
    { id: 'proposals', label: 'Propostas (IA)', icon: FileText },
  ];

  const handleLogout = async () => {
    if (window.confirm('Deseja realmente sair?')) {
      await signOut();
    }
  };

  return (
    <div className="w-64 bg-[#1a1a1a] text-white min-h-screen flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-gray-800 flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="h-12 mb-3" />
        <h1 className="text-xl font-bold text-[#00d2b4] text-center">
          Assistência Técnica
        </h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setCurrentTab(item.id)}
                className={'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ' + (currentTab === item.id
                  ? 'bg-[#00d2b4] text-[#1a1a1a] font-bold'
                  : 'text-slate-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {userName && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 mb-3 px-2">
            <div className="w-8 h-8 bg-[#00d2b4] rounded-full flex items-center justify-center">
              <User size={16} className="text-[#1a1a1a]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs text-gray-400">Usuário</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <LogOut size={18} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      )}

      <div className="p-4 border-t border-slate-700 text-xs text-slate-500 text-center">
        v1.0.0
      </div>
    </div>
  );
};

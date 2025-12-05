import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Sidebar } from './components/Sidebar';
import { HamburgerButton } from './components/HamburgerButton';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Customers } from './components/Customers';
import { ServiceOrders } from './components/ServiceOrders';
import { Proposals } from './components/Proposals';
import { MOCK_SERVICE_ORDERS } from './constants';
import { Customer, Part, ServiceOrder } from './types';
import { clientService } from './services/clientService';
import { productService } from './services/productService';

const MainApp: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Centralized State (now fetched from Supabase)
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<Part[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>(MOCK_SERVICE_ORDERS);

  // Fetch data from Supabase on mount
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [clientsData, productsData] = await Promise.all([
            clientService.getAll(),
            productService.getAll()
          ]);
          setCustomers(clientsData);
          setInventory(productsData);
        } catch (error) {
          console.error('Error fetching data from Supabase:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [user]);

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show login/signup if not authenticated
  if (!user) {
    return showSignup ? (
      <Signup onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case 'dashboard':
        return <Dashboard orders={orders} inventory={inventory} />;
      case 'inventory':
        return <Inventory inventory={inventory} setInventory={setInventory} />;
      case 'customers':
        return <Customers customers={customers} setCustomers={setCustomers} />;
      case 'service-orders':
        return <ServiceOrders orders={orders} setOrders={setOrders} customers={customers} inventory={inventory} />;
      case 'proposals':
        return <Proposals orders={orders} customers={customers} inventory={inventory} />;
      default:
        return <Dashboard orders={orders} inventory={inventory} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <HamburgerButton
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userName={user.name || user.email}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 md:ml-64">
        {renderContent()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;

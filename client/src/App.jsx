import { useState, useEffect } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import Footer from './components/Footer';
import { isAuthenticated } from './utils/auth';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [refreshList, setRefreshList] = useState(0);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setActiveTab('create');
  };

  const handleInvoiceCreated = () => {
    setRefreshList(prev => prev + 1);
    setActiveTab('list');
  };

  if (!authenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />
      
      <main className="w-full flex-grow">
        {activeTab === 'create' && (
          <InvoiceForm onInvoiceCreated={handleInvoiceCreated} />
        )}
        {activeTab === 'list' && (
          <InvoiceList key={refreshList} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
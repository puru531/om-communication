import { useState } from 'react';
import { removeToken } from '../utils/auth';

export default function Navbar({ activeTab, setActiveTab, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    onLogout();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-white">Om Communication</h1>
          </div>
          
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-500'
              }`}
            >
              Create Invoice
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'list'
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-500'
              }`}
            >
              View Invoices
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-indigo-100 hover:bg-indigo-500 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-indigo-500">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleTabChange('create')}
              className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-500'
              }`}
            >
              Create Invoice
            </button>
            <button
              onClick={() => handleTabChange('list')}
              className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors ${
                activeTab === 'list'
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-500'
              }`}
            >
              View Invoices
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

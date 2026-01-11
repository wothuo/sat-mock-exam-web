import React from 'react';

import Header from './Header';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}

export default Layout;
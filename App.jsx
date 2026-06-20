import { Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; 
import Sidebar from './components/Sidebar';
import InvoicesList from './components/InvoicesList';
import InvoiceDetails from './components/InvoiceDetails'; 
import InvoiceForm from './components/InvoiceForm';
import './App.css';

const API_URL = 'http://localhost:5000/api/invoices';

function App() {
  const [invoices, setInvoices] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setInvoices(data))
      .catch((err) => console.error('Error fetching invoices:', err));
  }, []);

  const filteredInvoices = invoices.filter(invoice => {
    if (activeFilters.length === 0) return true;
    return activeFilters.includes(invoice.status);
  });

  // 2. CREATE: Send a POST request to save the new invoice
  const handleAddInvoice = async (newInvoice) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice)
      });
      const savedInvoice = await response.json();
      
      // Update state with the database's response
      setInvoices(prevInvoices => [savedInvoice, ...prevInvoices]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to add invoice:', error);
    }
  };

  // 3. DELETE: Send a DELETE request to remove the invoice
  const handleDeleteInvoice = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      
      // Update the UI only after successful deletion
      setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== id));
    } catch (error) {
      console.error('Failed to delete invoice:', error);
    }
  };

  // 4. UPDATE (Full Edit): Send a PUT request with the updated invoice
  const handleEditInvoice = async (updatedInvoice) => {
    try {
      const response = await fetch(`${API_URL}/${updatedInvoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInvoice)
      });
      const data = await response.json();

      setInvoices(prevInvoices => 
        prevInvoices.map(inv => inv.id === data.id ? data : inv)
      );
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to edit invoice:', error);
    }
  };

  // 5. UPDATE (Status Only): Send a PATCH request to change the status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      setInvoices(prevInvoices => 
        prevInvoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv)
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const openNewInvoiceForm = () => {
    setSelectedInvoice(null);
    setIsFormOpen(true);
  };

  const openEditInvoiceForm = (invoice) => {
    setSelectedInvoice(invoice);
    setIsFormOpen(true);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <InvoicesList 
              invoices={filteredInvoices} 
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
              onOpenForm={openNewInvoiceForm}
            />
          } />
          <Route 
            path="/invoice/:id" 
            element={
              <InvoiceDetails 
                invoices={invoices} 
                onDeleteInvoice={handleDeleteInvoice}
                onEditInvoice={openEditInvoiceForm}
                onUpdateStatus={handleUpdateStatus}
              />
            } 
          />
        </Routes>
      </main>

      <InvoiceForm 
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedInvoice(null);
        }}
        onSave={selectedInvoice ? handleEditInvoice : handleAddInvoice}
        invoice={selectedInvoice}
      />
    </div>
  );
}

export default App;
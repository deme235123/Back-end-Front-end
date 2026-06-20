import React from 'react'; 
import InvoiceItem from './InvoiceItem';
import Header from './InvoicesHeader';

const InvoicesList = ({ invoices, activeFilters, setActiveFilters, onOpenForm }) => { 
  if (!invoices || !Array.isArray(invoices)) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="invoices-list">
        {invoices.map((invoice) => (
          <InvoiceItem key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </>
  );
};

export default InvoicesList;
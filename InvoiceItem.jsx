import React from 'react';
import { useNavigate } from 'react-router-dom';

const InvoiceItem = ({ invoice }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const displayDate = invoice.paymentDue || invoice.date || invoice.createdAt;
  const displayClient = invoice.clientName || invoice.client || 'No Name';

  const getInvoiceTotal = () => {
    if (invoice.total !== undefined && !isNaN(Number(invoice.total))) {
      return Number(invoice.total);
    }
    if (invoice.amount !== undefined && !isNaN(Number(invoice.amount))) {
      return Number(invoice.amount);
    }
    
    if (invoice.items && Array.isArray(invoice.items) && invoice.items.length > 0) {
      return invoice.items.reduce((sum, item) => {
        const itemTotal = item.total || (Number(item.quantity || 0) * Number(item.price || 0));
        return sum + (isNaN(Number(itemTotal)) ? 0 : Number(itemTotal));
      }, 0);
    }

    return 0;
  };

  const displayTotal = getInvoiceTotal();

  return (
    <div className="invoice-card" onClick={() => navigate(`/invoice/${invoice.id}`)}>
      <span className="inv-id">
        <span>#</span>{invoice.id}
      </span>
      
      <span className="inv-date">
        Due {formatDate(displayDate)}
      </span>
      
      <span className="inv-client">
        {displayClient}
      </span>
      
      <span className="inv-amount">
        £{displayTotal.toFixed(2)}
      </span>
      
      <div className={`status-tag ${invoice.status || 'pending'}`}>
        <div className="status-dot"></div>
        {invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'Pending'}
      </div>
      
      <button className="purple-arrow-btn">
        <svg width="7" height="10" viewBox="0 0 7 10" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/>
        </svg>
      </button>
    </div>
  );
};

export default InvoiceItem;
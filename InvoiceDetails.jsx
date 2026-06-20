import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const InvoiceDetails = ({ invoices, onDeleteInvoice, onEditInvoice, onUpdateStatus }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="invoice-details-container">
        <button className="back-btn" onClick={() => navigate('/')}>Go Back</button>
        <p style={{ marginTop: '24px', color: '#0c0e16', fontWeight: 'bold' }}>Invoice not found</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No Date';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const getInvoiceTotal = () => {
    if (invoice.total !== undefined && !isNaN(Number(invoice.total))) return Number(invoice.total);
    if (invoice.amount !== undefined && !isNaN(Number(invoice.amount))) return Number(invoice.amount);
    if (invoice.items && Array.isArray(invoice.items)) {
      return invoice.items.reduce((sum, item) => {
        const itemTotal = item.total || (Number(item.quantity || 0) * Number(item.price || 0));
        return sum + (isNaN(Number(itemTotal)) ? 0 : Number(itemTotal));
      }, 0);
    }
    return 0;
  };

  const handleMarkAsPaid = () => {
    if (onUpdateStatus) {
      onUpdateStatus(invoice.id, 'paid');
    }
  };

  const displayTotal = getInvoiceTotal();
  const displayDate = invoice.createdAt || invoice.date;
  const displayDue = invoice.paymentDue || invoice.createdAt;
  const displayClient = invoice.clientName || invoice.client || 'No Name';

  return (
    <div className="invoice-details-container" style={{ padding: '40px 24px', width: '830px', margin: '0 auto' }}>
      <button className="back-btn" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#7c5dfa', fontWeight: 'bold', cursor: 'pointer', marginBottom: '32px' }}>
        Go Back
      </button>

      <div className="details-header-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '24px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 10px 10px -10px rgba(72,84,159,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#858bb2', fontSize: '13px' }}>Status</span>
          <div className={`status-tag ${invoice.status || 'pending'}`}>
            <div className="status-dot"></div>
            {invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'Pending'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="edit-btn" onClick={() => onEditInvoice(invoice)} style={{ background: '#f9fafe', color: '#7e88c3', border: 'none', padding: '16px 24px', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
          <button className="delete-btn" onClick={() => { onDeleteInvoice(invoice.id); navigate('/'); }} style={{ background: '#ec5757', color: '#fff', border: 'none', padding: '16px 24px', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}>Delete</button>
          {invoice.status === 'pending' && (
            <button className="mark-paid-btn" onClick={handleMarkAsPaid} style={{ background: '#7c5dfa', color: '#fff', border: 'none', padding: '16px 24px', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}>Mark as Paid</button>
          )}
        </div>
      </div>

      <div className="details-main-content" style={{ background: '#fff', padding: '48px', borderRadius: '8px', boxShadow: '0 10px 10px -10px rgba(72,84,159,0.1)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '21px' }}>
          <div>
            <h1 style={{ fontSize: '24px', color: '#0c0e16', margin: '0 0 8px 0' }}><span style={{ color: '#888eb0' }}>#</span>{invoice.id}</h1>
            <p style={{ color: '#7e88c3', margin: 0 }}>{invoice.description || 'No description'}</p>
          </div>
          <div style={{ textAlign: 'right', color: '#7e88c3', fontSize: '13px', lineHeight: '1.5' }}>
            <p style={{ margin: 0 }}>{invoice.senderAddress?.street || ''}</p>
            <p style={{ margin: 0 }}>{invoice.senderAddress?.city || ''}</p>
            <p style={{ margin: 0 }}>{invoice.senderAddress?.postCode || ''}</p>
            <p style={{ margin: 0 }}>{invoice.senderAddress?.country || ''}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div>
            <div style={{ marginBottom: '32px' }}>
              <span style={{ color: '#7e88c3', fontSize: '13px', display: 'block', marginBottom: '12px' }}>Invoice Date</span>
              <strong style={{ color: '#0c0e16', fontSize: '15px' }}>{formatDate(displayDate)}</strong>
            </div>
            <div>
              <span style={{ color: '#7e88c3', fontSize: '13px', display: 'block', marginBottom: '12px' }}>Payment Due</span>
              <strong style={{ color: '#0c0e16', fontSize: '15px' }}>{formatDate(displayDue)}</strong>
            </div>
          </div>

          <div>
            <span style={{ color: '#7e88c3', fontSize: '13px', display: 'block', marginBottom: '12px' }}>Bill To</span>
            <strong style={{ color: '#0c0e16', fontSize: '15px', display: 'block', marginBottom: '12px' }}>{displayClient}</strong>
            <div style={{ color: '#7e88c3', fontSize: '13px', lineHeight: '1.5' }}>
              <p style={{ margin: 0 }}>{invoice.clientAddress?.street || ''}</p>
              <p style={{ margin: 0 }}>{invoice.clientAddress?.city || ''}</p>
              <p style={{ margin: 0 }}>{invoice.clientAddress?.postCode || ''}</p>
              <p style={{ margin: 0 }}>{invoice.clientAddress?.country || ''}</p>
            </div>
          </div>

          <div>
            <span style={{ color: '#7e88c3', fontSize: '13px', display: 'block', marginBottom: '12px' }}>Sent to</span>
            <strong style={{ color: '#0c0e16', fontSize: '15px', wordBreak: 'break-all' }}>{invoice.clientEmail || 'No Email'}</strong>
          </div>
        </div>

        <div style={{ background: '#f9fafe', borderRadius: '8px 8px 0 0', padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '4fr 1fr 2fr 2fr', color: '#7e88c3', fontSize: '13px', marginBottom: '24px' }}>
            <span>Item Name</span>
            <span style={{ textAlign: 'center' }}>QTY.</span>
            <span style={{ textAlign: 'right' }}>Price</span>
            <span style={{ textAlign: 'right' }}>Total</span>
          </div>

          {invoice.items && Array.isArray(invoice.items) && invoice.items.map((item, idx) => {
            const itemPrice = Number(item.price || 0);
            const itemQty = Number(item.quantity || 0) || Number(item.qty || 0);
            const itemTotal = item.total || (itemPrice * itemQty);
            
            return (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '4fr 1fr 2fr 2fr', color: '#0c0e16', fontWeight: 'bold', fontSize: '15px', marginBottom: '24px' }}>
                <span style={{ color: '#0c0e16' }}>{item.name || 'Untitled Item'}</span>
                <span style={{ textAlign: 'center', color: '#7e88c3' }}>{itemQty}</span>
                <span style={{ textAlign: 'right', color: '#7e88c3' }}>£{itemPrice.toFixed(2)}</span>
                <span style={{ textAlign: 'right' }}>£{Number(itemTotal).toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: '#373b53', borderRadius: '0 0 8px 8px', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
          <span style={{ fontSize: '13px' }}>Amount Due</span>
          <strong style={{ fontSize: '24px' }}>£{displayTotal.toFixed(2)}</strong>
        </div>

      </div>
    </div>
  );
};

export default InvoiceDetails;
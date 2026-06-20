import React, { useState } from 'react';

const InvoiceCreate = ({ isOpen, onClose, onSave }) => {
  const emptyInvoice = {
    clientName: '',
    clientEmail: '',
    createdAt: new Date().toISOString().split('T')[0],
    paymentTerms: '30',
    description: '',
    status: 'pending',
    senderAddress: { street: '', city: '', postCode: '', country: '' },
    clientAddress: { street: '', city: '', postCode: '', country: '' },
    items: [],
    total: 0
  };

  const [formData, setFormData] = useState(emptyInvoice);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, price: 0, total: 0 }]
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = formData.items.map((item, idx) => {
      if (idx === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          const qty = field === 'quantity' ? Number(value) : Number(item.quantity);
          const prc = field === 'price' ? Number(value) : Number(item.price);
          updatedItem.total = qty * prc;
        }
        return updatedItem;
      }
      return item;
    });

    setFormData({
      ...formData,
      items: updatedItems,
      total: updatedItems.reduce((sum, item) => sum + (item.total || 0), 0)
    });
  };

  const calculatePaymentDue = (dateStr, terms) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + Number(terms));
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (status) => {
    const generatedId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const finalData = {
      ...formData,
      id: generatedId,
      status: status,
      paymentDue: calculatePaymentDue(formData.createdAt, formData.paymentTerms)
    };
    onSave(finalData);
    setFormData(emptyInvoice);
    onClose();
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="form-heading">New Invoice</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('pending'); }}>
          <div className="form-actions-container">
            <button type="button" className="discard-btn" onClick={onClose}>Discard</button>
            <div className="right-actions">
              <button type="button" className="draft-btn" onClick={() => handleSubmit('draft')}>Save as Draft</button>
              <button type="submit" className="save-send-btn">Save & Send</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceCreate;
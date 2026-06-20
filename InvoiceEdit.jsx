import React, { useState, useEffect } from 'react';

const InvoiceEdit = ({ isOpen, onClose, onSave, invoice }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (invoice) {
      setFormData({ ...invoice });
    }
  }, [invoice, isOpen]);

  if (!isOpen || !formData) return null;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      paymentDue: calculatePaymentDue(formData.createdAt, formData.paymentTerms)
    };
    onSave(finalData);
    onClose();
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="form-heading">Edit #{formData.id}</h2>
        <form onSubmit={handleSubmit}>
          {/* ... ინპუტები უცვლელია ... */}
          <div className="form-actions-container">
            <button type="button" className="discard-btn" onClick={onClose}>Cancel</button>
            <div className="right-actions">
              <button type="submit" className="save-send-btn">Save Changes</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceEdit;
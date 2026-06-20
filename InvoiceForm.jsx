import React, { useState, useEffect } from 'react';

const InvoiceForm = ({ isOpen, onClose, onSave, invoice }) => {
  const emptyInvoice = {
    id: '',
    clientName: '',
    clientEmail: '',
    createdAt: new Date().toISOString().split('T')[0],
    paymentTerms: '30',
    paymentDue: '',
    description: '',
    status: 'pending',
    senderAddress: { street: '', city: '', postCode: '', country: '' },
    clientAddress: { street: '', city: '', postCode: '', country: '' },
    items: [],
    total: 0
  };

  const [formData, setFormData] = useState(emptyInvoice);

  useEffect(() => {
    if (isOpen) {
      if (invoice) {
        const formatInvoiceDate = (dateStr) => {
          if (!dateStr) return new Date().toISOString().split('T')[0];
          const parsedDate = new Date(dateStr);
          if (isNaN(parsedDate.getTime())) return new Date().toISOString().split('T')[0];
          return parsedDate.toISOString().split('T')[0];
        };

        setFormData({
          ...emptyInvoice,
          ...invoice,
          clientName: invoice.clientName || invoice.client || '',
          createdAt: invoice.createdAt || formatInvoiceDate(invoice.date),
          senderAddress: {
            ...emptyInvoice.senderAddress,
            ...(invoice.senderAddress || {})
          },
          clientAddress: {
            ...emptyInvoice.clientAddress,
            ...(invoice.clientAddress || {})
          },
          items: (invoice.items || []).map(item => ({
            name: item.name || '',
            quantity: item.quantity ?? item.qty ?? 1,
            price: item.price || 0,
            total: item.total || (Number(item.qty || 1) * Number(item.price || 0))
          }))
        });
      } else {
        setFormData(emptyInvoice);
      }
    }
  }, [invoice, isOpen]);

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

    const newTotal = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0);

    setFormData({
      ...formData,
      items: updatedItems,
      total: newTotal
    });
  };

  const handleDeleteItem = (index) => {
    const updatedItems = formData.items.filter((_, idx) => idx !== index);
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0);
    setFormData({
      ...formData,
      items: updatedItems,
      total: newTotal
    });
  };

  const calculatePaymentDue = (dateStr, terms) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + Number(terms));
    return date.toISOString().split('T')[0];
  };

  const prepareDataAndSave = (forcedStatus = null) => {
    const generatedId = formData.id || Math.random().toString(36).substring(2, 8).toUpperCase();
    const computedDue = calculatePaymentDue(formData.createdAt, formData.paymentTerms);
    
    let finalStatus = formData.status;
    if (forcedStatus) {
      finalStatus = forcedStatus;
    } else if (!formData.id) {
      finalStatus = 'pending';
    }

    const finalData = {
      ...formData,
      id: generatedId,
      status: finalStatus,
      paymentDue: computedDue
    };

    onSave(finalData);
    onClose();
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="form-heading">{invoice ? `Edit #${invoice.id}` : 'New Invoice'}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); prepareDataAndSave(); }}>
          
          <div className="form-section">
            <p className="section-title">Bill From</p>
            <div className="input-group">
              <label>Street Address</label>
              <input type="text" required value={formData.senderAddress?.street || ''} onChange={(e) => setFormData({...formData, senderAddress: {...formData.senderAddress, street: e.target.value}})}/>
            </div>
            <div className="input-grid-3">
              <div className="input-group"><label>City</label><input type="text" required value={formData.senderAddress?.city || ''} onChange={(e) => setFormData({...formData, senderAddress: {...formData.senderAddress, city: e.target.value}})}/></div>
              <div className="input-group"><label>Post Code</label><input type="text" required value={formData.senderAddress?.postCode || ''} onChange={(e) => setFormData({...formData, senderAddress: {...formData.senderAddress, postCode: e.target.value}})}/></div>
              <div className="input-group"><label>Country</label><input type="text" required value={formData.senderAddress?.country || ''} onChange={(e) => setFormData({...formData, senderAddress: {...formData.senderAddress, country: e.target.value}})}/></div>
            </div>
          </div>

          <div className="form-section">
            <p className="section-title">Bill To</p>
            <div className="input-group">
              <label>Client's Name</label>
              <input type="text" required value={formData.clientName || ''} onChange={(e) => setFormData({...formData, clientName: e.target.value})}/>
            </div>
            <div className="input-group">
              <label>Client's Email</label>
              <input type="email" required value={formData.clientEmail || ''} onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}/>
            </div>
            <div className="input-group">
              <label>Street Address</label>
              <input type="text" required value={formData.clientAddress?.street || ''} onChange={(e) => setFormData({...formData, clientAddress: {...formData.clientAddress, street: e.target.value}})}/>
            </div>
            <div className="input-grid-3">
              <div className="input-group"><label>City</label><input type="text" required value={formData.clientAddress?.city || ''} onChange={(e) => setFormData({...formData, clientAddress: {...formData.clientAddress, city: e.target.value}})}/></div>
              <div className="input-group"><label>Post Code</label><input type="text" required value={formData.clientAddress?.postCode || ''} onChange={(e) => setFormData({...formData, clientAddress: {...formData.clientAddress, postCode: e.target.value}})}/></div>
              <div className="input-group"><label>Country</label><input type="text" required value={formData.clientAddress?.country || ''} onChange={(e) => setFormData({...formData, clientAddress: {...formData.clientAddress, country: e.target.value}})}/></div>
            </div>
          </div>

          <div className="form-section">
            <div className="input-grid-2">
              <div className="input-group">
                <label>Invoice Date</label>
                <input type="date" value={formData.createdAt || ''} onChange={(e) => setFormData({...formData, createdAt: e.target.value})}/>
              </div>
              <div className="input-group">
                <label>Payment Terms</label>
                <select value={formData.paymentTerms || '30'} onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}>
                  <option value="1">Net 1 Day</option>
                  <option value="7">Net 7 Days</option>
                  <option value="14">Net 14 Days</option>
                  <option value="30">Net 30 Days</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>Project Description</label>
              <input type="text" required value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})}/>
            </div>
          </div>

          <div className="form-section item-list-section">
            <h3 className="item-list-title">Item List</h3>
            
            {formData.items.length > 0 && (
              <div className="item-headers-grid">
                <span className="item-header-lbl">Item Name</span>
                <span className="item-header-lbl">Qty.</span>
                <span className="item-header-lbl">Price</span>
                <span className="item-header-lbl">Total</span>
                <span></span>
              </div>
            )}
            
            {formData.items.map((item, index) => (
              <div key={index} className="item-row-grid">
                <div className="input-group no-label">
                  <input type="text" required value={item.name || ''} onChange={(e) => handleItemChange(index, 'name', e.target.value)}/>
                </div>
                {/* პედინგის შეზღუდვა სტილით უშუალოდ Qty და Price ინფუთებზე */}
                <div className="input-group no-label">
                  <input type="number" min="1" required style={{ padding: '16px 8px' }} value={item.quantity ?? 1} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}/>
                </div>
                <div className="input-group no-label">
                  <input type="number" min="0" step="0.01" required style={{ padding: '16px 8px' }} value={item.price ?? 0} onChange={(e) => handleItemChange(index, 'price', e.target.value)}/>
                </div>
                <div className="item-total-display">
                  <span>£{(item.total || 0).toFixed(2)}</span>
                </div>
                <button type="button" className="delete-item-btn" onClick={() => handleDeleteItem(index)}>
                  <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M11.583 3.556v10.666c0 .928-.753 1.678-1.68 1.678H3.096c-.928 0-1.68-.75-1.68-1.678V3.556h10.167zM9.473 0l1.054 1.056H13v2H0v-2h2.473L3.527 0h5.946z" fill="#888EB0"/></svg>
                </button>
              </div>
            ))}

            <button type="button" className="add-item-btn" onClick={handleAddItem}>
              + Add New Item
            </button>
          </div>

          <div className="form-actions-container">
            <button type="button" className="discard-btn" onClick={onClose}>Discard</button>
            <div className="right-actions">
              <button type="button" className="draft-btn" onClick={() => prepareDataAndSave('draft')}>Save as Draft</button>
              <button type="submit" className="save-send-btn">Save & Send</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
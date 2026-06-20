import React, { useState } from 'react';

const InvoicesHeader = ({ count, activeFilters, setActiveFilters, onNewInvoice }) => {
  const [isOpen, setIsOpen] = useState(false);

  const statuses = ['draft', 'pending', 'paid'];

  const handleFilterChange = (status) => {
    if (activeFilters.includes(status)) {
      setActiveFilters(activeFilters.filter((s) => s !== status));
    } else {
      setActiveFilters([...activeFilters, status]);
    }
  };

  return (
    <header className="invoices-header">
      <div className="header-text">
        <h1 className="header-title">Invoices</h1>
        <p className="header-subtitle">
          {count > 0 ? `There are ${count} total invoices` : 'No invoices'}
        </p>
      </div>

      <div className="header-controls">
        <div className="filter-dropdown-container">
          <div className="filter-trigger" onClick={() => setIsOpen(!isOpen)}>
            <span className="filter-text">Filter by status</span>
            <svg
              className={isOpen ? 'arrow-up' : ''}
              width="11" height="7" xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" fill="none" />
            </svg>
          </div>

          {isOpen && (
            <div className="filter-menu">
              {statuses.map((status) => (
                <label key={status} className="filter-option">
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(status)}
                    onChange={() => handleFilterChange(status)}
                  />
                  <span className="checkmark"></span>
                  <span className="status-name">{status}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button className="new-invoice-btn" onClick={onNewInvoice}>
          <div className="plus-icon-container">
            <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.313 10.035v-3.722h3.722V4.313H6.313V.591H4.313v3.722H.591v2h3.722v3.722h2z" fill="#7C5DFA" fillRule="nonzero"/>
            </svg>
          </div>
          <span className="btn-text">New Invoice</span>
        </button>
      </div>
    </header>
  );
};

export default InvoicesHeader;
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  postCode: String,
  country: String
}, { _id: false });

const itemSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  price: Number,
  total: Number
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: String,
  paymentDue: String,
  client: String,
  clientEmail: String,
  description: String,
  senderAddress: addressSchema,
  clientAddress: addressSchema,
  status: { type: String, enum: ['paid', 'pending', 'draft'], default: 'draft' },
  items: [itemSchema],
  amount: String
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
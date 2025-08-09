const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: String },
  sujet: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });  // ➜ ajoute createdAt et updatedAt automatiques


module.exports = mongoose.model('Message', messageSchema);

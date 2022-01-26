// Import des packages requis

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Creation du schema pour les utilisateurs, puis son exports

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
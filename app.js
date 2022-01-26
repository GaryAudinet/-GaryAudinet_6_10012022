// Import de : Express, Dotenv, Helmet, path, mongoose, et les routes

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();
const helmet = require('helmet');
app.use(helmet());

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// Connection à la base de donnée, et ajout du CORS

mongoose.connect(process.env.MONGODB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Transformation de la requete en json, et appel des routes

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;
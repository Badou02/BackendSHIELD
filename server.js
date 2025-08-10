require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');

const messagesRoutes = require('./routes/messages');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const usersRoutes = require('./routes/users');
const reviewsRoutes = require('./routes/reviews');
const uploadRoutes = require('./routes/uploadRoutes');

const cors = require('cors');

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  'https://frontend-shield.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Autoriser les requêtes sans origine (ex: Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `L'origine ${origin} n'est pas autorisée par la politique CORS.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // si tu utilises les cookies ou sessions
}));

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connecté'))
.catch(err => console.error('Erreur MongoDB:', err));

// Routes
app.get('/', (req, res) => {
  res.send('API Shield Baby en ligne 🎉');
});

app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/upload', uploadRoutes);

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static('uploads'));

// Lancer serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`));

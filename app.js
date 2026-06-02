const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

require('dotenv').config();

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

// Trust proxy para Render (necesario para cookies en HTTPS detrás de proxy)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'tu_secreto_seguro_aqui_cambia_esto_en_produccion',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true, 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0 }));

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

const puerto = process.env.PORT || process.env.PUERTO_SERVIDOR || 3000;

app.listen(puerto, function () {
    console.log('🎨 Servidor de Lista de Espera iniciado');
    console.log('Escuchando en puerto: ' + puerto);
});

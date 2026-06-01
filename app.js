const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

require('dotenv').config();

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');


app.use(session({
  secret: 'tu_secreto_seguro_aqui_cambia_esto_en_produccion',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    httpOnly: true, 
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0 }));


app.use('/', publicRoutes);


app.use('/admin', adminRoutes);

const puerto = process.env.PUERTO_SERVIDOR || 3000;

app.listen(puerto, function () {
    console.log('🎨 Servidor de Lista de Espera iniciado');
    console.log('Escuchando en: http://localhost:' + puerto);
});

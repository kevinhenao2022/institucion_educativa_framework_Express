const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON y datos de formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Arreglo de usuarios y propiedades (sustituye con una base de datos real)
const users = [
  { username: 'admin', fullname: 'Administrador', password: 'admin123', role: 1 },
  { username: 'user1', fullname: 'Usuario 1', password: 'password1', role: 2 },
];

const properties = [];

// Middleware para verificar el rol de usuario
function checkUserRole(req, res, next) {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    req.role = user.role;
    next();
  } else {
    res.status(401).send('Credenciales incorrectas');
  }
}

// Middleware para verificar el rol de administrador
function checkAdminRole(req, res, next) {
  if (req.role === 1) {
    next();
  } else {
    res.status(403).send('Acceso denegado para usuarios no administradores');
  }
}

// Ruta de inicio para capturar datos de usuario y contraseña
app.get('/', (req, res) => {
  res.send('Página de inicio');
});

// Ruta para /customers y /controlpanel
app.get('/customers', checkUserRole, (req, res) => {
  if (req.role === 1) {
    res.send('Página de administrador');
  } else {
    res.send('Página de cliente');
  }
});

// Ruta para /quienessomos
app.get('/quienessomos', (req, res) => {
  res.send('Quiénes somos');
});

// Ruta para crear una propiedad (POST)
app.post('/property', (req, res) => {
  const { idProperty, addressProperty, valueProperty } = req.body;
  // Verificar si el idProperty ya existe
  if (properties.some((p) => p.idProperty === idProperty)) {
    res.status(400).send('El idProperty ya existe.');
  } else {
    properties.push({ idProperty, addressProperty, valueProperty });
    res.status(201).send('Propiedad creada con éxito.');
  }
});

// Ruta para PUT
app.put('/', (req, res) => {
  res.send('Ruta PUT');
});

// Ruta para DELETE
app.delete('/student', (req, res) => {
  res.send('Ruta DELETE');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto http://localhost:${3000}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('API del Sistema de Control de Herramientas funcionando correctamente');
});

// 🔍 DEBUG: Imprimir mensaje antes de cargar las rutas
console.log("✅ Cargando rutas...");

// Importar rutas
const toolsRoutes = require('./src/routes/tools.routes');
console.log("✅ toolsRoutes cargado correctamente");

// Registrar rutas en Express
app.use('/api/tools', toolsRoutes);

// 🔍 DEBUG: Verificar rutas activas después de cargarlas
console.log("⚡ Rutas registradas en Express:");
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`✅ Ruta activa: ${r.route.path}`);
  }
});

// Conectar a MongoDB y arrancar el servidor
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conexión a MongoDB establecida correctamente');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1);
  });








// // server.js - Punto de entrada para nuestro servidor
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// // Cargar variables de entorno desde archivo .env
// dotenv.config();

// // Crear la aplicación Express
// const app = express();

// // Middleware para procesar JSON
// app.use(express.json());

// // Habilitar CORS para que el frontend pueda comunicarse con el backend
// app.use(cors());

// // Middleware para procesar datos de formularios
// app.use(express.urlencoded({ extended: true }));

// // Ruta básica de prueba
// app.get('/', (req, res) => {
//   res.send('API del Sistema de Control de Herramientas funcionando correctamente');
// });

// // Verificar si las rutas se están cargando correctamente
// try {
//   // Importar y usar rutas (haremos una modificacion aqui, removeremos el /src esto porque estamos teniendo problemas en Render)
//   // app.use('/api/tools', require('./src/routes/tools.routes'));
//   // app.use('/api/users', require('./src/routes/users.routes'));
//   // app.use('/api/loans', require('./src/routes/loans.routes'));
//   // app.use('/api/notifications', require('./src/routes/notifications.routes'));

//   const toolsRoutes = require('./src/routes/tools.routes');
//   const usersRoutes = require('./src/routes/users.routes');
//   const loansRoutes = require('./src/routes/loans.routes');
//   const notificationsRoutes = require('./src/routes/notifications.routes');

//   console.log("✅ Rutas cargadas correctamente");

//   app.use('/api/tools', toolsRoutes);
//   app.use('/api/users', usersRoutes);
//   app.use('/api/loans', loansRoutes);
//   app.use('/api/notifications', notificationsRoutes);

// } catch (error) {
//   console.error("❌ Error cargando las rutas:", error.message);
// }

// console.log("⚡ Rutas registradas en Express:");
// app._router.stack.forEach((r) => {
//   if (r.route && r.route.path) {
//     console.log(`✅ Ruta activa: ${r.route.path}`);
//   }
// });



// // Configuración del puerto
// const PORT = process.env.PORT || 5000;

// // Conexión a MongoDB y arranque del servidor
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('Conexión a MongoDB establecida correctamente');
//     app.listen(PORT, () => {
//       console.log(`Servidor corriendo en el puerto ${PORT}`);

//       // Verificación de rutas activas
//       app._router.stack.forEach((r) => {
//         if (r.route && r.route.path) {
//           console.log(`✅ Ruta activa: ${r.route.path}`);
//         }
//       });
//     });
//   })
//   .catch((err) => {
//     console.error('Error al conectar a MongoDB:', err.message);
//     process.exit(1);
//   });
// server.js configurado para servir aplicación React
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const listEndpoints = require('express-list-endpoints');

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Ruta básica de prueba para la API
app.get('/api', (req, res) => {
  res.send('API del Sistema de Control de Herramientas funcionando correctamente');
});

// Ruta para ver todas las rutas disponibles
app.get('/api/routes', (req, res) => {
  try {
    const endpoints = listEndpoints(app);
    return res.json({ success: true, routes: endpoints });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Error al obtener rutas",
      error: error.message 
    });
  }
});

// Configurar rutas de la API
try {
  const toolsRoutes = require('./src/routes/tools.routes');
  const usersRoutes = require('./src/routes/users.routes');
  const loansRoutes = require('./src/routes/loans.routes');
  const notificationsRoutes = require('./src/routes/notifications.routes');

  app.use('/api/tools', toolsRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/loans', loansRoutes);
  app.use('/api/notifications', notificationsRoutes);

  console.log("✅ Rutas API cargadas correctamente");
} catch (error) {
  console.error("❌ Error cargando las rutas API:", error.message);
}

// IMPORTANTE: Para una aplicación React, necesitamos servir los archivos de build
// Buscar la carpeta build del frontend
const frontendBuildPath = path.resolve(__dirname, '../frontend/build');
const fs = require('fs');

// Verificar si la carpeta build existe
const buildExists = fs.existsSync(frontendBuildPath);
console.log(`${buildExists ? '✅' : '❌'} Carpeta build ${buildExists ? 'encontrada' : 'no encontrada'} en: ${frontendBuildPath}`);

// Si build no existe, intenta crear un script para construirla
if (!buildExists) {
  console.log('⚠️ No se encontró la carpeta build. Es necesario ejecutar "npm run build" en el frontend.');
  console.log('⚠️ Por ahora, solo estará disponible la API.');
}

// Servir archivos estáticos desde la carpeta build
if (buildExists) {
  app.use(express.static(frontendBuildPath));
  
  // Para aplicaciones SPA (Single Page Application) como React
  // Todas las rutas no-API deben redirigir a index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    }
  });
  
  console.log('✅ Servidor configurado para servir la aplicación React desde la carpeta build');
}

// Configuración del puerto
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB y arranque del servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conexión a MongoDB establecida correctamente');
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
      console.log(`📡 API disponible en: http://localhost:${PORT}/api`);
      if (buildExists) {
        console.log(`🌐 Frontend disponible en: http://localhost:${PORT}`);
      }
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
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
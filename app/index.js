const setupBoilerplate = require('./boilerplate/setup');

const { app, io, db, listen } =  setupBoilerplate();
const port = process.env.PORT || 8989 || process.env.OPENSHIFT_NODEJS_PORT;
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

// Bind REST controller to /api/*
const router = require('./controllers/rest.controller.js');
app.use('/api', router);

// Registers socket.io controller
const socketController = require('./controllers/socket.controller.js');
io.on('connection', socket => {
    socketController(socket, io);
});

listen(port, server_ip_address, () => {
  console.log("server listening on port", port);
});
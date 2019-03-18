const setupBoilerplate = require('./boilerplate/setup');

const { app, io, listen } =  setupBoilerplate();
const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0' || localhost;

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
const setupBoilerplate = require('./boilerplate/setup');

const { app, io, db, listen } =  setupBoilerplate();
const port = process.env.PORT || 8989;

// Bind REST controller to /api/*
const router = require('./controllers/rest.controller.js');
app.use('/api', router);

// Registers socket.io controller
const socketController = require('./controllers/socket.controller.js');
io.on('connection', socket => {
    socketController(socket, io);
});

listen(port, () => {
  console.log("server listening on port", port);
});
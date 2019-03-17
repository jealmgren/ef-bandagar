const model = require('../model.js');

var timeouts = {};

module.exports = (socket, io) => {
  // Om en bokning har skett.
  socket.on('confirmedBooking', req => {
    io.emit('confirmedBooking', req);
  });
};

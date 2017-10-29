const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const console = require('tracer').colorConsole();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

app.get('/spinner.png', (req, res) => {
  res.sendFile(__dirname + '/spinner.png');
});

io.on('connection', (socket) => {

  socket.on('chat message', (msg) => {
  	var address = socket.handshake.address;
  	console.log(socket.id, address);
  	console.log('msg:', msg);
    io.emit('chat message', msg);
  });


  socket.on('evt', (msg) => {
  	var address = socket.handshake.address;
  	console.log(socket.id, address);
  	console.log('msg:', msg);
    io.emit('evt', msg);
  });
});

http.listen(port, () => {
  console.log('listening on *:' + port);
});
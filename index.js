const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const console = require('tracer').colorConsole();

let counter = 0;
const production = process.env.PRODUCTION;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/spinner.png', (req, res) => {
  res.sendFile(__dirname + '/spinner.png');
});

io.on('connection', (socket) => {
  counter++;
  console.log('counter++:', counter);

  socket.on('evt', (msg) => {
  	var address = socket.handshake.address;
  	if (!production) {
      console.log(socket.id, address);
      console.log('msg:', msg);
    }
    io.emit('evt', msg);
  });

  socket.on('disconnect', ()=> {
    counter--;
    console.log('counter--:', counter);
  })
});

http.listen(port, () => {
  console.log('listening on *:' + port);
});
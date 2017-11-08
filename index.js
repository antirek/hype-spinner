const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3030;
const console = require('tracer').colorConsole();
const favicon = require('serve-favicon');
const path = require('path');

var redis = require('promise-redis')();
    client = redis.createClient();

let online = 0;
const MINEKEY = "MINEKEY7";

const production = process.env.PRODUCTION;

app.use(favicon(path.join(__dirname, 'images', 'favicon.ico')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/spinner.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'images', 'spinner.png'));
});

app.get('/qr.gif', (req, res) => {
  res.sendFile(path.join(__dirname, 'images', 'qr-code.gif'));
});

io.on('connection', (socket) => {
  online++;
  console.log('online++:', online);
  io.emit('online', online);

  client.get(MINEKEY)
    .then((mine) => {
      socket.emit('mine', mine);
    });

  socket.on('spin', (spin) => {
    
    var address = socket.handshake.address;
    if (!production) {
      console.log(socket.id, address);
      console.log('spin:', spin);
    }
    io.emit('spin', spin);

    client.incr(MINEKEY)
      .then(() => {  
        return client.get(MINEKEY)      
      })
      .then((mine) => {
        console.log('mine', mine);
        io.emit('mine', mine);
      });
  });

  socket.on('disconnect', ()=> {
    online--;
    console.log('online--:', online);

    io.emit('online', online);
  })
});



  
client.setnx(MINEKEY, "0")
  .then(() => {
    client.get(MINEKEY).then((mine) => {
      console.log('start value of mine', mine);  

      http.listen(port, () => {  
        console.log('listening on *:' + port);
      });

    });
});
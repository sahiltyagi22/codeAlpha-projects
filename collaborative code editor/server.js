const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const ShareDB = require('sharedb');
const richText = require('rich-text');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Create a ShareDB instance
const shareDB = new ShareDB();

// Create a ShareDB connection
const connection = shareDB.connect();

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  const doc = connection.get('docs', 'demo');

  // Fetch the document
  doc.fetch((err) => {
    if (err) {
      throw err;
    }

    // Create the document if it doesn't exist
    if (doc.type === null) {
      doc.create([{ insert: 'Hello, Collaborative World!\n' }], 'rich-text', (err) => {
        if (err) {
          throw err;
        }
        // Subscribe to changes after the document is created
        subscribeToDoc(socket, doc);
      });
    } else {
      // Subscribe to changes if the document already exists
      subscribeToDoc(socket, doc);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('operation', (operation) => {
    doc.submitOp(operation);
  });

  socket.on('cursor-update', (cursor) => {
    socket.broadcast.emit('cursor-update', { id: socket.id, cursor });
  });
});

function subscribeToDoc(socket, doc) {
  // Subscribe to changes
  doc.subscribe((err) => {
    if (err) {
      throw err;
    }
    // Initialize the editor with the document content
    socket.emit('init', doc.data);
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

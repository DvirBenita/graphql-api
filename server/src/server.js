const http = require('http');
const express = require('express');
const app = require('./app');

const PORT = 3000;
const server = http.createServer(app);

server.listen(port, (err) => {
    if (err) return console.error(err)
    console.log('server started on port: ' + port);
});
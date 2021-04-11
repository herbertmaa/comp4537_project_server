/* Needed to run on AWS */

const http = require('http');
const app = require('./app');
app.listen(80);         
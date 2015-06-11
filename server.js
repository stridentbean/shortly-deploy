// old app req
//var app = require('./server-config.js');
var app = require('./shortly.js');

var port = process.env.port || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);

const express = require('express' );
const app = express();
var path = require('path');

app.use(express.static(path.join('/home/ubuntu/home/CTF2/www/')));

app.get('/', function (request, response) {
	        //response.send('Hello World');
	        process.stdout.write("Sending Response: ");
	        response.sendFile(path.join('index.html'));
});
app.listen(3001, function () {
	        console.log('Listening on port 3001');
});

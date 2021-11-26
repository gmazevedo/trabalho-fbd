const http = require('http')
const fs = require('fs')
const port = 3000

const server = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/html' })
	if (req.url === '/') {
		fs.readFile('./index.html', (err, data) => {
			if (err) {
				res.writeHead(404)
				res.write('Error')
			}
			else {
				res.write(data)
			}
			res.end()
		})
	} else if (req.url === '/index.js') {
		fs.readFile('./index.js', (err, data) => {
			if (err) {
				res.writeHead(404)
				res.write('Error')
			}
			else {
				res.writeHead(200, { 'Content-Type': 'text/javascript' });
				res.write(data);
			}
			res.end();
		})
	} else if (req.url === '/style.css') {
		fs.readFile('./style.css', (err, data) => {
			if (err) {
				res.writeHead(404)
				res.write('Error')
			}
			else {
				res.writeHead(200, { 'Content-Type': 'text/css' });
				res.write(data);
			}
			res.end();
		})
	}
})
server.listen(port)
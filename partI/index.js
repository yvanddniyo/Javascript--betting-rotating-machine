const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvent');
const EventEmitter = require('events');

class Emitter extends EventEmitter { };

//initialize object.
const myEmitter = new Emitter(); 
myEmitter.on('log', (msg) => logEvents(msg));
setTimeout(() => {
  //Emit event 
  myEmitter.emit('log', 'Log event emitted!');
}, 2000);

const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
   try {

   } catch (err) {
      console.log(err);
      response.statusCode = 500;
      response.end();
   }
} 

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  const extension = path.extname(req.url)
  let contentType;

  switch (extension) {
    case '.css': 
       contentType = 'text/css';
       break;
    case '.js': 
       contentType = 'text/javascript';
       break;
    case '.json': 
       contentType = 'application/json';
       break;
    case '.jpg': 
       contentType = 'image/jpeg';
       break;
    case '.png': 
       contentType = 'image/png';
       break;
    case '.txt': 
       contentType = 'text/plain ';
       break;
    default: 
       contentType = 'text/html';   
  }
  let filePath =
    contentType === 'text/html' && req.url === '/'
    ?path.join(__dirname, 'view', 'index.html')
    :contentType === 'text/html' && req.url.slice(-1) === '/'
    ?path.join(__dirname, 'view', req.url, 'index.html')
    :contentType === 'text/html'
    ?path.join(__dirname, 'view', req.url):
    path.join(__dirname, req.url);

    // make .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath +='.html';
  
    const fileExist = fs.existsSync(filePath);

    if (fileExist) {
      //serve the file
    }
    else {
      switch(path.parse(filePath).base){
         case 'old-page.html':
            res.writeHead(301, {'location': '/new-page.html'});
            res.end();
            break; 
         case 'www-page.html':
            res.writeHead(301, { 'Location': '/'});
            res.end();
            break;
         default:
                   
      }
    }
    

})

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

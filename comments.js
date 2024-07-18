// create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
// create server
http.createServer(function (req, res) {
  // get request url
  var path = url.parse(req.url).pathname;
  // if request url is /, return index.html
  if (path == '/') {
    fs.readFile(__dirname + '/index.html', function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200);
      res.end(data);
    });
  }
  // if request url is /comments, return comments.json
  else if (path == '/comments') {
    fs.readFile(__dirname + '/comments.json', function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading comments.json');
      }
      res.writeHead(200);
      res.end(data);
    });
  }
  // if request url is /comment, save comment to comments.json
  else if (path == '/comment') {
    var comment = '';
    req.on('data', function (data) {
      comment += data;
    });
    req.on('end', function () {
      var newComment = qs.parse(comment);
      fs.readFile(__dirname + '/comments.json', function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading comments.json');
        }
        var comments = JSON.parse(data);
        comments.push(newComment);
        fs.writeFile(__dirname + '/comments.json', JSON.stringify(comments), function (err) {
          if (err) {
            res.writeHead(500);
            return res.end('Error saving comment');
          }
          res.writeHead(200);
          res.end();
        });
      });
    });
  }
  // if request url is not /, return 404
  else {
    res.writeHead(404);
    res.end('Not Found');
  }
}).listen(3000, 'localhost');
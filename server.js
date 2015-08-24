// sessions  will be juggled in here with request, not the angular scope
var express = require('express'),
    app = express(),
    bodyparser = require('body-parser'),
    session = require('express-session'),
    sha1 = require('sha1');

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'wellness'
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : true}));
app.use(session({secret : "donttell"}));
//app.use();

app.use('/client', express.static(__dirname+'/client'));

// AUTHENTICATION & INDEX
app.get('/', function(req, res){  //check if user has logged in with function
  if (req.session.user) res.sendFile(__dirname+'/client/views/main.html');
  else res.sendFile(__dirname+'/client/views/portal.html');
});

app.post('/login/', function(req, res){
  var querystring = 'select * from User where username="'+req.body.username+'" and password="'+sha1(req.body.password)+'";';
  //req.session.user = 'pizza';
  //console.log('Bottom layer: '+req.session.user);
  pool.getConnection(function(err,connection)
  {
    //console.log('1st layer: '+req.session.user);
    connection.query(querystring, function(err, rows)
    {
      //console.log('2nd layer: '+req.session.user);
      if (!err)
      {
        console.log('Result set: '+rows);
        if (rows != [] && rows != '' && rows != null) req.session.user = 'ok';
        res.redirect('/'); //must wait for query results before redirecting
      }
    });
  });
  //console.log('Session: '+req.session.user);
});

app.get('/logout/', function(req, res){
  //destroy the session
  req.session.destroy();
  res.redirect('/');
});

// ENROLL, WAIVER & PROFILE

app.get('/enroll/', function(req, res){
  if (!req.session.user) res.redirect('/');
  //serve up the enroll view
  res.sendFile(__dirname+'/client/views/enroll.html');
});

app.get('/waiver/', function(req, res){
  if (!req.session.user) res.redirect('/');
  res.sendFile(__dirname+'/client/views/waiver.html');
});

app.get('/profile/', function(req,res){
  if (!req.session.user) res.redirect('/');
  res.sendFile(__dirname+'/client/views/profile.html');
});

// EXTRA


// SET UP LISTENER
var globalPort = 3000;
app.listen(globalPort, function(){
  console.log('Server listening on port '+globalPort)
});

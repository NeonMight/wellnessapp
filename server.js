////////////////////////////// INITIAL CONFIG //////////////////////////////

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

////////////////////////////// AUTHENTICATION & INDEX //////////////////////////////

app.get('/', function(req, res){  //check if user has logged in with function
  if (req.session.admin == 1) res.sendFile(__dirname+'/client/views/admin.html');
  else if (req.session.user) res.sendFile(__dirname+'/client/views/main.html');
  else res.sendFile(__dirname+'/client/views/portal.html');
});

app.post('/login/', function(req, res){
  var querystring = 'select * from User where username="'+req.body.username+'" and password="'+sha1(req.body.password)+'" limit 1;';
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
        //console.log('Result set: '+rows);
        if (rows != [] && rows != '' && rows != null)
        {
          req.session.user = rows[0].username; //set to the user's username
          req.session.admin = rows[0].isadmin; //check if user is an admin or not
        }
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

/////////////////////////////// PARTIAL TEMPLATES //////////////////////////////

app.get('/navbar/', function(req, res){
  res.sendFile(__dirname+'/client/views/navbar.html');
});


////////////////////////////// MAIN TEMPLATES //////////////////////////////

app.get('/enroll/', function(req, res){
  if (!req.session.user) res.redirect('/');
  //serve up the enroll view
  res.sendFile(__dirname+'/client/views/enroll.html');
});

app.get('/decline/', function(req, res){
  if (!req.session.user) res.redirect('/');
  res.sendFile(__dirname+'/client/views/waiver.html');
});

app.get('/profile/', function(req,res){
  if (!req.session.user) res.redirect('/');
  res.sendFile(__dirname+'/client/views/profile.html');
});

app.get('/form/', function(req,res){
  if (!req.session.user) res.redirect('/');
  res.sendFile(__dirname+'/client/views/form.html');
});

app.get('/manage/', function(req,res){
  if (!req.session.user || req.session.admin == 0) res.redirect('/');
  res.sendFile(__dirname+'/client/views/manage.html');
});

app.get('/stats/', function(req,res){
  if (!req.session.user || req.session.admin == 0) res.redirect('/');
  res.sendFile(__dirname+'/client/views/stats.html');
});

////////////////////////////// RESOURCE REQUESTS //////////////////////////////
app.get('/getUserSession/', function(req, res){
  //console.log('User session requested');
  res.send(req.session);
});

app.get('/getUserProfile/', function(req,res){
  var querystring = 'select * from User where username="'+req.session.user+'" limit 1;';
  //console.log('Query: '+ querystring);
  pool.getConnection(function(err,connection){
    connection.query(querystring, function(err, rows){
      // return the profile
      //console.log('Rows: '+JSON.stringify(rows)); //echo profile in json format to check if object or array
      res.json(rows[0]); //respond with just 1st object in array
    });
  });
});


app.get('/getActivityList/', function(req, res){
  currentDate = new Date(); //only get relevant form data for current year
  var querystring = 'select * from Activity where enrollmentyear='+currentDate.getFullYear()+' and id not in (select activityid from Enrollment where user="'+req.session.user+'") order by percent;'; // for future, only get ones not enrolled in
  //console.log(querystring);
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      // return all objects as an array (foreach over array to convert objects to json then respond?)
      //console.log(JSON.stringify(rows[0]));
      //console.log(rows);
      res.send(rows); //try the whole array first
    });
  });
});

app.get('/getEnrolledActivities/', function(req,res){
  var querystring = 'select * from Activity inner join Enrollment where Activity.id=Enrollment.activityid and user="'+req.session.user+'";';
  //console.log(querystring);
  pool.getConnection(function(err,connection){
    connection.query(querystring, function(err, rows){
      //console.log("Your enrolled activities are: "+JSON.stringify(rows[0]));
      res.send(rows);
    });
  });
});

//////////////////////////////POST REQUESTS//////////////////////////////

app.post('/enrollUser/', function(req, res){
  //timestamp = new Date(dateString);
  var querystring = 'insert into Enrollment(user, activityid, enrollmentdate) values("'+req.session.user+'", '+req.body.id+', CURDATE())';
  console.log(querystring);
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send("ok!");
    });
  });
});



////////////////////////////// PUT REQUESTS //////////////////////////////

app.put('/updateProfile/', function(req,res){
  //firstname, lastname, email and department
  var querystring = 'update User set firstname="'+req.body.firstname+'", lastname="'+req.body.lastname+'", email="'+req.body.email+'", department="'+req.body.department+'" where username="'+req.session.user+'";';
  //console.log(querystring);
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      // return something
      res.send('ok!');
    });
  });
});

////////////////////////////// SET UP LISTENER //////////////////////////////
var globalPort = 3000;
app.listen(globalPort, function(){
  console.log('Server listening on port '+globalPort);
});

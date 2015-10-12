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
  if (req.session.user) res.sendFile(__dirname+'/client/views/shell.html');
  else res.sendFile(__dirname+'/client/views/portal.html');
});

app.get('/main/', function(req,res){
  if (req.session.user) //must be in shell page to request templates
  {
    if (req.session.admin==1) res.sendFile(__dirname+'/client/views/admin.html');
    else res.sendFile(__dirname+'/client/views/main.html');
  }
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
        else req.session.failure = 'Error';
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

app.post('/checkAvailableUsernames/', function(req, res){
  //console.log(req.body);
  var querystring = 'select * from User where username="'+req.body.username+'" limit 1';
  //console.log(querystring);
  //res.send('ok!');
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send(rows[0]);
    });
  });
});

////////////////////////////// MAIN TEMPLATES //////////////////////////////

app.get('/enroll/', function(req, res){
  if (!req.session.user) res.send('');
  //serve up the enroll view
  res.sendFile(__dirname+'/client/views/enroll.html');
});

app.get('/waiver/', function(req, res){
  if (!req.session.user) res.send('');
  res.sendFile(__dirname+'/client/views/waiver.html');
});

app.get('/profile/', function(req,res){
  if (!req.session.user) res.send('');
  res.sendFile(__dirname+'/client/views/profile.html');
});

app.get('/form/', function(req,res){
  if (!req.session.user) res.send('');
  res.sendFile(__dirname+'/client/views/form.html');
});

app.get('/manage/', function(req,res){
  if (!req.session.user || req.session.admin == 0) res.send('');
  res.sendFile(__dirname+'/client/views/manage.html');
});

app.get('/stats/', function(req,res){
  if (!req.session.user || req.session.admin == 0) res.send('');
  res.sendFile(__dirname+'/client/views/stats.html');
});

app.get('/activities/', function(req,res){
  if (!req.session.user || req.session.admin == 0) res.send('');
  res.sendFile(__dirname+'/client/views/activities.html');
});

////////////////////////////// RESOURCE REQUESTS //////////////////////////////

app.get('/getUserSession/', function(req, res){
  //console.log('User session requested');
  // get the users credit count in the session to enforce form validation
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

app.get('/getActivityList/', function(req,res){
  currentDate = new Date();
  var querystring = 'select * from Activity where enrollmentyear='+currentDate.getFullYear()+' order by percent';
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send(rows);
    });
  });
});

app.get('/getActivityListUnenrolled/', function(req, res){
  //console.log('Activity list requested');
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

app.get('/viewEvents/:id', function(req, res){
  var querystring = 'select * from Event where activityid='+req.params.id;
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send(rows);
    });
  });
});


// for manage page
app.get('/getUserList/', function(req, res){
  var querystring = 'select * from User';
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send(rows);
    });
  });
});

// also for manage page
app.get('/viewEnrollmentForUser/:username', function(req, res){
  var querystring = 'select * from Activity a inner join Enrollment e where a.id=e.activityid and e.user="'+req.params.username+'"';
  //console.log(querystring);
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send(rows);
    });
  });
});


app.get('/userModifyRequest/:username', function(req, res){
  var querystring = 'select * from User where username="'+req.params.username+'"';
  //console.log(querystring);
  pool.getConnection(function(err,connection){
    connection.query(querystring, function(err, rows){
      //console.log('Results: '+rows);
      res.send(rows);
    });
  });
});

app.get('/getLineChart', function(req, res){
  var querystring = 'select extract(year from enrollmentdate) as year, count(*) as quant from Enrollment group by year order by year;';
  //console.log('line chart requested');
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send(rows);
    });
  });
});

// for stats page
app.get('/getPieChart/', function(req, res){
  var querystring = 'select a.name as name, count(activityid) as quant from Activity a, Enrollment e where a.id=e.activityid group by a.name order by quant desc;';
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send(rows);
    });
  });
});

// also for stats page
app.get('/getLatestActions/', function(req, res){
  var querystring = 'select * from enrollment order by enrollmentdate desc limit 10';
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send(rows);
    });
  });
});
//////////////////////////////POST REQUESTS//////////////////////////////

app.post('/createUserAccount/', function(req,res){
  var querystring = 'insert into User(username, firstname, lastname, password, email, department, enabled, isadmin) values("'+req.body.username+'","'+req.body.firstname+'","'+req.body.lastname+'","'+sha1(req.body.password)+'","'+req.body.email+'","'+req.body.department+'",1,0)';
  pool.getConnection(function(err,connection){
    connection.query(querystring, function(err,rows){
      res.send("ok!");
    });
  });
});

app.post('/createActivity/', function(req,res){
  currentDate = new Date();
  var querystring = 'insert into Activity(name, description, documentation, percent, enrollmentyear, eventsrequired, maxselection, isarchived) values("'+req.body.name+'", "'+req.body.description+'", "'+req.body.documentation+'", '+req.body.percent+', '+currentDate.getFullYear()+', '+req.body.eventsrequired+', '+req.body.maxselection+', 0)';
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send("ok!");
    });
  });
});

app.post('/enrollUser/', function(req, res){
  //timestamp = new Date(dateString);
  var querystring = 'insert into Enrollment(user, activityid, enrollmentdate, complete) values("'+req.session.user+'", '+req.body.id+', CURDATE(), 0)';
  //console.log(querystring);
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send("ok!");
    });
  });
});

app.post('/waiveParticipation/', function(req, res){
  var querystring = 'insert into Waiver(user, waivedate) values("'+req.session.user+'", CURDATE())';
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send("ok!");
    });
  });
});

////////////////////////////// PUT REQUESTS //////////////////////////////

app.put('/updateProfile/', function(req,res){
  //firstname, lastname, email and department
  var querystring = 'update User set firstname="'+req.body.firstname+'", lastname="'+req.body.lastname+'", email="'+req.body.email+'", department="'+req.body.department+'" where username="'+req.session.user+'" limit 1';
  //console.log(querystring);
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      // return something
      res.send('ok!');
    });
  });
});

app.put('/modifyUserAsAdmin/', function(req, res){
  var querystring = 'update User set firstname="'+req.body.firstname+'", lastname="'+req.body.lastname+'", email="'+req.body.email+'", department="'+req.body.department+'" where username="'+req.body.username+'"';
  //console.log(querystring);
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send('ok!');
    });
  });
});

app.put('/updateEnrollmentStatus/', function(req, res){
  //console.log(req.body.user);
  var querystring = 'update Enrollment set complete='+req.body.complete+' where user="'+req.body.user+'" and activityid='+req.body.id;
  console.log(querystring);
  pool.getConnection(function(err, connection){
    connection.query(querystring, function(err, rows){
      res.send('ok!');
    });
  });
});

////////////////////////////// SET UP LISTENER //////////////////////////////
var globalPort = 3000;
app.listen(globalPort, function(){
  console.log('Server listening on port '+globalPort);
});

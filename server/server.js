/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/
const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'test_db',
	user: 'postgres',
	password: '123'
};

const dbConfig_heroku = process.env.DATABASE_URL;

var db = ''
if(dbConfig_heroku){
  db = pgp(dbConfig_heroku);
}else{
  db = pgp(dbConfig);
}

var id = '';
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory




app.get('/main_page', function(req, res) {

  var user = req.query.username;
  var get_mtn_count= "select mountain_list from login_info where username='"+user+"';";
  var query = 'select * from mountains;';
  
  db.task('get-everything', task=>{
    return task.batch([
        task.any(query),
        task.any(get_mtn_count)

      ]);
  })
        .then(function (rows) {
            res.render('pages/main_page',{
        my_title: "main Page",
        stuff: rows[0],
        pic:'',
        user_name:user,
        mountain_array:rows[1][0].mountain_list 
      })

        })
        .catch(function (err) {
            // display error message in case an error
            request.flash('error', err);
            response.render('pages/main_page', {
                title: 'main Page',
                stuff:'',
                user_name:''
            })
        })
});


app.get('/add_mtn', function(req, res) {

  var user = req.query.username;
  //var get_mtn_count= "select mountain_list from login_info where username='"+user+"';";
  var query = 'select * from mountains;';
  
  db.task('get-everything', task=>{
    return task.batch([
        task.any(query),
        //task.any(get_mtn_count)

      ]);
  })
        .then(function (rows) {
            res.render('pages/add_mtn',{
        my_title: "main Page",
        stuff: rows[0],
        pic:'',
        user_name:user,
        mountain_array:'',
        mount:''
      })

        })
        .catch(function (err) {
            // display error message in case an error
            request.flash('error', err);
            response.render('pages/add_mtn', {
                title: 'main Page',
                stuff:'',
                user_name:''
            })
        })
});
app.get('/add_mtn/add', function(req, res) {

  var mtn = req.query.mountain_choice;
  var user = req.query.username;
  //var get_mtn_count= "select mountain_list from login_info where username='"+user+"';";
  var query = "select * from mountains where id ='"+mtn+"';";
  var query2 = 'select * from mountains;';
  db.task('get-everything', task=>{
    return task.batch([
        task.any(query),
        task.any(query2)

      ]);
  })
        .then(function (rows) {
            res.render('pages/add_mtn',{
        my_title: "main Page",
        stuff: rows[1],
        pic:rows[0][0].img,
        user_name:user,
        mountain_array:rows[0][0].mountain,
        mount:mtn 
      })

        })
        .catch(function (err) {
            // display error message in case an error
            request.flash('error', err);
            response.render('pages/add_mtn', {
                title: 'main Page',
                stuff:'',
                user_name:''
            })
        })
});
app.post('/main_page/addition', function(req, res) {

  var mtn = req.body.mountain_choice;
  var user = req.body.username;
  var update_statement = "update login_info set mountain_list[" + mtn+"] = 1 where username = '"+user+"';";
  var get_mtn_count= "select mountain_list from login_info where username='"+user+"';";
  var query = 'select * from mountains;';
  
  
  db.task('get-everything', task=>{
    return task.batch([
        
        task.any(update_statement),
        task.any(query),
        task.any(get_mtn_count)
    

      ]);
  })
        .then(function (rows) {
            res.render('pages/main_page',{
        my_title: "main Page",
        stuff: rows[1],
        pic:'',
        user_name:user,
        mountain_array:rows[2][0].mountain_list 
      })

        })
        .catch(function (err) {
            // display error message in case an error
            request.flash('error', err);
            response.render('pages/main_page', {
                title: 'main Page',
                stuff:'',
                user_name:''
            })
        })
});


app.post('/main_page/plus', function(req, res) {
  
  var number = req.body.skidays;
  number ++;
  
  var mtn = req.body.mountain_id;
  var user = req.body.username;
  var update_statement = "update login_info set mountain_list[" + mtn+"] = "+number+" where username = '"+user+"';";
  var get_mtn_count= "select mountain_list from login_info where username='"+user+"';";
  var query = 'select * from mountains;';
  
  
  db.task('get-everything', task=>{
    return task.batch([
        
        task.any(update_statement),
        task.any(query),
        task.any(get_mtn_count)
    

      ]);
  })
  .then(function (rows) {
            res.render('pages/main_page',{
        my_title: "main Page",
        stuff: rows[1],
        pic:number,
        user_name:user,
        mountain_array:rows[2][0].mountain_list 
      })

        })
        .catch(function (err) {
            // display error message in case an error
            request.flash('error', err);
            response.render('pages/main_page', {
                title: 'main Page',
                stuff:'',
                user_name:''
            })
        })
});
app.post('/main_page/minus', function(req, res) {
  
  var number = req.body.skidays;
  number --;
  
  var mtn = req.body.mountain_id;
  var user = req.body.username;
  var update_statement = "update login_info set mountain_list[" + mtn+"] = "+number+" where username = '"+user+"';";
  var get_mtn_count= "select mountain_list from login_info where username='"+user+"';";
  var query = 'select * from mountains;';
  
  
  db.task('get-everything', task=>{
    return task.batch([
        
        task.any(update_statement),
        task.any(query),
        task.any(get_mtn_count)
    

      ]);
  })
  .then(function (rows) {
            res.render('pages/main_page',{
        my_title: "main Page",
        stuff: rows[1],
        pic:number,
        user_name:user,
        mountain_array:rows[2][0].mountain_list 
      })

        })
        .catch(function (err) {
            // display error message in case an error
            request.flash('error', err);
            response.render('pages/main_page', {
                title: 'main Page',
                stuff:'',
                user_name:''
            })
        })
});
// app.get('/main_page/create', function(req, res) {
//   var mountain_id= req.query.mount;
//   var kev = "select * from mountains ;";
//   var query = "select * from mountains where id = '" +mountain_id +"';";
//   db.task('get-everything',task=>{
//     return task.batch([
//         task.any(kev),
//         task.any(query)

//       ]);
    
//   })
//   .then(function (rows) {
//     res.render('pages/main_page',{
//       my_title: "main Page",
//       stuff: rows[0],
//       pic:rows[1][0].img
//       })

//         })
//         .catch(function (err) {
//             // display error message in case an error
//             request.flash('error', err);
//             response.render('pages/main_page', {
//                 title: 'main Page',
//                 stuff: '',
                
//             })
//         })
// });
// login page 
app.get('/login', function(req, res) {
  var user = req.query.Username;
  var pass = req.query.password; 
  var query = "select * from login_info where username= '" +user+"';";

  db.any(query)
        .then(function (rows) {
            res.render('pages/login',{
              my_title: "login",
              data_check: rows,
              information: '',
              input_password: '',
              user:user
      })

        })
        .catch(function (err) {
            // display error message in case an error
            request.flash('error', err);
            response.render('pages/login', {
                title: 'login',
                data_check: rows,
                information: '',
                input_password: '',
                user:user
            })
        })
});
app.get('/login/verify', function(req, res) {
  var us = req.query.username;
  var pa = req.query.password; 
  var query = "select * from login_info where username= '" +us+"';";
  var query2 = "select * from login_info where username= '" +us+"';";
  db.task('get-everything', task =>{
    return task.batch([
      task.any(query),
      task.any(query2)
      ]);
  })
      .then(function (rows) {
        res.render('pages/loginv',{
        my_title: "login",
        data_check: rows[0],
        information: rows[1],
        input_password: pa,
        user:us
      })

        })
        .catch(function (err) {
            // display error message in case an error
            request.flash('error', err);
            response.render('pages/loginv', {
                title: 'login',
                data_check: '',
                information: '',
                input_password: '',
                user:us
            })
        })
});


// signup page 

app.get('/login_main', function(req, res) {
  var query = 'select * from login_info;';
  db.any(query)
        .then(function (rows) {
            res.render('pages/login_main',{
        my_title: "login",
        data: rows,
        user_info: 'init'
      })
        })
        .catch(function (err) {
            // display error message in case an error
            request.flash('error', err);
            response.render('pages/login_main', {
                title: 'login',
                data: '',
                user_info: ''
            })
        })
});

// app.get('/update_db', function(req,res){
//   var likes = req.query.likes;


// });


app.post('/login_main/add', function(req, res) {
  var user = req.body.username;
  var pass = req.body.password;
  var check = "select * from login_info where username ='" +user +"';";
  var insert_statement = "INSERT INTO login_info(username, password,mountain_list) VALUES('" + user + "','" + 
              pass +"','{0,0,0,0,0,0,0,0,0,0,0}') ON CONFLICT DO NOTHING;";

  var s = 'select * from login_info;';
  db.task('get-everything', task => {
        return task.batch([
            task.any(check),
            task.any(insert_statement),
            task.any(s)
        ]);
    })
    .then(info => {
      res.render('pages/login_main',{
        my_title: "Home Page",
        data: info[2],
        user_info: info[0]
      })
    })
    .catch(error => {
        // display error message in case an error
            request.flash('error', err);
            response.render('pages/login_main', {
                title: 'Home Page',
                data: '',
                user_info: ''
            })
    });
});
// registration page 


/*Add your other get/post request handlers below here: */


app.listen(process.env.PORT||3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
//console.log('3000 is the magic port : ' +process.env.PORT );

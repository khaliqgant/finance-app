'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var auth = require('http-auth');
var basic = auth.basic({
    realm: 'Khaliq\'s Finances',
    file: __dirname + '/auth/.htpasswd'
});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var trends = require('./analysis/trends');

if (app.get('env') === 'prod') {
    app.use(auth.connect(basic));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/**
 * Post
 * @use handle incoming post requests
 * @references
 *     http://expressjs.com/api.html#req.body
 *     http://stackoverflow.com/questions/5710358/how-to-get-post-a-query-in-express-js-node-js
 *     http://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js
 *     http://stackoverflow.com/questions/10685998/how-to-update-a-value-in-a-json-file-and-save-it-through-node-js
 * @param {object} request
 * @param {object} response
 */
app.post('/update', function(req, res) {
    var filename = req.body.file;
    var entryPoint = req.body.entryPoint;
    var object = req.body.object;
    var parent = req.body.parent;
    var key = req.body.key;
    var value = req.body.value;

    var file = fs.readFileSync(filename);
    var content = JSON.parse(file);

    var set;
    if (value === 'false' || value === 'true') {
        // set the new value and handle booleans
        set = value === 'false' ? false : true;
    } else {
        set = value;
    }
    if (object !== undefined) {
        content[entryPoint][object][parent][key] = set;
    } else {
        content[entryPoint][parent][key] = set;
    }
    // write the file
    fs.writeFileSync(filename, JSON.stringify(content));
    res.json(content);
});

/**
 * Update Note
 * @use update a note and make a new file if necessary
 */
app.post('/updateNote', function(req, res) {
    var filename = req.body.file;
    var entryPoint = req.body.entryPoint;
    var name = req.body.name;
    var key = req.body.key;
    var value = req.body.value;
    var date = req.body.date;
    var currentDate = req.body.currentDate;
    var fileContent = fs.readFileSync(filename);

    if (date !== currentDate) {
        var currentFilename = filename.split('/')[0] + '/' +
                                filename.split('/')[1] + '/' +
                                currentDate + '.json';
        filename = currentFilename;
        fs.writeFileSync(currentFilename, fileContent);
    }
    var content = JSON.parse(fileContent);
    // update the note content
    content[entryPoint][name][key] = value;
    fs.writeFileSync(filename, JSON.stringify(content));

    // now update the notes reference to the current date
    var mainFile = 'data/' + currentDate + '.json';
    var mainData = fs.readFileSync(mainFile);
    var mainContent = JSON.parse(mainData);
    mainContent.notes.file = filename.split('/')[1] + '/' +
                                currentDate + '.json';
    fs.writeFileSync(mainFile, JSON.stringify(mainContent));
    res.json(content);
});

app.post('/deleteNote', function(req,res){
    var filename = req.body.file;
    var entryPoint = req.body.entryPoint;
    var name = req.body.name;
    var key = req.body.key;
    var value = req.body.value;
    var date = req.body.date;
    var currentDate = req.body.currentDate;
    var fileContent = fs.readFileSync(filename);

    var content = JSON.parse(fileContent);
    var array = content[entryPoint][name];
    array.splice(key,1);

    if (array.length === 0) {
        // remove this empty property
        delete content[entryPoint][name];
    }
    fs.writeFileSync(filename, JSON.stringify(content));
    res.json(content);
});


app.post('/addNote', function(req,res){
    var filename = req.body.file;
    var entryPoint = req.body.model;
    var name = req.body.key;
    var value = req.body.value;

    var file = fs.readFileSync('data/'+filename);
    var content = JSON.parse(file);

    content[entryPoint][name].push(value);
    fs.writeFileSync('data/'+filename, JSON.stringify(content));
    res.json(content);
});

/**
 * New
 * @use make a new month and copy over the necessary data
 */
app.post('/new', function(req,res){
    var lastMonth    = req.body.lastMonth;
    var nextMonth    = req.body.file;
    var lastMonthRaw = req.body.rawDateLast;
    var rawDate      = req.body.rawDate;

    var file = fs.readFileSync(lastMonth);
    var content = JSON.parse(file);

    // change due dates and cash references
    var files = {
        due : {
            next : {
                file : 'data/due_dates/' + rawDate + '.json',
                date : 'due_dates/' + rawDate,
            },
            current : {
                file : 'data/due_dates/' + lastMonthRaw + '.json',
                date : 'due_dates/' + lastMonthRaw,
            }
        },
        cash : {
            next : {
                file : 'data/cash/' + rawDate + '.json',
                date : 'cash/' + rawDate
            },
            current : {
                file : 'data/cash/' + lastMonthRaw + '.json',
                date : 'cash/' + lastMonthRaw,
            }
        },
        notes : {
            next : {
                file : 'data/notes/' + rawDate + '.json',
                date : 'notes/' + rawDate
            },
            current : {
                file : 'data/notes/' + lastMonthRaw + '.json',
                date : 'notes/' + lastMonthRaw,
            }
        }
    };
    content.debt.due_dates.file = files.due.next.date + '.json';
    content.notes.file = files.notes.next.date + '.json';
    content.cash.file = files.cash.next.date + '.json';

    var dueDateContent = fs.readFileSync(files.due.current.file);
    var cashDateContent = fs.readFileSync(files.cash.current.file);
    var notesDateContent = fs.readFileSync(files.notes.current.file);

    fs.writeFileSync(nextMonth, JSON.stringify(content));
    fs.writeFileSync(files.due.next.file, dueDateContent);
    fs.writeFileSync(files.cash.next.file, cashDateContent);
    fs.writeFileSync(files.notes.next.file, notesDateContent);

    res.json(true);
});


app.post('/average', function(req,res){
    trends.toPay(function(response){
        res.json(response);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Finance app listening at http://%s:%s', host, port);

});

module.exports = app;

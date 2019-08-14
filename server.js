const express = require('express');
const path = require('path');
const fs = require('fs');

var http = require('http');
var db = require('./db');
var utils = require('./utilities');
var schedule = require('node-schedule');

var api = require('./api');

// Initialise app
var app = express(); 

// Joins dist with the director
app.use(express.static(path.join(__dirname, 'dist'))); 

// Something wrong with this line i think
app.use('/api', api);

// Return Ng4 app
app.get('/*', function(req, res){
    res.sendFile(__dirname + '/dist/index.html');
});

// Listen on port given by Heroku
var server = app.listen(process.env.PORT || 3000);






// Socket listen 
var io = require('socket.io').listen(server);  

/* MongoDb */

// MIGRATE THIS!!
var url = 'mongodb://USER:PWD@URL';

var privateStore = {};
var publicStore = {};

var publicCollection;
var privateCollection;

db.connect(url, (err) => {
    if(err) {
        console.log("Error: " + err);
        return; 
    } 

    publicCollection = db.get().collection('public');
    privateCollection = db.get().collection('private');

    utils.LoadData(publicCollection, (data) => {
        let { flights, stats } = data;
        publicStore = { flights, stats };
    }, db);
    utils.LoadData(privateCollection, (data) => {
        let { users } = data;
        privateStore = { users };
    }, db);

    var cleanupPublic = schedule.scheduleJob('* 30 2 * * *', utils.Cleanup(publicCollection, 'PUBLIC', db));
    var cleanupPrivate = schedule.scheduleJob('* 30 2 * * *', utils.Cleanup(privateCollection, 'PRIVATE', db));
}); 

// Inititalise stores 
var route = './stores';

// var publicData = fs.readFileSync(route+'/publicStore.json', 'utf8');
// publicStore = JSON.parse(publicData);

// var privateData = fs.readFileSync(route+'/privateStore.json', 'utf8');
// privateStore = JSON.parse(privateData);


/* Socket */ 

// Listen for connections
io.on('connection', function(socket) {
    console.log('a user connected');
    var data = {
        'users':privateStore.users,
        'flights':publicStore.flights,
        'stats':publicStore.stats
    }
    // console.log("DATA: " + JSON.stringify(data));
    io.emit('db', data);

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    // Listen for event
    socket.on('dbUpdate', function (dbData) { 
        console.log("-------------------------------");
        console.log("User sent an update for path: " + JSON.stringify(dbData.path));
        console.log("With content: " + JSON.stringify(dbData.data));
        SetDbValue(dbData.path.slice(), dbData.data);

        //TODO Controll this to prevent private information exposed!!
        socket.broadcast.emit('clientUpdate', dbData);
        // console.log("Reached here!");
    });
});

var SetDbValue = function(route, value) {
    switch(route[0]) {
        case 'flights':
            UpdateValueForRoute(route, publicStore, value);
            db.update(publicCollection, publicStore);

            /*fs.writeFile('./stores/publicStore.json', JSON.stringify(publicStore), {encoding:'utf8'}, function(err) {
                if(err) console.log("Error occurred writing file: " + err);
            }); */
            break;
        case 'users':
            UpdateValueForRoute(route, privateStore, value);
            db.update(privateCollection, privateStore);

            /* fs.writeFile('./stores/privateStore.json', JSON.stringify(privateStore), {encoding:'utf8'}, function(err) {
                if(err) console.log("Error occurred writing file: " + err);
            }); */
            break;
        case 'stats': 
            UpdateValueForRoute(route, publicStore, value);
            db.update(publicCollection, publicStore);

            /* fs.writeFile('./stores/publicStore.json', JSON.stringify(publicStore), {encoding:'utf8'}, function(err) {
                if(err) console.log("Error occurred writing file: " + err);
            }); */
            
            break;
    }
}

var UpdateValueForRoute = function(route, passVal, setVal) {
    var subPath = null;

    if(route.length <= 1) {
        var subPath = route.shift();
        passVal[subPath] = setVal;

        return;
    };
    
    var subPath = route.shift();
    var deepVal = passVal[subPath]; 
  
    UpdateValueForRoute(route, deepVal, setVal);
 }
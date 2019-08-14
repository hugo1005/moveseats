var gulp = require('gulp');
var gutil = require('gulp-util');
const fs = require('fs');

// --- For local stup with json storage ---

/* gulp.task('restore-db', ()=>{
  
  gutil.log("[Restore] Overwriting current db files");

  var route = './stores/default';
  var publicData = fs.readFileSync(route+'/publicStore.json', 'utf8');
  var privateData = fs.readFileSync(route+'/privateStore.json', 'utf8');

  

  fs.writeFile('./stores/privateStore.json', privateData, {encoding:'utf8'}, function(err) {
      if(err) console.log("Error occurred writing file: " + err);
  });

  fs.writeFile('./stores/publicStore.json', publicData, {encoding:'utf8'}, function(err) {
      if(err) console.log("Error occurred writing file: " + err);
  });
}); */


var swPrecache = require('sw-precache');
var swPrecacheConfig = require('./sw-config/sw-precache-config');

gulp.task('sw-build', function() {
  gulp.watch('./sw-config/sw-precache-config.js', ['sw-generate']);
  gulp.watch('./dist/index.html', ['sw-generate']);
});

gulp.task('sw-generate', ()=>{
    gutil.log("[build-sw] Detected service-worker change:");
    swPrecache.write(
        'dist/sw.js',
        swPrecacheConfig,
        () => {
           gulp.src('sw-config/sw-toolbox-config.js')
           .pipe(gulp.dest('dist'));
           gutil.log("[gulpfile] Task completed!:");
     
        }
    );
 });


/* =========================  Database Options =================================== */
var db = require('./db');
var url = 'mongodb://hugo1005:Hugo2000*@ds129723.mlab.com:29723/move-seats';

var publicCollection;
var privateCollection;

var publicStore = {};
var privateStore = {};

var loadData = (collection, reduce) => db.open(collection).then((data) => {
    reduce(data);
    console.log("DATA: " + JSON.stringify(data));
});

var SetDbValue = function(route, value) {
    switch(route[0]) {
        case 'flights':
            UpdateValueForRoute(route, publicStore, value);
            db.update(publicCollection, publicStore);

            break;
        case 'users':
            UpdateValueForRoute(route, privateStore, value);
            db.update(privateCollection, privateStore);

            break;
        case 'stats': 
            UpdateValueForRoute(route, publicStore, value);
            db.update(publicCollection, publicStore);
            
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

// Reset database to factory setting

gulp.task('mongo-reset', () => {
    db.connect(url, function(err) {
        if(err) {
            console.log("Error: " + err);
            return; 
        }
    
        publicCollection = db.get().collection('public');
        privateCollection = db.get().collection('private');

        loadData(publicCollection, (data) => {
            let { flights, stats } = data;
            publicStore = { flights, stats };

            console.log("Reached");
            SetDbValue(["flights"], {});
            SetDbValue(["stats"], {
                "flights": 0,
                "seats": 0,
                "swaps": 0,
                "users": 0
            });
        });
        loadData(privateCollection, (data) => {
            let { users } = data;
            privateStore = { users };

            console.log("Reached");
            SetDbValue(["users"], {});
        });

        // db.close();
    });
});

gulp.task('mongo-clone', () => {
    db.connect(url, function(err) {
        if(err) {
            console.log("Error: " + err);
            return; 
        }
    
        publicCollection = db.get().collection('public');
        privateCollection = db.get().collection('private');

        loadData(publicCollection, (data) => {
            let { flights, stats } = data;
            publicStore = { flights, stats };

            fs.writeFile('./stores/publicStore.json', JSON.stringify(publicStore), {encoding:'utf8'}, function(err) {
                console.log("Writing file: Public");
                if(err) console.log("Error occurred writing file: " + err);
            });
        });
        loadData(privateCollection, (data) => {
            let { users } = data;
            privateStore = { users };

            fs.writeFile('./stores/privateStore.json', JSON.stringify(privateStore), {encoding:'utf8'}, function(err) {
                console.log("Writing file: Private");
                if(err) console.log("Error occurred writing file: " + err);
            });
        });
    });
});

gulp.task('mongo-load', () => {
    db.connect(url, function(err) {
        if(err) {
            console.log("Error: " + err);
            return; 
        }
    
        publicCollection = db.get().collection('public');
        privateCollection = db.get().collection('private');
        var route = "stores";
        var publicData = JSON.parse(fs.readFileSync(route+'/publicStore.json', 'utf8'));
        var privateData = JSON.parse(fs.readFileSync(route+'/privateStore.json', 'utf8'));

        loadData(publicCollection, (data) => {
            let { flights, stats } = data;
            publicStore = { flights, stats };

            SetDbValue(["flights"], publicData.flights); 
            SetDbValue(["stats"], publicData.stats);  
        });
        loadData(privateCollection, (data) => {
            let { users } = data;
            privateStore = { users };

            SetDbValue(["users"], privateData.users);  
        });
    });
});
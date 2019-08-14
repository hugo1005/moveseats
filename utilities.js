var SaveData = (type, data, db) => {
    switch(type) {
        case 'FLIGHTS':
            // Save data to backup db
            break
    }
};

exports.LoadData = (collection, reduce, db) => db.open(collection).then((data) => {
    reduce(data);
    console.log("DATA: " + JSON.stringify(data));
});

var GetDay = (date) => (fromDay) => (inc) => new Date(date.setDate(fromDay + inc)).getUTCDate();

var FilterDate = (filterDates) => (date) => {
    // console.log("Filter dates: " + JSON.stringify(filterDates));
    // console.log("Date: " + typeof(date));
    return filterDates.findIndex((d)=> d===date ) > -1;
};

var FilterFromToday = function(n) {
    let date = new Date(Date.now());
    let fromToday = GetDay(new Date(Date.now())) (date.getUTCDate());

    let filter = [];

    // From yesterday 
    for(let i = -1; i <= n; i++) {
        filter.push(fromToday(i));
    }

    return FilterDate(filter);
}

exports.Cleanup = (collection, type, db) => {
    var isActiveDate = FilterFromToday(4);

    console.log("Collection: " + collection);

    db.open(collection).then((data) => {
        switch(type) {
            case 'PUBLIC':
                let flights = data.flights;
                
                SaveData('FLIGHTS', flights);

                for (let key in flights) {
                    let date = +key;   
                    if (!isActiveDate(date)) { 
                        flights[key] = undefined;
                    }
                }

                db.update(collection, data);
                break;
            case 'PRIVATE': 
                let users = data.users;

                for(let user in users) {
                    let seats = users[user].seats;
                    if(seats) {
                        users[user].seats = seats.filter((ref) => {
                            return isActiveDate(+ref.date);
                        });
                    }
                }

                db.update(collection, data);
                break;
        }
    });  
}

// exports.SendMessages = ()
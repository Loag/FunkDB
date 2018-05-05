const fs = require('fs');

// ugly
module.exports.createOrLoad = (path, callback) => {
  // not recommended but whatever
  fs.stat(path, (err, stat) => {
    if (err === null) {
      loadDB(path, (err, db) => {
        if (!err) {
          callback(null, db);
        } else {
          callback(err);
        }
      });

    } else if (err.code == 'ENOENT') {
      createFile(path, (err, db) => {
        if (!err) {
          callback(null, db); // kind of redundant..
        } else {
          callback(err);
        }
      }); 

    } else {
      callback(`An unexpeted error occured opening file. ${err.code}`);
    }
  });
}

module.exports.writeAsync = (path, newDB, emitter) => {
  fs.writeFile(path, JSON.stringify(newDB), (err) => {
    if (!err) {
      emitter.emit('write', 'success');
    } else {
      emitter.emit('write', 'FAILED');
    } 
  });
}

createFile = (path, callback) => {

  const freshDB = {
    createdAt: new Date(),
    data: {

    }
  }

  fs.writeFile(path, JSON.stringify(freshDB), (err) => {
    if (!err) {
      callback(null, freshDB);
    } else {
      callback(`There was a problem creating file. ${err}`);
    } 
  });
}

loadDB = (path, callback) => {
  fs.readFile(path, (err, data) => {
    if (!err) {
      let db;
      try {
        db = JSON.parse(data);
      } catch (err) {
        callback(`There was a problem parsing your alanDB file. ${err}`);
      }
      callback(null, db);
    } else {
      callback(`There was a problem opening file. ${err}`);
    }
  });
}

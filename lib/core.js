const EventEmitter = require('events');
const crypto = require('crypto');
const fileUtils = require('./utils/fileUtils');
const dbUtils = require('./utils/dbUtils');

class Database extends EventEmitter {
  constructor(options) {
    super();
    if (!options || !(options.path)) throw 'You did not specify a file path.';
    if (!this.db) {
      this.path = options.path;
      fileUtils.createOrLoad(this.path, (err, db) => {
        if (!err) {
          if(dbUtils.checkIsAlanDB(db)) {
            this.db = db;
            this.emit('ready', this.path);
          } else {
            throw 'File specified is not valid alanDB';
          }
        } else {
          throw err;
        }
      }); 
    }
  }
  
  newCollection(name, callback) { // probably want to error handle?
    if (!this.db[name]) { 
      this.db.data[name] = [];

      this[name] = {
       
        get: (item, callback) => {
          let type = arguments[0];
          let res = this.db.data[type].find(res => res[Object.keys(item)[0]] === item[Object.keys(item)[0]]);
          if (res) {
            callback(null, res);
          } else {
            callback('could not find item');
          }
        },

        create: (item, callback) => {
          let type = arguments[0];
          this.db.data[type].push(item);
          fileUtils.writeAsync(this.path, this.db, this);
        },

        delete: (item, callback) => {
          let type = arguments[0];
          let index = this.db.data[type].indexOf(item);
          this.db.data[type].splice(index, 1);
          fileUtils.writeAsync(this.path, this.db, this);
        }
      }

      fileUtils.writeAsync(this.path, this.db, this);
      callback(null, 'added new collection');
    }
  }
}

function create(options) {
  return new Database(options);
}

module.exports = create;

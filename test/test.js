const db = require('../lib/core')({path: './test/test.json'});

db.on('ready', (path) => {
  console.log('successfully loaded new db');

  db.newCollection('Products', (err, data) => {
    db.Products.create({'name': 'george'});
    
    db.Products.get({name: 'george'}, (err, data) => {
      console.log(data);
    });
  });
});


db.on('write', (res) => {
  console.log(res);
});

/// Test Script

import FastQl from './../'

var db = new FastQl({
    host     : 'localhost',
    user     : 'root',
    password : 'roottoor',
    database : 'testdb',
    modelPath: `${__dirname}/models`
})

var User = db.models('User').db;

async function index() {
    
    var u = await User.find(1);
    
    User.save(u)
    
    
} 


index()

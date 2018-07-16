/// Test Script

import FastQl from './../'

var db = new FastQl({
    host     : 'localhost',
    user     : 'root',
    password : 'roottoor',
    database : 'testdb2',
    modelPath: `${__dirname}/models`
})

var to = (promise)=>{
    return new Promise((resolve)=>{
        promise.then(res =>{
            resolve({err: null, data: res })
        }).catch(err =>{
            resolve({err: err, data: null })
        })
    })
}

var Author = db.models('Author').db;

async function index() {

    Author.select('id, first_name, last_name').search(['first_name'],'G').forPage(2,2).then(res =>{
        console.log(res)
    })

} 


index()

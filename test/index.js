/// Test Script

import FastQl from './../'
import { resolve } from 'url';

var db = new FastQl({
    host     : 'localhost',
    user     : 'root',
    password : 'roottoor',
    database : 'testdb',
    modelPath: `${__dirname}/models`
})

var to = (promise)=>{
    return new Promise((resolve, rejects)=>{
        promise.then(res =>{
            resolve({err: null, data: res })
        }).catch(err =>{
            resolve({err: err, data: null })
        })
    })
}

var User = db.models('User').db;

async function index() {
    
    var u = User.search(['first_name','email'], 'Bridgette').then(res=>{
        console.log(res)
    }).catch(err =>{
        console.log('err :', err.sqlMessage)
    })
        
} 


index()

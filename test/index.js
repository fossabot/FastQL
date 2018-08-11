/// Test Script

import FastQl from './../'

var db = new FastQl({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'DiwBN6969',
    database : 'testdb',
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

var Users = db.models('Users');
async function index() {
    
    Users.search(['email'],'gov').forPage(1,5)
        .then(res =>{
        console.log(res)
    })

} 


index()

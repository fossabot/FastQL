/// Test Script

import FastQl from './../'

var db = new FastQl({
    host     : '192.168.1.102',
    user     : 'root',
    password : '',
    database : '',
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

var Order = db.models('Order').db;

async function index() {

    Order.select('id, name').search(['user_id'], 26).orderBy('id','desc').forPage(0,2).then(res =>{
       console.log(res)
    })

} 


index()

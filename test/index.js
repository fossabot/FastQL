/// Test Script

import FastQl from './../'
import { resolve } from 'url';

var db = new FastQl({
    host     : '192.168.1.102',
    user     : 'root',
    password : '',
    database : '',
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

var Order = db.models('Order').db;

async function index() {
    
    Order.search(['user_id'], '26').then(res=>{
        console.log(res)
    }).catch(err =>{
        console.log('err :', err.sqlMessage)
    })
        
} 


index()

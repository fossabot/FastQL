import mysql from 'mysql';

export default class FastQl {

    constructor(config) {
        this.modelPath = config.modelPath;
        this.db = mysql.createConnection(config)
        this.table_name = "";
        this.primary_name = "";
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.db.query(sql, args, (err, rows) => {
                //console.log(err)
                if (err)
                    return resolve({ err: err, data: null });
                this.end()
                resolve({ err: null, data: rows });
            });
        });
    }

    end() {
        return new Promise((resolve, reject) => {
            this.db.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }

    dbs() {
        return this.query('show databases')
    }

    table(name) {       
        this.table_name = name;  
    }

    primary(name) {
        this.primary_name = name;
    }

    models(model) {
        var app = require('auto-loader').load(this.modelPath)
        return app[model](this)
    }

    save(data){
        console.log(data)
    }

    async find(name) {
        var { err, data } = await this
            .query(`select * from ${this.table_name} where ${this.primary_name}=${name}`);
            //console.log('err log : ', err?err:'no error')
        return new Promise((resolve, reject) => {
            if(err){
                reject(err)
            }
            if (data.length > 0) {
                resolve(data[0])
            } else {
                resolve(false)
            }
        })

    }

    async where(column,operator,value){

    }


}





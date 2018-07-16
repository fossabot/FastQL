import mysql from 'mysql';

export default class FastQl {

    constructor(config) {
        this.modelPath = config.modelPath;
        this.db = mysql.createConnection(config)
        this.table_name = "";
        this.primary_name = "";
        this.sql = "";
        this.selectColumn = "";
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.db.query(sql, args, (err, rows) => {
                if (err)
                    return resolve({ err: err, data: null });
                this.reset()
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

    reset() {
        this.sql = "";
        this.where_status = false;
        this.selectColumn = "";
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

    select(column) {
        if (column) {
            this.selectColumn = column;
        }
        this.sql = `select ${this.selectColumn ? this.selectColumn : '*'} from ${this.table_name}`
        return this;
    }


    async find(value) {
        return this.select()
            .where(this.primary_name, '=', value)
            .first();
    }

    async get() {
        console.log(this.sql)
        var { err, data } = await this
            .query(this.sql);
        return new Promise((resolve, reject) => {
            if (err) {
                reject(err)
            }
            resolve(data)
        })
    }

    async first() {
        var { err, data } = await this
            .query(this.sql);
        return new Promise((resolve, reject) => {
            if (err) {
                reject(err)
            }
            if (data.length > 0) {
                resolve(data[0])
            } else {
                resolve(false)
            }
        })
    }

    where(column, operator, value) {
        if (!this.where_status) {
            this.where_status = true;
            this.sql += ` where ${column} ${operator} '${value}'`;
        } else {
            this.sql += ` and ${column} ${operator} '${value}'`;
        }
        return this;
    }

    or(column, operator, value) {
        this.sql += ` or ${column} ${operator} '${value}'`;
        return this;
    }


    search(columns, value) {
        this.select().where(columns[0], 'like', `%${value}%`)        
        if(columns.length == 1){           
            return this;
        }
        var count = columns.length;
        var i = 0;
        for (let item of columns) {
            console.log(item)
            if (i !== 0) {         
                this.or(item, 'like', `%${value}%`)
            }
            console.log(i + 1,  count)
            if (i + 1 == count) {
                return this;
            }

            i++;
        }
        
    }


}





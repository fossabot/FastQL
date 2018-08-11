
/*
##################################
 _____         _    ___  _     
|  ___|_ _ ___| |_ / _ \| |    
| |_ / _` / __| __| | | | |    
|  _| (_| \__ \ |_| |_| | |___ 
|_|  \__,_|___/\__|\__\_\_____|
##################################                               
*/

import mysql from "mysql";
import SqlString from "sqlstring";

export default class FastQl {
    constructor(config) {
        this.config = config;
        this.modelPath = config.modelPath;
        this.table_name = "";
        this.primary_name = "";
        this.sql = "";
        this.selectColumn = "";
        this.end_query = true;
        this.where_status = false;
        //process.stdout.write('\x1B[2J');
        this.db = mysql.createConnection(this.config);


    }

    input(value) {
        return SqlString.escape(value);
    }

    query(sql, args) {
        
        var es_sql = SqlString.format(sql);

        console.log("\x1b[31m", "#############################");
        console.log("\x1b[31m", "#############################");
        console.log(" ## SQL QUERY ##");
        console.log(" ");
        console.log(es_sql);
        console.log(" ");
        console.log(" #############################");
        console.log(" #############################");
        console.log("\x1b[0m");

        return new Promise((resolve, reject) => {
            this.db.query(es_sql, args, (err, rows) => {
                
                if (err) return resolve({ err: err, data: null });

                if (this.end_query) {
                    this.reset();
                    //this.end();
                } else {
                    // process.stdout.write('\x1B[2J');
                }

                resolve({ err: null, data: rows });
            });
        });
    }

    end() {
        this.db.end(err => {
            //console.log(err)
            // end.
        });
    }

    dbs() {
        return this.query("show databases");
    }

    reset() {
        this.sql = "";
        this.where_status = false;
        this.selectColumn = "";
        this.end_query = true;
    }

    table(name) {
        this.table_name = name;
    }

    async tables() {
        var { err, data } = await this.query(`show tables`);
        return new Promise((resolve, reject) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    }

    async columns() {
        var { err, data } = await this.query(`show columns from ${this.table_name}`);
        return new Promise((resolve, reject) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    }


    primary(name) {
        this.primary_name = name;
    }

    models(model) {
        var app = require("auto-loader").load(this.modelPath)[model]["default"];
        //console.log(app)
        return app(this);
    }

    select(column) {
        if (column) {
            this.selectColumn = column;
        }else{
            this.selectColumn = '*';
        }
        this.sql = `select ${this.selectColumn ? this.selectColumn : "*"} from ${this.table_name}`;
        return this;
    }

    find(value) {
        if (!this.sql) {
            this.select();
        }
        return this.where(this.primary_name, "=", value)
            .first();
    }

    async get() {        
        if (!this.sql) {
            this.select();
        }
        var { err, data } = await this.query(this.sql);
        return new Promise((resolve, reject) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    }

    async first() {
        if (!this.sql) {
            this.select();
        }
        console.log(this.sql, this.selectColumn)
        var { err, data } = await this.query(this.sql);
        return new Promise((resolve, reject) => {
            if (err) {
                reject(err);
            }
            if (data.length > 0) {
                resolve(data[0]);
            } else {
                resolve(false);
            }
        });
    }


    async forPage(currentPage, perPage) {
        if (!this.sql) {
            this.select();
        }
        var n = this.sql.search(`from ${this.table_name}`);
        var sql_count = this.sql;
        this.end_query = false;
        var { err, data } = await this.query(`select count(${this.primary_name}) as total ${sql_count.substr(n)}`);
        this.end_query = true;
        var totalData = data[0].total;
        var total_pages = Math.ceil(totalData / perPage);
        var start_index = (currentPage - 1) * perPage;
        this.sql += ` limit ${parseFloat(start_index)},${parseFloat((perPage))}`;
        var { err, data } = await this.query(this.sql);
        var model = {
            currentPage: currentPage,
            perPage: perPage,
            totalPage: total_pages,
            totalData: totalData,
            data: data ? data : []
        }
        return new Promise((resolve, reject) => {
            if (err) {
                reject(err);
            }
            resolve(model);
        });
    }

    check_operator(operator) {
        switch (operator) {
            case '=':
                return true
            case '<':
                return true
            case '>':
                return true
            case 'like':
                return true
            default:
                return false
        }

    }

    where(column, operator, value) {
        // defalut operator '='
        if (!this.sql) {
            this.select();
        }
        if (!this.check_operator(operator) && !value) {
            value = operator;
            operator = '=';
        }
        if (!this.where_status) {
            this.where_status = true;
            this.sql += ` where ${column} ${operator} ${this.input(value)}`;
        } else {
            this.sql += ` and ${column} ${operator} ${this.input(value)}`;
        }
        return this;
    }

    or(column, operator, value) {
        if (!this.check_operator(operator) && !value) {
            value = operator;
            operator = '=';
        }
        this.sql += ` or ${column} ${operator} ${this.input(value)}`;
        return this;
    }

    orderBy(column, sort) {
        this.sql += ` order by ${column} ${sort == 'desc' ? 'desc' : 'asc'}`;
        return this;
    }

    limit(skip, limit) {
        this.sql += ` limit ${parseFloat(skip)}${limit ? ',' : ''}${limit ? parseFloat(limit) : ''}`;
        return this;
    }

    search(columns, value) {
        if (!this.sql) {
            this.select();
        }
        this.where(columns[0], "like", `%${value}%`);
        if (columns.length == 1) {
            return this;
        }
        var count = columns.length;
        var i = 0;
        for (let item of columns) {
            if (i !== 0) {
                this.or(item, "like", `%${value}%`);
            }
            if (i + 1 == count) {
                return this;
            }

            i++;
        }
    }

    // hashOne(name_fun, model, column1, column2){
    //     this[name_fun] = ()=>{

    //     }
    // }

}

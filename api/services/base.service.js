const mysql = require("mysql");
const dbConfig = require("../configs")("db");
// const models = require("../models");

class BaseService {
  constructor() {
    this.name = this.constructor.name.replace(`Service`, ``);
    this.table = this.name.unCamelize();
    this.ModelClass = require(`../models/${this.name.unCamelize()}.model`);
    //this.model = new ModelClass();
  }

  static db;
  static connect = () => {
    if (!BaseService.db) {
      BaseService.db = mysql.createPool({
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        user: dbConfig.USER,
        password: dbConfig.PASS,
        database: dbConfig.NAME,
      });
    }
    return BaseService.db;
  };

  static executeQuery = async (sql, params) => {
    return await new Promise((resolve, reject) => {
      BaseService.connect().query(sql, params, (err, rows) => {
        if (err) {
          return reject(err);
        }
        return resolve(rows);
      });
    });
  };
  executeQuery= async (sql, params) => {
    return await BaseService.executeQuery(sql, params)
  }

  select = async (params) => {
    let sql = `SELECT * FROM ${this.table} WHERE deleted = ?`;
    if(params?.where){
        sql += ` AND (${params.where.replace('&&','AND').replace('||','OR')})`;
    }
    sql += ";"
    const rows = await BaseService.executeQuery(sql, [0]);
    return this.ModelClass.from(rows);
  };

  insert = async (params, forceId = false) => {
    if(Array.isArray(params)){
      if(params.length === 0) return null;
      const objects = this.ModelClass.from(params);
      const first = [...objects].pop().getProps();
      if(!forceId) delete first.id;
      const columns = Object.keys(first).join(',');
      let values = [];
      objects.forEach(object => {
        if(!forceId) delete object.id;
        values.push("(" + Object.values(object.getSqlProps()).join(',') + ")");
      })
      values = values.join(',');
      const sql = `INSERT INTO ${this.table} (${columns}) VALUES ${values};`;
      const result = await BaseService.executeQuery(sql);
      const rows = await this.select({where:`id >= ${result.insertId} && id < ${result.insertId + result.affectedRows}`});
      return rows;
    }
    else{
      const object = this.ModelClass.from(params);
      if(!forceId) delete object.id;
      const columns = Object.keys(object.getProps()).join(',');
      const values = Object.values(object.getSqlProps()).join(',')
      const sql = `INSERT INTO ${this.table} (${columns}) VALUES (${values});`;
      const result = await BaseService.executeQuery(sql);
      const rows = await this.select({where:`id=${result.insertId}`});
      return rows.length === 1 ? rows.pop() : null;
    
    }
  }

}
module.exports = BaseService;
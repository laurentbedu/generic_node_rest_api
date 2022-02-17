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

  selectWhere = async (params) => {
    let sql = `SELECT * FROM ${this.table} WHERE deleted = ?`;
    if(params?.where){
        sql += ` AND (${params.where.replace('&&','AND').replace('||','OR')})`;
    }
    sql += ";"
    const rows = await BaseService.executeQuery(sql, [0]);
    return this.ModelClass.from(rows);
  };

}
module.exports = BaseService;
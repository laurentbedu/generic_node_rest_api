const BaseController = require("./base.controller");

class DbController extends BaseController{

    constructor() {
        super(false);
        this.table = this.name.unCamelize();
        const ServiceClass = require(`../services/${this.name.unCamelize()}.service`);
        this.service = new ServiceClass();
        this.initializeActions();
    }

    initializeActions = () => {
      
        this.getAll = async () => {
            const result = await this.service.selectWhere();
            return result;
        }

        this.getOne = async (req) => {
            const result = await this.service.selectWhere({where:`id=${req.params.id}`});
            return result.length === 1 ? result.pop() : null;
        }

        this.getWhere = async (req) => {
            const result = await this.service.selectWhere({where: req.body.where});
            return result;
        }

        this.createOneOrMany = async (req) => {//TODO HERE
            return `${this.table} createOneOrMany`
        }

        this.updateOne = async (req) => {
            return `${this.table} updateOne`
        }

        this.updateWhere = async (req) => {
            return `${this.table} updateWhere`
        }

        this.softDeleteOne = async (req) => {
            return `${this.table} softDeleteOne`
        }

        this.softDeleteWhere = async (req) => {
            return `${this.table} softDeleteWhere`
        }


    }
    
}
  

module.exports = DbController;
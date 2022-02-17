const BaseController = require("./base.controller");
const MailerService = require('../services/mailer.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const appConfig = require("../configs")("app");


class AuthController extends BaseController {

    getUser = async (login) => {

        const UserServiceClass = require('../services/app_user.service');
        const service = new UserServiceClass();
        const users = await service.selectWhere({where: `login = '${login}'`});
        return users.length === 1 ? users.pop() : null;
    }

    login = async (req) => {
        if(req.method !== 'POST') return {status:405};

        const user = await this.getUser(req.body.email);
        if(user){
            const result =  await bcrypt.compare(req.body.password, `${appConfig.HASH_PREFIX + user.password}`);
            if(result){
                const payload = {email: user.login, role: user.user_role_id};
                const token = jwt.sign(payload, appConfig.JWT_SECRET, { expiresIn: '1d' });
                return {data:{...payload}, cookie:token};
            }
        }
        return {status:401};
    }

    register = async (req) => {
        if(req.method !== 'POST') return {status:405};
        
        const user = await this.getUser(req.body.email);
        if(!user){
            const payload = {mail: req.body.email, role: 1};
            const token = jwt.sign(payload, appConfig.JWT_SECRET, { expiresIn: '1d' });
            //SEND MAIL
            const html = 
            `
            <b>Confirmez votre inscription : </b>
            <a href="http://localhost:3000/account/validation?t=${encodeURIComponent(token)}" target="_blank">Confirmer</a>
            
            `;
            await MailerService.send({to: req.body.email, subject:"Confirmer votre inscription", html});
            return true;
        }
        return false;

    }
    
  
  }
  module.exports = AuthController;
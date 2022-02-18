const BaseController = require("./base.controller");
const MailerService = require('../services/mailer.service');
const UserServiceClass = require('../services/app_user.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const appConfig = require("../configs")("app");


class AuthController extends BaseController {

    getUser = async (login) => {   
        const service = new UserServiceClass();
        const users = await service.select({where: `login = '${login}'`});
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
                return {data:{completed:true, message:`Bonjour ${user.login} !`, cookie:token, ...payload}, cookie:token};
            }
        }
        return {data:{completed:false, message:"Identifiant ou mot de passe incorrect !"}};
    }

    register = async (req) => {
        if(req.method !== 'POST') return {status:405};
        
        const user = await this.getUser(req.body.email);
        if(!user){
            const payload = {email: req.body.email, role: 1, password: req.body.password};
            const token = jwt.sign(payload, appConfig.JWT_SECRET, { expiresIn: '1d' });
            //SEND MAIL
            const html = `
                <b>Confirmez votre inscription : </b>
                <a href="http://localhost:3000/account/validation?t=${encodeURIComponent(token)}" target="_blank">Confirmer</a>
            `;
            //http://localhost:5000/auth/validate?t=${encodeURIComponent(token)}
            //http://localhost:3000/account/validation?t=${encodeURIComponent(token)}
            await MailerService.send({to: req.body.email, subject:"Confirmer votre inscription", html});
            return {data:{completed:true, message:"Vous avez reçu un mail de confirmation pour valider votre inscription"}};
        }
        return {data:{compteted:false, message:"Il existe déjà un compte associé à cet adresse mail !"}};

    }

    validate = async (req) => {
        if(req.method !== 'POST') return {status:405};
        
        const token = req.body.token;
        let payload;
        try{
            payload = jwt.verify(token, appConfig.JWT_SECRET); 
        }
        catch{
            return {data:{completed:false, message:"Une erreur est survenue ..."}};
        }
        if(payload){
            const service = new UserServiceClass();
            const password = (await bcrypt.hash(payload.password,8)).replace(appConfig.HASH_PREFIX,'')
            const user = await service.insert({login:payload.email, password, user_role_id:payload.role});
            return user ? 
                {data:{completed:true, message:"Bienvenu sur shoponline ! Votre compte est maintennant actif, vous pouvez vous connecter."}} :
                {data:{completed:false, message:"Une erreur est survenue ..."}};
        }
        return {data:{completed:false, message:"L'activation de votre compte a expiré, réinscrivez vous ..."}};
    }

    renew = async (req) => {
        if(req.method !== 'POST') return {status:405};
    }
    
  
  }
  module.exports = AuthController;
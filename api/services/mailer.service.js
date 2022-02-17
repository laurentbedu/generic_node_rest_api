const nodemailer = require("nodemailer");
const mailerConfig = require("../configs")("mailer");

class MailerService {
  

  static send = async (params) => {
    const mailParams = {
      subject: "email test",
      html: "<b>message de test</b>",
    };
    if (!params || !params.to) {
      const receiverAccount = await nodemailer.createTestAccount();
      mailParams.to = receiverAccount.user;
    }
    Object.assign(mailParams, params);

    let senderAccount = mailerConfig;
    if (!senderAccount) {
      senderAccount = await nodemailer.createTestAccount();
    }
    mailParams.from = senderAccount.user;
    
    const transporter = nodemailer.createTransport({
      host: senderAccount.smtp.host,
      port: senderAccount.smtp.port,
      secure: senderAccount.smtp.secure,
      auth: {
        user: senderAccount.user,
        pass: senderAccount.pass,
      },
    });

    await transporter.sendMail(mailParams, (err, info) => {
        if(err){
            console.log('Error occurred. ' + err.message);
            return false;
        }
        console.log("Email sent : ", info , "\nView sent mail at : " , nodemailer.getTestMessageUrl(info));
        return true;
    });
  };
  
}

module.exports = MailerService;

const { append } = require("express/lib/response");

const expressRouter = require("express").Router;

class BaseRouter {

  constructor(withRoutesInitialization = true) {
    this.router = expressRouter();
    this.name = this.constructor.name.replace(`Router`, ``);
    const ControllerClass = require(`../controllers/${this.name.unCamelize()}.controller`);
    this.controller = new ControllerClass();
    withRoutesInitialization ? this.initializeRoutes() : null;
  }

  initializeRoutes = () => {
    console.log(`init routes for ${this.name}`);
    
    this.router.all("/:action", async (req, res) => {
        if(!this.controller[req.params.action]) res.status(400).json(null)
        
        const response = await this.controller[req.params.action](req);
        if(response.cookie){
            res.cookie('auth', response.cookie, { maxAge: 60*60*24});
            // delete response.cookie;
        }
        res.status(response.status || 200).json(response.data);
    });
  }

}
module.exports = BaseRouter;

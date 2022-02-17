
class BaseController {

  constructor(withActionsInitialization = true) {
    
    this.name = this.constructor.name.replace(`Controller`, ``);
    
    withActionsInitialization ? this.initializeActions() : null;
  }

  initializeActions = () => {
    
  }

}
module.exports = BaseController;
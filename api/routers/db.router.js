const { append } = require("express/lib/response");
const BaseRouter = require("./base.router");

class DbRouter extends BaseRouter{

    constructor() {
        super(false);
        this.table = this.name.unCamelize();
        this.initializeRoutes();
    }

    initializeRoutes = () => {
        console.log(`init routes for db ${this.name}`)
        
        //GET /table getAll-> selectWhere
        this.router.get("/", async (req, res) => {
            const response = await this.controller.getAll();
            res.json(response);
        });
        //GET /table/:id getById-> selectWhere
        this.router.get("/:id", async (req, res) => {
            const response = await this.controller.getOne(req);
            res.json(response);
        });

        //PATCH /table getWhere-> selectWhere + with
        this.router.patch("/", async (req, res) => {
            const response = await this.controller.getWhere(req);
            res.json(response);
        });

        ////PATCH /table/all/:relations getAllWith-> selectWhere + with one relation

        ////PATCH /table/some/:relations getWhereWith-> selectWhere + with one relation

        ////PATCH /table/one/:id/:relations getByIdWith-> selectWhere + with one relation

        //POST /table -> insertOne or insertMany
        this.router.post("/", async (req, res) => {
            const response = await this.controller.createOneOrMany(req);
            res.json(response);
        });

        //POST /table/:id -> updateOne
        this.router.post("/:id", async (req, res) => {
            const response = await this.controller.updateOne(req);
            res.json(response);
        });

        //PUT /table -> updateWhere 
        this.router.put("/", async (req, res) => {
            const response = await this.controller.updateWhere(req);
            res.json(response);
        });

        //PUT /table/:id -> softDeleteOne
        this.router.put("/:id", async (req, res) => {
            const response = await this.controller.softDeleteOne(req);
            res.json(response);
        });

        //DELETE /table -> softDeleteWhere
        this.router.delete("/", async (req, res) => {
            const response = await this.controller.softDeleteWhere(req);
            res.json(response);
        });

        //DELETE /table/all -> hardDeleteAll

        //DELETE /table/:id -> hardDeleteOne



    }
  
  }
  module.exports = DbRouter;
require("./api/helpers/string.helper");

const express = require("express");

const app = express();

const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use(express.json());
// app.use(express.urlencoded({extended:true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const routers = require("./api/routers");
for (const route in routers) {
  app.use(`/${route}`, new routers[route]().router);
}

const config = require("./api/configs")("app");
app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}.`);
});

const bp = 0;

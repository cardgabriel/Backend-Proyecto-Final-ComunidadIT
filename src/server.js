/* Variables globales */
process.env.BASE_URL = "http://localhost:8888/";
process.env.VIDEOS_URL = process.env.BASE_URL + "videoscont/";

/* Modulos */
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

/* Routes */
const videosRoutes = require("./routes/videos_routes");
const sessionRoutes = require("./routes/session_routes");

const app = express();

/* Configuracion de bodyParser */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

const session = require("express-session");
const FileStore = require("session-file-store")(session);
const auth = require("./auth");

/* Configuracion de recursos estaticos */
app.use(express.static("./public"));

/* Configuracion del acceso a la url de origin */
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type"],
  })
);

app.use(
  session({
    store: new FileStore(),
    secret: "123456",
    resave: false,
    saveUninitialized: true,
    name: "simplifikate",
  })
);

app.use("/auth", sessionRoutes);
app.use("/videos", videosRoutes);

/*Inicializa servidor en puerto nro 8888*/
app.listen(8888, () => {
  console.log("Escuchando...");
});

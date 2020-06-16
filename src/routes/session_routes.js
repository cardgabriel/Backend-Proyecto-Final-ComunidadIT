const express = require("express");
const router = express.Router();
const conexion = require("../connection");

//Iniciar Sesion
router.post("/", (req, res) => {
  let sql = `
              SELECT *
              FROM usuarios
              WHERE user_nick = ?
              AND user_pass = ?
            `;
  let values = [req.body.user, req.body.password];

  conexion.query(sql, values, (err, result, fields) => {
    if (err) {
      res.json({
        status: "error",
        message:
          "No es posible acceder en este momento, intente en unos minutos",
      });
    } else {
      if (result.length == 1) {
        req.session.user = req.body.user;
        req.session.userId = result[0].user_id;

        res.json({
          status: "ok",
          message: "sesion iniciada",
          loggedUser: {
            id: req.session.user_id,
            nombre: result[0].user_name,
          },
        });
      } else {
        res.json({
          status: "error",
          message: "Usuario y/o password no validos",
        });
      }
    }
  });
});

//Cerrar Sesion
router.delete("/", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.json({
        status: "error",
        message: "Error al cerrar la sesion",
      });
    } else {
      res.clearCookie("simplifikate");
      res.json({
        status: "ok",
        message: "Sesion Cerrada",
      });
    }
  });
});

module.exports = router;

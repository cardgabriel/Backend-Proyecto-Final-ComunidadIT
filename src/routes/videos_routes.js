const express = require("express");
const router = express.Router();
const conexion = require("../connection");
const path = require("path");
const fs = require("fs");

//Todos los videos
router.get("/", (req, res) => {
  let sql = `SELECT vid_id AS id, vid_nombre , vid_url , cic_id
            FROM videos`;

  conexion.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

//Video en especifico
router.get("/:id", (req, res) => {
  let sql = `SELECT vid_id AS id, vid_nombre , vid_url , cic_id
            FROM videos
            WHERE vid_id = ${req.params.id}`;

  conexion.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result[0]);
  });
});

//Guarda Videos
router.post("/", (req, res) => {
  let videoFileName = "";

  if (req.files) {
    let videoUrl = req.files.videoUrl;

    videoFileName = Date.now() + path.extname(videoUrl.name);

    videoUrl.mv("./public/videoscont/" + videoFileName, function (err) {
      if (err) {
        console.log(err);
      }
    });

    console.log(videoFileName);
  } else {
    console.log("No hay video");
  }

  let sqlInsert = `INSERT INTO videos(vid_nombre , cic_id , vid_url) 
                    VALUES(
                      '${req.body.videoName}',
                      '${req.body.videoCiclo}',
                      '${process.env.VIDEOS_URL + videoFileName}'
                    )`;

  conexion.query(sqlInsert, function (err, result, fields) {
    if (err) {
      res.json({
        status: "error",
        message: "Error al subir video",
      });
    } else {
      res.json({
        status: "ok",
        message: "Video subido correctamente",
      });
    }
  });
});

//Modificar Video
router.put("/:id", (req, res) => {
  let videoFileName = "";

  let sqlUpdate = `UPDATE videos  
                    SET vid_nombre = ?,
                        cic_id = ? `;

  let values = [req.body.videoName, req.body.videoCiclo];

  if (req.files) {
    //Borrar el archivo de la imagen anterior
    conexion.query(
      "SELECT vid_url FROM videos WHERE vid_id=" + req.params.id,
      function (err, result, fields) {
        if (err) {
          console.log("Error");
        } else {
          fs.unlink(
            "./public/videoscont/" + path.basename(result[0].vid_url),
            (err) => {
              if (err) throw err;
              console.log("Archivo borrado");
            }
          );
        }
      }
    );

    let videoUrl = req.files.videoUrl;

    videoFileName = Date.now() + path.extname(videoUrl.name);

    videoUrl.mv("./public/videoscont/" + videoFileName, function (err) {
      if (err) {
        console.log(err);
      }
    });

    sqlUpdate += ", vid_url = ?";
    values.push(process.env.VIDEOS_URL + videoFileName);
  } else {
    console.log("No hay video");
  }

  sqlUpdate += "WHERE vid_id = ?";
  values.push(req.params.id);

  conexion.query(sqlUpdate, values, function (err, result, fields) {
    if (err) {
      res.json({
        status: "error",
        message: "Error al modificar video",
      });
    } else {
      res.json({
        status: "ok",
        message: "Video modificado correctamente",
      });
    }
  });
});

router.delete("/:id", (req, res) => {
  let sqlDelete = `DELETE FROM videos WHERE vid_id = ?`;

  values = [req.params.id];

  conexion.query(sqlDelete, values, (err, result, fields) => {
    if (err) {
      res.json({
        status: "error",
        message: "Error al eliminar el video",
      });
    } else {
      res.json({
        status: "ok",
        message: "Video eliminado correctamente",
      });
    }
  });
});

module.exports = router;

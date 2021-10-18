const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db.json");
const uuid = require("./uniqueID/uuid");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// now we work on routes for homepage

app.get("/", function (req, res) {

    res.sendFile(path.join(__dirname, "/public/index.html"));

  });
  
  // route for notes page

  app.get("/notes", function (req, res) {

    res.sendFile(path.join(__dirname, "/public/notes.html"));

  });
  
  // GET all saved notes

  app.get("/api/notes", (req, res) =>

    fs.readFile(path.join(__dirname, "./db/db.json"), "utf-8", (err, data) => {

      if (err) {

        throw err;

      }
      
      const notes = JSON.parse(data);
      res.json(notes);

    })
  );
  
  // POST route to begin adding new notes and calling on uniqueID file

  app.post("/api/notes", (req, res) => {


    fs.readFile(path.join(__dirname, "./db/db.json"), "utf-8", (err, data) => {

      if (err) {

        console.log(err);

      }

      const { title, text } = req.body;
      const notes = JSON.parse(data);
  
      if (req.body) {

        const newNote = {

          title,
          text,
          id: uuid(),

        };
  
        notes.push(newNote);
        res.json(newNote);
  
        fs.writeFileSync(

          path.join(__dirname, "./db/db.json"),
          JSON.stringify(notes, null, 2),
          "utf-8",
          (err) => {

            if (err) throw err;
            console.log("working - new note");

          }
        );
      }
    });
  });
  
  app.listen(PORT, () => console.log(`Listening to server on port ${PORT}`));

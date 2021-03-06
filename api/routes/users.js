const express = require('express');
const router = express.Router();
const db = require("../db/index.js");
const bodyParser = require("body-parser");
router.use(bodyParser.json({type: "application/*+json"}));
/* GET users listing. */
router.get('/', async function (req, res, next) {
    let rez = await getAllUsers();
    res.json(rez.rows);
});

router.get('/role', async function (req, res, next) {
    let rez = await getAllUsersWithRole();
    res.json(rez.rows);
});


let getAllUsers = async function () {
    return db.query(
        `SELECT ime, prezime, mail
         from osobe`
    );
};

let getAllUsersWithRole = async function () {
    return db.query(
        `SELECT ime, prezime, mail, id, id_uloga
         from osobe`
    );
};


module.exports = router;

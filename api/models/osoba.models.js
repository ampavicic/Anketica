const db = require('../db')

module.exports = class Osoba {
        constructor(ime, prezime, mail, datum_rod, rod, password) {
            this.id = undefined;
            this.id_uloga = undefined;
            this.ime = ime;
            this.prezime = prezime;
            this.mail = mail;
            this.datum_rod = datum_rod;
            this.rod = rod;
            this.password = password;

        }

        //Ana nekuzim kaj je ovo?
        get age() {
            return (new Date()).getFullYear() - this.DOB.getFullYear();
        }
        get formattedOsoba() {
            return ((this.rod == 'm') ? 'Mr. ' : 'Mrs.') +
                this.firstName +
                ' ' + this.lastName;
        }

        //dohvat korisnika na osnovu email adrese
        static async fetchByEmail(email) {

            let results = await dbGetOsobaByEmail(email)
            let newOsoba = new Osoba()

            if( results.length > 0 ) {
                newOsoba = new Osoba(results[0].ime, results[0].prezime, 
                    results[0].mail, results[0].datum_rod, results[0].rod, results[0].password)
                newOsoba.id = results[0].id
            }
            return newOsoba
        }

        //dohvat korisnika na osnovu id korisnika (tablica osoba)
        static async fetchByOsobaId(id) {
       
            let results = await dbGetOsobaById(id)
            let newOsoba = new Osoba()

            if( results.length > 0 ) {
                newOsoba = new Osoba(results[0].ime, results[0].prezime, 
                    results[0].mail, results[0].datum_rod, results[0].rod, results[0].password)
                newOsoba.id = results[0].id
            }
            return newOsoba
        }

        //da li je korisnik pohranjen u bazu podataka?
        isPersisted() {
            return this.id !== undefined
        }

        //provjera zaporke
        checkPassword(password) {
            return this.password ? this.password == password : false
        }

        //pohrana korisnika u bazu podataka
        async persist() {
            try {
                let osobaID = await dbNewOsoba(this)
                this.id = osobaID
            } catch(err) {
                console.log("ERROR persisting osoba data: " + JSON.stringify(this))
                throw err
            }
        }
    };

//dohvat korisnika iz baze podataka na osnovu email adrese (stupac mail)
dbGetOsobaByEmail = async (email) => {
    const sql = `SELECT * FROM osobe WHERE mail = '` + email + `'`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

//dohvat korisnika iz baze podataka na osnovu id korisnika (stupac id)
dbGetOsobaById = async (id) => {
    const sql = `SELECT * FROM osobe WHERE id = ` + id;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

//umetanje zapisa o korisniku u bazu podataka
dbNewOsoba = async (osoba) => {
    const sql = "INSERT INTO osobe ( ime, prezime, mail, datum_rod, rod, password)" +
     " VALUES ('" + osoba.ime + "','" + osoba.prezime + "','" + osoba.mail + "','" + osoba.datum_rod 
     + "','" + osoba.rod + "','" + osoba.password + "') RETURNING id";

    try {
        const result = await db.query(sql, []);
        return result.rows[0].id;
    } catch (err) {
        console.log(err);
        throw err
    }
}

/* 
OsobaClass.prototype.toString = function() {
    return this.formattedAuthor;
}
module.exports = OsobaClass; */
module.exports = {
    name: 'submit',
    category: 'general',
    utilisation: '',
    description: '',
    admin: false,

    async execute(req, res) {
        const sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database('./db/leaderboard.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        db.serialize(function() {
            db.run(`INSERT INTO leaderboard (score, name, date) 
                VALUES (${req.body['score']}, \"${req.body['name']}\", datetime('now')) `);
        });

        db.close();
        res.send({name: req.body['name'], score: req.body['score']});
    },
};

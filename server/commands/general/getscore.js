module.exports = {
    name: 'getscore',
    category: 'general',
    utilisation: '',
    description: '',
    admin: false,

    async execute(req, res) {
        const sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database('./db/leaderboard.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

        let sqlQuery = "SELECT * FROM leaderboard ORDER BY score DESC, date ASC LIMIT 5;"

        let result = {};
        let place = 0;
        
        db.serialize(function() {
            db.all(sqlQuery, [], (err, rows) => {
                if (err) {
                    throw err;
                }

                rows.forEach((row) => {
                    result[`${place}`] = {};
                    result[`${place}`].name = row.name
                    result[`${place}`].date = row.date;
                    result[`${place}`].score = row.score;

                    place++;
                });

                console.log(result);
                res.send(result);
            })
        });
        
        db.close();
    },
};

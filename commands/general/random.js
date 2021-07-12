module.exports = {
    name: 'random',
    category: 'general',
    utilisation: '',
    description: '',
    admin: false,

    async execute(req, res) {
        // Responds a random number within boundary 30-60
        const x = Math.floor(Math.random() * 30) + 30;
        const y = Math.floor(Math.random() * 30) + 30;
        res.send({x: x, y: y});
    },
};
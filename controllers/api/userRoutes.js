const router = require('express').Router();
const { User } = require('../../models/index');

router.post('/', async (req, res) => {
    try {
        const dbUserData = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        req.session.save(() => {
            req.session.loggedIn = true;

            res.status(200).json(dbUserData);
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const dbUserData = await User.findOne({
            where: {
                email: req.body.email
            },
        });
    if (!dbUserData) {
        res.status(400).json({ message: 'Incorrect Email or Password. Please Try Again' })
        return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if(!validPassword) {
        res.status(400).json({ message: 'Incorrect Email or Password. Please Try Again' });
        return;
    }

    req.session.save(() => {
        req.session.loggedIn = true;

        res.status(200).json({ user: dbUserData, message: 'You Are Now Logged In' })
    });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}); 

router.post('/logout', async (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end()
    }
});

module.exports = router;
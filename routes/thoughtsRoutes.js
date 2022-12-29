const express = require('express');

const router = express.Router();

const ThoughtsController = require('../controllers/ThoughtsController');

// helpers = vÊ se o usuário está logado corretamente
const checkAuth = require('../helpers/auth').checkAuth;

router.get('/add', checkAuth, ThoughtsController.createThoughts);
router.post('/add', checkAuth, ThoughtsController.createThoughtsSave);

router.post('/remove', checkAuth, ThoughtsController.removeThoughts);

router.get('/edit/:id', checkAuth, ThoughtsController.updateThoughts);
router.post('/edit', checkAuth, ThoughtsController.updateThoughtsSave);

router.post('/like', checkAuth, ThoughtsController.likeThoughtsSave);

router.get('/dashboard', checkAuth, ThoughtsController.dashboard);

router.get('/', ThoughtsController.showThoughts);

module.exports = router;

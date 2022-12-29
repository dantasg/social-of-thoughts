const Thought = require('../models/Thoughts');
const User = require('../models/User');

const { Op, where } = require('sequelize');

module.exports = class ThoughtsController {
  static async showThoughts(req, res) {
    let search = '';

    if (req.query.search) {
      search = req.query.search;
      req.flash('search', `Buscando por = " ${search} "`);
    }

    let order = 'DESC';

    if (req.query.order === 'old') {
      order = 'ASC';
      req.flash('order', `Ordenado pelo mais antigo!`);
    } else {
      order = 'DESC';
    }

    // Para melhor funcionamento das flash messages
    if (req.query.order === 'new') {
      req.flash('order', `Ordenado pelo mais novo!`);
    }

    const thoughtsData = await Thought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [['createdAt', order]],
    });

    const thought = thoughtsData.map((result) => result.get({ plain: true }));

    let thoughtsQty = thought.length;

    if (thoughtsQty === 0) {
      thoughtsQty = false;
    }

    res.render('thoughts/home', { thought, search, thoughtsQty });
  }

  static async dashboard(req, res) {
    const userId = req.session.userId;

    const user = await User.findOne({
      where: { id: userId },
      include: Thought,
      plain: true,
    });

    // Check if user exists
    if (!user) {
      res.redirect('/login');
    }

    const thoughts = user.Thoughts.map((result) => result.dataValues);

    let emptyThoughts = false;

    if (thoughts.length === 0) {
      emptyThoughts = true;
    }

    res.render('thoughts/dashboard', { thoughts, emptyThoughts });
  }

  static createThoughts(req, res) {
    res.render('thoughts/create');
  }

  static async removeThoughts(req, res) {
    const id = req.body.id;
    const UserId = req.session.userId;

    try {
      await Thought.destroy({ where: { id: id, UserId: UserId } });

      req.flash('message', 'Pensamento removido com sucesso.');

      req.session.save(() => [res.redirect('/thoughts/dashboard')]);
    } catch (err) {
      console.log(err);
    }
  }

  static async createThoughtsSave(req, res) {
    const thought = {
      title: req.body.title,
      UserId: req.session.userId,
    };

    try {
      await Thought.create(thought);

      req.flash('message', 'Pensamento criado com sucesso!');

      req.session.save(() => {
        res.redirect('/thoughts/dashboard');
      });
    } catch (err) {
      console.log(err);
      res.redirect('/thoughts/dashboard');
    }
  }

  static async updateThoughts(req, res) {
    const id = req.params.id;

    const thought = await Thought.findOne({ where: { id: id }, raw: true });

    res.render('thoughts/edit', { thought });
  }

  static async likeThoughtsSave(req, res) {
    const like = req.body.like;

    const contLike = await Thought.findOne({ where: { id: like }, raw: true });

    let value = '';

    value = parseInt(contLike.like);

    contLike.like += 1;

    await Thought.update(contLike, { where: { id: like } });

    res.redirect('/');
  }

  static async updateThoughtsSave(req, res) {
    const id = req.body.id;

    const thought = {
      title: req.body.title,
    };

    try {
      await Thought.update(thought, { where: { id: id } });

      req.flash('message', 'Pensamento atualizado com sucesso!');

      req.session.save(() => {
        res.redirect('/thoughts/dashboard');
      });
    } catch (err) {
      console.log(err);
    }
  }
};

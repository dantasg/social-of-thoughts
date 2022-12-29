const User = require('../models/User');

const bcrypt = require('bcryptjs');

module.exports = class AuthController {
  static login(req, res) {
    res.render('auth/login');
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      // flash message
      req.flash('message', 'Usuário não encontrado!');
      res.render('auth/login');

      return;
    }

    // Check if password match
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      // flash message
      req.flash('message', 'Senha incorreta!');
      res.render('auth/login');

      return;
    }

    req.session.userId = user.id;
    req.flash('message', 'Autenticação realizada com sucesso!');

    req.session.save(() => {
      res.redirect('/');
    });
  }

  static register(req, res) {
    res.render('auth/register');
  }

  static async registerPost(req, res) {
    const { name, secondname, email, password, confirmpassword } = req.body;

    console.log(name);

    // password match validation
    if (password !== confirmpassword) {
      // flash message
      req.flash('message', 'As senhas não conferem');
      res.render('auth/register');

      return;
    }

    // Check if user exists
    const checkIfUserExists = await User.findOne({ where: { email: email } });

    if (checkIfUserExists) {
      // flash message
      req.flash('message', 'Email já em uso!');
      res.render('auth/register');

      return;
    }

    // Create password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      secondname,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      // Initialize session
      req.session.userId = createdUser.id;

      // flash message
      req.flash('message', 'Usuário criado com sucesso!');

      //
      req.session.save(() => {
        // Redirect
        res.redirect('/');
      });
    } catch (err) {
      console.log(err);
      // flash message
      req.flash('message', 'Ocorreu algum erro, tente novamente!');
      // req.redirect('auth/register');
    }
  }

  static async logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
  }
};

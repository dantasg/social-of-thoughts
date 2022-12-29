const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('thoughts', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

try {
  sequelize.authenticate();
  console.log('Conectamos com sucesso!');
} catch (err) {
  console.log('Erro ao conectar!', err);
}

module.exports = sequelize;

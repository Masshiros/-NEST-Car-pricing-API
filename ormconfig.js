module.exports = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities:
    process.env.NODE_ENV === 'dev' ? ['**/*.entity.js'] : ['**/*.entity.ts'],
  synchronize: false,
};

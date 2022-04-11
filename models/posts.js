module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define(
    'posts',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      content: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userId:{
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
    },
    },
    { timestamps: true }
  );

  return Post;
};

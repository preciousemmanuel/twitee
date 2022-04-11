module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define(
    'comments',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.STRING,
        allowNull: true
      },
      postId:{
        
        type: Sequelize.INTEGER,
        references: {
          model: 'posts',
          key: 'id'
        }
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
  return Comment;
};

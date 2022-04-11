module.exports = (sequelize, Sequelize) => {
  const Like = sequelize.define(
    'likes',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
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
  return Like;
};

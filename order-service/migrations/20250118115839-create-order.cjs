module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("orders", {
			orderId: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			userId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			bookId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			quantity: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			bookName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			bookIsbn: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("orders");
	},
};

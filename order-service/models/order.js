export default (sequelize, Sequelize) => {
	const { DataTypes } = Sequelize;

	const Order = sequelize.define(
		"Order",
		{
			orderId: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			userId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			bookId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			bookName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			bookIsbn: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			tableName: "orders",
			timestamps: true,
			createdAt: "createdAt",
			updatedAt: "updatedAt",
		}
	);

	return Order;
};

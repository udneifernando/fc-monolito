import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderModel from "./order.model";

@Table({
    tableName: "order_item",
    timestamps: false,
})
export default class OrderItemModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    description: string;

    @Column({ allowNull: false })
    price: number;

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    orderId: string;

    @BelongsTo(() => OrderModel)
    order: OrderModel;
}
import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderItemModel from "./order-items.model";

@Table({
    tableName: "order",
    timestamps: false,
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    clientId: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    email: string;

    @Column({ allowNull: false })
    document: string;

    @Column({ allowNull: false })
    street: string;

    @Column({ allowNull: false })
    number: string;

    @Column({ allowNull: false })
    complement: string;

    @Column({ allowNull: false })
    city: string;

    @Column({ allowNull: false })
    state: string;

    @Column({ allowNull: false })
    zipCode: string;

    @HasMany(() => OrderItemModel)
    items: OrderItemModel[];

    @Column({ allowNull: false })
    total: number;

    @Column({ allowNull: false })
    status: string;

    @Column({ allowNull: false })
    createdAt: Date;

    @Column({ allowNull: false })
    updatedAt: Date;
}
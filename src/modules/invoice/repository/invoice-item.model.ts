import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
    tableName: "invoice_item",
    timestamps: false
})
export default class InvoiceItemModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    price: number;

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    invoiceId: string;

    @Column({ allowNull: false, field: "created_at" })
    createdAt: Date;

    @Column({ allowNull: false, field: "updated_at" })
    updatedAt: Date;

}
import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { clientAdmRoute } from "../../../client-adm/routes/client-adm.route";
import { productRoute } from "../../../product-adm/routes/product.route";
import { invoiceRoute } from "../../../invoice/routes/invoice.route";
import { checkoutRoute } from "../../../checkout/routes/checkout.route";
import ClientModel from "../../../client-adm/repository/client.model";
import ProductModel from "../../../product-adm/repository/product.model";
import OrderModel from "../../../checkout/repository/order.model";
import OrderItemModel from "../../../checkout/repository/order-items.model";
import TransactionModel from "../../../payment/repository/transaction.model";
import InvoiceModel from "../../../invoice/repository/invoice.model";
import InvoiceItemModel from "../../../invoice/repository/invoice-item.model";
import ProductStorageCatalogModel from "../../../store-catalog/repository/product.model";

export const app: Express = express();
app.use(express.json());
app.use("/product", productRoute)
app.use("/client", clientAdmRoute)
app.use("/checkout", checkoutRoute)
app.use("/invoice", invoiceRoute)

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false
    });
    await sequelize.addModels([ProductModel, ProductStorageCatalogModel, TransactionModel, InvoiceModel, InvoiceItemModel, ClientModel, OrderModel, OrderItemModel]);
    await sequelize.sync();
}

setupDb();
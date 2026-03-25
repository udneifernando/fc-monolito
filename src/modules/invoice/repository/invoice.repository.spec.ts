import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceRepository from "./invoice.repository";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import Address from "../domain/address.value-object";

describe("Invoice repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }

        });

        await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });


    const item1 = new InvoiceItem({
        name: "item 1",
        price: 20,
    });

    const item2 = new InvoiceItem({
        name: "item 2",
        price: 40,
    });


    const invoice = new Invoice({
        name: "José Maria",
        document: "000111333",
        address: new Address({
            street: "QNN 10",
            number: "12",
            complement: "Casa",
            city: "Brasília",
            state: "Distrito Federal",
            zipCode: "12345678"
        }),
        items: [item1, item2],
    });

    it("should create a invoice", async () => {

        const repository = new InvoiceRepository();
        await repository.save(invoice);

        const invoiceDb = await InvoiceModel.findOne({
            where: { id: invoice.id.id },
            include: [{ model: InvoiceItemModel }],
        });

        expect(invoiceDb.id).toEqual(invoice.id.id);
        expect(invoiceDb.name).toEqual(invoice.name);
        expect(invoiceDb.document).toEqual(invoice.document);
        expect(invoiceDb.street).toEqual(invoice.address.street);
        expect(invoiceDb.number).toEqual(invoice.address.number);
        expect(invoiceDb.complement).toEqual(invoice.address.complement);
        expect(invoiceDb.city).toEqual(invoice.address.city);
        expect(invoiceDb.state).toEqual(invoice.address.state);
        expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode);
        expect(invoiceDb.createdAt).toEqual(invoice.createdAt);
        expect(invoiceDb.updatedAt).toEqual(invoice.updatedAt);

        const itemsDb = invoiceDb.items;
        expect(itemsDb).toHaveLength(2);

        expect(itemsDb[0].id).toEqual(item1.id.id);
        expect(itemsDb[0].name).toEqual(item1.name);
        expect(itemsDb[0].price).toEqual(item1.price);
        expect(itemsDb[0].createdAt).toEqual(item1.createdAt);
        expect(itemsDb[0].updatedAt).toEqual(item1.updatedAt);


        expect(itemsDb[1].id).toEqual(item2.id.id);
        expect(itemsDb[1].name).toEqual(item2.name);
        expect(itemsDb[1].price).toEqual(item2.price);
        expect(itemsDb[1].createdAt).toEqual(item2.createdAt);
        expect(itemsDb[1].updatedAt).toEqual(item2.updatedAt);


    });

    it("should find a invoice", async () => {

        const repository = new InvoiceRepository();
        await repository.save(invoice);

        const invoiceDb = await repository.find(invoice.id.id);

        expect(invoiceDb.id).toEqual(invoice.id);
        expect(invoiceDb.name).toEqual(invoice.name);
        expect(invoiceDb.document).toEqual(invoice.document);
        expect(invoiceDb.address.street).toEqual(invoice.address.street);
        expect(invoiceDb.address.number).toEqual(invoice.address.number);
        expect(invoiceDb.address.complement).toEqual(invoice.address.complement);
        expect(invoiceDb.address.city).toEqual(invoice.address.city);
        expect(invoiceDb.address.state).toEqual(invoice.address.state);
        expect(invoiceDb.address.zipCode).toEqual(invoice.address.zipCode);
        expect(invoiceDb.createdAt).toEqual(invoice.createdAt);
        expect(invoiceDb.updatedAt).toEqual(invoice.updatedAt);

        const itemsDb = invoiceDb.items;
        expect(itemsDb).toHaveLength(2);

        expect(itemsDb[0].id).toEqual(item1.id);
        expect(itemsDb[0].name).toEqual(item1.name);
        expect(itemsDb[0].price).toEqual(item1.price);
        expect(itemsDb[0].createdAt).toEqual(item1.createdAt);
        expect(itemsDb[0].updatedAt).toEqual(item1.updatedAt);

        expect(itemsDb[1].id).toEqual(item2.id);
        expect(itemsDb[1].name).toEqual(item2.name);
        expect(itemsDb[1].price).toEqual(item2.price);
        expect(itemsDb[1].createdAt).toEqual(item1.createdAt);
        expect(itemsDb[1].updatedAt).toEqual(item1.updatedAt);
    });

});
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

    async save(invoice: Invoice): Promise<void> {

        const invoiceItems = invoice.items.map(item => {
            return {
                id: item.id.id,
                name: item.name,
                price: item.price,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }
        });

        await InvoiceModel.create(
            {
                id: invoice.id.id,
                name: invoice.name,
                document: invoice.document,
                street: invoice.address.street,
                number: invoice.address.number,
                complement: invoice.address.complement,
                city: invoice.address.city,
                state: invoice.address.state,
                items: invoiceItems,
                zipCode: invoice.address.zipCode,
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt
            }, 
            { 
                include: [{ model: InvoiceItemModel }]
            }
        );

    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne(
            {
                where: { id: id },
                include: [{ model: InvoiceItemModel }],
            }
        );

        if (!invoice) {
            throw new Error(`Invoice not found`);
        }

        const items = invoice.items.map(item => {
            return new InvoiceItem({
                id: new Id(item.id),
                name: item.name,
                price: item.price,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            })
        })

        const props = {
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address({
                street: invoice.street,
                number: invoice.number,
                complement: invoice.complement,
                city: invoice.city,
                state: invoice.state,
                zipCode: invoice.zipCode
            }),
            items: items,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        }

        return new Invoice(props);
    }

}
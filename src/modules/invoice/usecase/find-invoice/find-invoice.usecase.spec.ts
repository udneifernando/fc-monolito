import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/address.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

describe("Find invoice usecase unit test", () => {

    const invoiceItem1 = new InvoiceItem({
        id: new Id("1"),
        name: "item 1",
        price: 20
    });

    const invoiceItem2 = new InvoiceItem({
        id: new Id("2"),
        name: "item 2",
        price: 40
    });

    const invoice = new Invoice({
        id: new Id("1"),
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
        items: [
            invoiceItem1,
            invoiceItem2
        ],
    });

    const MockRepository = () => {
        return {
            save: jest.fn(),
            find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        };
    };

    it("should find a invoice", async () => {
        const repository = MockRepository();
        const usecase = new FindInvoiceUseCase(repository);

        const input = {
            id: "1"
        };

        const result = await usecase.execute(input);

        expect(repository.find).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);

        expect(result.address.street).toBe(invoice.address.street);
        expect(result.address.number).toBe(invoice.address.number);
        expect(result.address.complement).toBe(invoice.address.complement);
        expect(result.address.city).toBe(invoice.address.city);
        expect(result.address.state).toBe(invoice.address.state);
        expect(result.address.zipCode).toBe(invoice.address.zipCode);

        expect(result.items.length).toBe(invoice.items.length);
        expect(result.items[0].id).toBe(invoice.items[0].id.id);
        expect(result.items[0].name).toBe(invoice.items[0].name);
        expect(result.items[0].price).toBe(invoice.items[0].price);

        expect(result.items[1].id).toBe(invoice.items[1].id.id);
        expect(result.items[1].name).toBe(invoice.items[1].name);
        expect(result.items[1].price).toBe(invoice.items[1].price);

        expect(result.total).toBe(invoice.total);

    });

});
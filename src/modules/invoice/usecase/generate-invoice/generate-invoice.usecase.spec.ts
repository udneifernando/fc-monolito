import GenerateInvoiceUseCase from "./generate-invoice.usecase";

describe("Generate invoice usecase unit test", () => {
    const MockRepository = () => {
        return {
            save: jest.fn(),
            find: jest.fn(),
        };
    };

    it("should generate an invoice", async () => {
    
        const repository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(repository);

        const input = {
            name: "José Maria",
            document: "000111333",
            street: "QNN 10",
            number: "12",
            complement: "Casa",
            city: "Brasília",
            state: "Distrito Federal",
            zipCode: "12345678",
            items: [
                {
                    id : "1",
                    name: "item 1",
                    price: 20
                },
                {
                    id : "2",
                    name: "item 2",
                    price: 40
                }
            ]
        };

        const result = await usecase.execute(input);

        expect(repository.save).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        
        expect(result.items).toHaveLength(2);

        expect(result.items[0].id).toBeDefined();
        expect(result.items[0].id).toBe(input.items[0].id);
        expect(result.items[0].name).toBe(input.items[0].name);
        expect(result.items[0].price).toBe(input.items[0].price);
        
        expect(result.items[1].id).toBeDefined();
        expect(result.items[1].id).toBe(input.items[1].id);
        expect(result.items[1].name).toBe(input.items[1].name);
        expect(result.items[1].price).toBe(input.items[1].price);

        expect(result.total).toBe(60);

    });


});
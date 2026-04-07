import request from 'supertest';
import { app, sequelize } from "../../@shared/infra/api/express";

describe("Checkout e2e test", () => {

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    it("should create a checkout", async () => {
        var response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                description: "Descrição produto 1",
                price: 100.0,
                stock: 5
            });
        expect(response.status).toBe(200);
        const idProduct1 = response.body.id;


        response = await request(app)
            .post("/product")
            .send({
                name: "Product 2",
                description: "Descrição produto 2",
                price: 200.0,
                stock: 10
            });

        expect(response.status).toBe(200);
        const idProduct2 = response.body.id;

        response = await request(app)
            .post("/client")
            .send({
                name: "José dos Santos",
                email: "jose@teste.com",
                document: "11122233344",
                street: "Rua Manoel Ferreira",
                number: "10",
                complement: "Casa",
                city: "Salvador",
                state: "BA",
                zipCode: "72000123"
            });

        expect(response.status).toBe(200);
        const idClient = response.body.id;

        response = await request(app)
            .post("/checkout")
            .send({
                clientId: idClient,
                products: [
                    { productId: idProduct1 },
                    { productId: idProduct2 }
                ]
            });

        expect(response.status).toBe(200);
        expect(response.body.invoiceId).toBeDefined()
        expect(response.body.status).toBe("approved");
        expect(response.body.total).toBe(300.0);
        expect(response.body.products).toHaveLength(2);
        expect(response.body.products[0].productId).toBe(idProduct1);
        expect(response.body.products[1].productId).toBe(idProduct2);
    });


});
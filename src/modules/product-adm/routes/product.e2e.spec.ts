import {app, sequelize} from "../../@shared/infra/api/express";
import request from "supertest";

describe("Product e2e test", () => {
    
    beforeAll(async () => {
        await sequelize.sync({force: true});
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name : "Produto 1",
                description: "Descrição do Produto 1",
                price : 100.0,
                stock: 5
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe("Produto 1");
        expect(response.body.description).toBe("Descrição do Produto 1");
        expect(response.body.price).toBe(100.0);
        expect(response.body.stock).toBe(5);
    });

    it("should check stock of a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name : "Produto 2",
                description: "Descrição do Produto 2",
                price : 120.0,
                stock: 12
            });

        const idProduct = response.body.id;
        const responseCheckStock = await request(app)
            .get(`/product/${idProduct}/checkstock`)
            .send();

        expect(responseCheckStock.status).toBe(200);
        expect(responseCheckStock.body.productId).toBe(idProduct);
        expect(responseCheckStock.body.stock).toBe(12);
    });
});
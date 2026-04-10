import {app, sequelize} from "../../@shared/infra/api/express";
import request from "supertest";

describe("Client adm e2e test", () => {

    beforeAll(async () => {
        await sequelize.sync({force: true});
    });

    it("should create a client", async () => {
        const response = await request(app)
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
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe("José dos Santos");
        expect(response.body.email).toBe("jose@teste.com");
        expect(response.body.document).toBe("11122233344");
        expect(response.body.address._street).toBe("Rua Manoel Ferreira");
        expect(response.body.address._number).toBe("10");
        expect(response.body.address._complement).toBe("Casa");
        expect(response.body.address._city).toBe("Salvador");
        expect(response.body.address._state).toBe("BA");
        expect(response.body.address._zipCode).toBe("72000123");
    });

    it("should get a client", async () => {
        const response = await request(app)
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

        const idClient = response.body.id;
        const responseGetClient = await request(app)
            .get(`/client/${idClient}`)
            .send();            

        expect(responseGetClient.status).toBe(200);
        expect(responseGetClient.body.id).toBe(idClient);
        expect(responseGetClient.body.name).toBe("José dos Santos");
        expect(responseGetClient.body.email).toBe("jose@teste.com");
        expect(responseGetClient.body.document).toBe("11122233344");
        expect(responseGetClient.body.address._street).toBe("Rua Manoel Ferreira");
        expect(responseGetClient.body.address._number).toBe("10");
        expect(responseGetClient.body.address._complement).toBe("Casa");
        expect(responseGetClient.body.address._city).toBe("Salvador");
        expect(responseGetClient.body.address._state).toBe("BA");
        expect(responseGetClient.body.address._zipCode).toBe("72000123");
    });

});
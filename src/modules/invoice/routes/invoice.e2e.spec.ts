import request from 'supertest';
import { app, sequelize } from "../../@shared/infra/api/express";

describe("Invoice e2e test", () => {

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  it("should find a invoice", async () => {
    var response = await request(app)
      .post("/product")
      .send({
        name: "Produto 1",
        description: "Descrição do produto 1",
        price: 100.0,
        stock: 5
      });
    expect(response.status).toBe(200);
    const idProduct1 = response.body.id;

    response = await request(app)
      .post("/product")
      .send({
        name: "Produto 2",
        description: "Descrição do produto 2",
        price: 120.0,
        stock: 5
      });

    expect(response.status).toBe(200);
    const idProduct2 = response.body.id;

    response = await request(app)
      .post("/client")
      .send({
        name: "José dos Santos",
        email: "jose@teste.com",
        document: "00011122233",
        street: "Rua Santo Antonio",
        number: "15",
        complement: "Casa",
        city: "Salvador",
        state: "BA",
        zipCode: "71000123"
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
    expect(response.body.total).toBe(220.0);
    expect(response.body.products).toHaveLength(2);
    expect(response.body.products[0].productId).toBe(idProduct1);
    expect(response.body.products[1].productId).toBe(idProduct2);

    const idInvoice = response.body.invoiceId;
    response = await request(app)
      .get(`/invoice/${idInvoice}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("José dos Santos");
    expect(response.body.document).toBe("00011122233");
    expect(response.body.address.street).toBe("Rua Santo Antonio");
    expect(response.body.address.number).toBe("15");
    expect(response.body.address.complement).toBe("Casa");
    expect(response.body.address.city).toBe("Salvador");
    expect(response.body.address.state).toBe("BA");
    expect(response.body.address.zipCode).toBe("71000123");
    expect(response.body.total).toBe(220.0);
    expect(response.body.items).toHaveLength(2);
    expect(response.body.items[0].id).toBe(idProduct1);
    expect(response.body.items[0].name).toBe("Produto 1");
    expect(response.body.items[0].price).toBe(100.0);
    expect(response.body.items[1].id).toBe(idProduct2);
    expect(response.body.items[1].name).toBe("Produto 2");
    expect(response.body.items[1].price).toBe(120.0);
      
  });


});
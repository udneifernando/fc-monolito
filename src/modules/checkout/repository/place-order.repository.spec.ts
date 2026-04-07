import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import PlaceOrderRepository from "./place-order.repository";
import OrderItemModel from "./order-items.model";
import OrderModel from "./order.model";
import Address from "../../invoice/domain/address.value-object";

describe("Place order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true }
    });

    await sequelize.addModels([OrderModel, OrderItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add a new order", async () => {
    const address = new Address({
      street: "Rua Manoel Ferreira",
      number: "10",
      complement: "Casa",
      city: "Salvador",
      state: "BA",
      zipCode: "72000123",
    });

    const product1 = new Product({
      id: new Id("1"),
      name: "Produto 1",
      description: "Descrição do produto 1",
      price: 100,
    });

    const product2 = new Product({
      id: new Id("2"),
      name: "Produto 2",
      description: "Descrição do produto 2",
      price: 200,
    });

    const client = new Client({
      id: new Id("1"),
      name: "José Antonio",
      email: "jose@teste.com",
      document: "11122233344",
      street: address.street,
      number: address.number,
      complement: address.complement,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });

    const order = new Order({
      id: new Id("1"),
      client: client,
      products: [product1, product2],
      status: "pending",
    });

    const repository = new PlaceOrderRepository();
    await repository.addOrder(order);

    const result = await OrderModel.findOne({
      where: { id: order.id.id },
      include: ["items"]
    });

    expect(result.id).toEqual(order.id.id);
    expect(result.clientId).toEqual(order.client.id.id);
    expect(result.name).toEqual(order.client.name);
    expect(result.document).toEqual(order.client.document);
    expect(result.street).toEqual(order.client.street);
    expect(result.number).toEqual(order.client.number);
    expect(result.complement).toEqual(order.client.complement);
    expect(result.city).toEqual(order.client.city);
    expect(result.state).toEqual(order.client.state);
    expect(result.zipCode).toEqual(order.client.zipCode);
    expect(result.items.length).toEqual(2);
    expect(result.items[0].id).toBe(product1.id.id);
    expect(result.items[0].name).toBe(product1.name);
    expect(result.items[0].description).toBe(product1.description);
    expect(result.items[0].price).toBe(product1.price);
    expect(result.items[1].id).toBe(product2.id.id);
    expect(result.items[1].name).toBe(product2.name);
    expect(result.items[1].description).toBe(product2.description);
    expect(result.items[1].price).toBe(product2.price);
    expect(result.total).toBe(300);
    expect(result.status).toBe("pending");
    expect(result.createdAt).toEqual(order.createdAt);
    expect(result.updatedAt).toBeDefined();
  });

  it("should find an order", async () => {
    const product1 = {
      id: "1",
      name: "Produto 1",
      description: "Produto 1 descrição",
      price: 100,
      orderId: "1",
    };

    const product2 = {
      id: "2",
      name: "Produto 2",
      description: "Produto 2 descrição",
      price: 200,
      orderId: "1",
    };

    const input = {
      id: "1",
      clientId: "1",
      name: "José Antonio",
      email: "jose@teste.com",
      document: "11122233344",
      street: "Rua Manoel Ferreira",
      number: "10",
      complement: "Casa",
      city: "Salvador",
      state: "BA",
      zipCode: "72000123",
      items: [product1, product2],
      createdAt: new Date(),
      updatedAt: new Date(),
      total: 300,
      status: "pending",
    };

    await OrderModel.create(
      input,
      {
        include: [{ model: OrderItemModel }]
      }
    );

    const repository = new PlaceOrderRepository();
    const result = await repository.findOrder(input.id);

    expect(result.id.id).toEqual(input.id);
    expect(result.client.id.id).toEqual(input.clientId);
    expect(result.client.name).toEqual(input.name);
    expect(result.client.document).toEqual(input.document);
    expect(result.client.street).toEqual(input.street);
    expect(result.client.number).toEqual(input.number);
    expect(result.client.complement).toEqual(input.complement);
    expect(result.client.city).toEqual(input.city);
    expect(result.client.state).toEqual(input.state);
    expect(result.client.zipCode).toEqual(input.zipCode);
    expect(result.products.length).toEqual(2);
    expect(result.products[0].id.id).toBe(product1.id);
    expect(result.products[0].name).toBe(product1.name);
    expect(result.products[0].description).toBe(product1.description);
    expect(result.products[0].price).toBe(product1.price);
    expect(result.products[1].id.id).toBe(product2.id);
    expect(result.products[1].name).toBe(product2.name);
    expect(result.products[1].description).toBe(product2.description);
    expect(result.products[1].price).toBe(product2.price);
    expect(result.total).toEqual(input.total);
    expect(result.status).toEqual(input.status);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });
})
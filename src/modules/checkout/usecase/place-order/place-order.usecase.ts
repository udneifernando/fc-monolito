import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacade from "../../../client-adm/facade/client-adm.facade";
import InvoiceFacade from "../../../invoice/facade/invoice.facade";
import PaymentFacade from "../../../payment/facade/payment.facade";
import ProductAdmFacade from "../../../product-adm/facade/product-adm.facade";
import StoreCatalogFacade from "../../../store-catalog/facade/store-catalog.facade";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUsecase implements UseCaseInterface {
    private _clientFacade: ClientAdmFacade;
    private _productFacade: ProductAdmFacade;
    private _catalogFacade: StoreCatalogFacade;
    private _repository: CheckoutGateway;
    private _invoiceFacade: InvoiceFacade;
    private _paymentFacade: PaymentFacade;

    constructor(
        clientFacade: ClientAdmFacade,
        productFacade: ProductAdmFacade,
        catalogFacade: StoreCatalogFacade,
        repository: CheckoutGateway,
        invoiceFacade: InvoiceFacade,
        paymentFacade: PaymentFacade
    ) {
        this._clientFacade = clientFacade;
        this._productFacade = productFacade;
        this._catalogFacade = catalogFacade;
        this._repository = repository;
        this._invoiceFacade = invoiceFacade;
        this._paymentFacade = paymentFacade;
    }

    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {

        const client = await this._clientFacade.find({ id: input.clientId });
        if (!client) {
            throw new Error("Client not found");
        }

        await this.validateProducts(input);

        const products = await Promise.all(
            input.products.map(p => this.getProduct(p.productId))
        );

        const clientEntity = new Client({
            id: new Id(input.clientId),
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode
        });

        const order = new Order({
            client: clientEntity,
            products
        });

        const payment = await this._paymentFacade.process({
            orderId: order.id.id,
            amount: order.total
        });

        const invoice = payment.status === "approved" ? await this._invoiceFacade.generateInvoice({
            name: client.name,
            document: client.document,
            street: client.address.street,
            complement: client.address.complement,
            number: client.address.number,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode,
            items: products.map((p) => {
                return {
                    id: p.id.id,
                    name: p.name,
                    price: p.price
                };
            }),
        })
            : null;

        payment.status === "approved" ? order.approve() : null;
        await this._repository.addOrder(order);
        return {
            id: order.id.id,
            invoiceId: payment.status === "approved" ? invoice.id : null,
            status: order.status,
            total: order.total,
            products: order.products.map(p => {
                return {
                    productId: p.id.id
                }
            })
        }

    }

    private async validateProducts(input: PlaceOrderInputDto) {
        if (input.products.length === 0) {
            throw new Error("No products selected");
        }

        for (const p of input.products) {
            const product = await this._productFacade.checkStock({
                productId: p.productId
            });

            if (product.stock <= 0) {
                throw new Error(`Product ${product.productId} is not avaible in stock`);
            }
        }
    }

    private async getProduct(productId: string): Promise<Product> {
        const product = await this._catalogFacade.find({ id: productId });
        if (!product) {
            throw new Error("Product not found");
        }
        return new Product({
            id: new Id(product.id),
            description: product.description,
            name: product.name,
            price: product.price
        });
    }
}
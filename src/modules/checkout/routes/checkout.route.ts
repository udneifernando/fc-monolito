import express, { Request, Response } from 'express';
import ClientAdmFacadeFactory from '../../client-adm/factory/client-adm.facade.factory';
import InvoiceFacadeFactory from '../../invoice/factory/invoice-facade.factory';
import PaymentFacadeFactory from '../../payment/factory/payment.facade.factory';
import ProductAdmFacadeFactory from '../../product-adm/factory/facade.factory';
import StoreCatalogFacadeFactory from '../../store-catalog/factory/facade.factory';
import PlaceOrderRepository from '../repository/place-order.repository';
import PlaceOrderUsecase from '../usecase/place-order/place-order.usecase';

export const checkoutRoute = express.Router();

checkoutRoute.post('/', async (req: Request, res: Response) => {

    const useCase = new PlaceOrderUsecase(
        ClientAdmFacadeFactory.create(),
        ProductAdmFacadeFactory.create(),
        StoreCatalogFacadeFactory.create(),
        new PlaceOrderRepository(),
        InvoiceFacadeFactory.create(),
        PaymentFacadeFactory.create()
    );

    try {
        const input = {
            clientId: req.body.clientId,
            products: req.body.products,
        };

        const output = await useCase.execute(input);
        res.send(output);
    } catch (err) {
        res.status(500).send(err)
    }
});
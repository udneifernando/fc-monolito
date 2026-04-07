import express, {Request, Response} from 'express';
import FindInvoiceUseCase from '../usecase/find-invoice/find-invoice.usecase';
import InvoiceRepository from '../repository/invoice.repository';

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {

    const useCase = new FindInvoiceUseCase(new InvoiceRepository());

    try {
        const output = await useCase.execute({id: req.params.id});
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
    
});	
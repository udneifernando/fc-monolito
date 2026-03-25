import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {

    static create(): InvoiceFacade {
        const invoiceRepository = new InvoiceRepository();
        const addInvoiceUsecase = new GenerateInvoiceUseCase(invoiceRepository);
        const findInvoiceUsecase = new FindInvoiceUseCase(invoiceRepository);

        const facade = new InvoiceFacade({
            addInvoiceUseCase: addInvoiceUsecase,
            findInvoiceUseCase: findInvoiceUsecase
        });

        return facade;

    }

}
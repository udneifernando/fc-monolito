import { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice-facade.dto";

export default interface InvoiceFacadeInterface {

    generateInvoice(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto>;

    findInvoice(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO>;
    
}
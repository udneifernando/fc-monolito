import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface from "./invoice.facade.interface";
import { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice-facade.dto";

export interface UseCaseProps {
    addInvoiceUseCase: UseCaseInterface;
    findInvoiceUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {

    private _addInvoiceUseCase: UseCaseInterface;
    private _findInvoiceUseCase: UseCaseInterface;

    constructor(props: UseCaseProps) {
        this._addInvoiceUseCase = props.addInvoiceUseCase;
        this._findInvoiceUseCase = props.findInvoiceUseCase;
    }

    async generateInvoice(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return await this._addInvoiceUseCase.execute(input);
    }

    async findInvoice(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
        return await this._findInvoiceUseCase.execute(input);
    }

}
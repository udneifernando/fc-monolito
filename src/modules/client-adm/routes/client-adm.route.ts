import express, {Request, Response} from 'express';
import AddClientUseCase from '../usecase/add-client/add-client.usecase';
import ClientRepository from '../repository/client.repository';
import FindClientUseCase from '..//usecase/find-client/find-client.usecase';
import Address from '../../@shared/domain/value-object/address';

export const clientAdmRoute = express.Router();

clientAdmRoute.post("/", async (req: Request, res: Response) => {

    const useCase = new AddClientUseCase(new ClientRepository());

    try {

        const address = new Address(req.body.street, req.body.number, req.body.complement, req.body.city, req.body.state, req.body.zipCode);
        
        const clientDto = {
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: address
        }

        const output = await useCase.execute(clientDto);
        res.send(output);

    } catch (err) {
        res.status(500).send(err);
    }
});

clientAdmRoute.get("/:id", async (req: Request, res: Response) => {

    const useCase = new FindClientUseCase(new ClientRepository());

    try {
        const output = await useCase.execute({id: req.params.id});

        res.send(output);
        
    } catch (err) {
        res.status(500).send(err);
    }
});	
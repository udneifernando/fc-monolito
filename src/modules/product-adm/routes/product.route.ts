import express, {Request, Response} from 'express';
import AddProductUseCase from '../usecase/add-product/add-product.usecase';
import ProductRepository from '../repository/product.repository';
import CheckStockUseCase from '../usecase/check-stock/check-stock.usecase';

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {

    const useCase = new AddProductUseCase(new ProductRepository());

    try {
        const productDto = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock
        }

        const output = await useCase.execute(productDto);

        res.send(output);

    } catch (err) {
        res.status(500).send(err);
    }

});

productRoute.get("/:id/checkStock", async (req: Request, res: Response) => {

    const useCase = new CheckStockUseCase(new ProductRepository());

    try {
        const output = await useCase.execute({productId: req.params.id});
        
        res.send(output);

    } catch (err) {
        res.status(500).send(err);
    }
});	
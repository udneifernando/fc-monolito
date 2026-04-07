import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
    id: Id;
    name: string;
    description: string;
    price: number;
}

export default class Product extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _description: string;
    private _price: number;

    constructor(props: ProductProps) {
        super(props.id);
        this._name = props.name;
        this._description = props.description;
        this._price = props.price;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get price() {
        return this._price;
    }

}
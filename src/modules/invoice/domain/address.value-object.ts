type AddressProps = {
    street: string,
    number: string,
    complement: string,
    city: string,
    state: string,
    zipCode: string,
}

export default class Address {
    private _street: string;
    private _number: string;
    private _complement: string;
    private _city: string;
    private _state: string;
    private _zipCode: string;

    constructor(props: AddressProps) {
        this._street = props.street;
        this._number = props.number;
        this._complement = props.complement;
        this._city = props.city;
        this._state = props.state;
        this._zipCode = props.zipCode;
        this.validate();
    }

    validate() {
        if (this._street.length == 0) {
            throw new Error("Street is required");
        }

        if (this._number.length == 0) {
            throw new Error("Number is required");
        }

        if (this._city.length == 0) {
            throw new Error("City is required");
        }

        if (this._state.length == 0) {
            throw new Error("State is required");
        }

        if (this._zipCode.length == 0) {
            throw new Error("Zip is required");
        }

    }

    get street() {
        return this._street;
    }

    get number() {
        return this._number;
    }

    get complement() {
        return this._complement;
    }

    get city() {
        return this._city;
    }

    get state() {
        return this._state;
    }

    get zipCode() {
        return this._zipCode;
    }

}
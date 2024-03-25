//import { JSON } from "@klave/sdk"
import { TxInput, TxOutput } from "../../ccy/KlaveUTXO/IKlaveUTXO";
import { address, amount } from "../types";

@serializable
export class CreateInput {
    name!: string;
    symbol!: string;
    decimals!: number;
    totalSupply!: amount;
}

@serializable
export class TransferInput {
    value!: amount;
    input!: TxInput;
    output!: TxOutput;

    constructor(value: amount, input: TxInput, output: TxOutput) {
        this.value = value;
        this.input = new TxInput(input.id, input.signature);
        this.output = new TxOutput(output.amount, output.owner);
    }
}

@serializable
export class MintInput {
    amount!: amount;
    output!: TxOutput;
    data!: string;

    constructor(amount: amount, output: TxOutput, data: string) {
        this.amount = amount;
        this.output = new TxOutput(amount, output.owner);
        this.data = data;
    }
}

@serializable
export class BurnInput {
    amount!: amount;
    output!: TxOutput;
    data!: string;

    constructor(amount: amount, output: TxOutput, data: string) {
        this.amount = amount;
        this.output = new TxOutput(amount, output.owner);
        this.data = data;
    }
}

@serializable
export class PaymentInput {
    value!: amount;
    payer!: address;
    payee!: address;

    constructor(value: amount, input: address, output: address) {
        this.value = value;
        this.payer = input;
        this.payee = output;
    }
}
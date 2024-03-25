import { JSON, Ledger, Context } from "@klave/sdk"
import { KlaveUTXO } from "./token/KlaveUTXO/KlaveUTXO"
import { amount, emit } from "./klave/types"
import { TransferInput, CreateInput, MintInput, BurnInput, PaymentInput, FundInput, DefundInput } from "./klave/KlaveUTXO/KlaveUTXORouteArgs";
import { TxInput, TxOutput } from "./token/KlaveUTXO/IKlaveUTXO";
import { SignInput, sign } from "./klave/crypto";

const KlaveUTXOTable = "KlaveUTXOTable";

const _loadKlaveUTXO = function(): KlaveUTXO {
    let KlaveUTXO_table = Ledger.getTable(KlaveUTXOTable).get("ALL");
    if (KlaveUTXO_table.length == 0) {
        emit("Coin does not exists. Create it first");
        return new KlaveUTXO("", "", 0, 0);
    }    
    emit("KlaveUTXO loaded successfully: " + KlaveUTXO_table);
    return JSON.parse<KlaveUTXO>(KlaveUTXO_table);
}

const _saveKlaveUTXO = function(KlaveUTXO : KlaveUTXO): void {
    let KlaveUTXO_table = JSON.stringify<KlaveUTXO>(KlaveUTXO);    
    Ledger.getTable(KlaveUTXOTable).set("ALL", KlaveUTXO_table);
    emit("KlaveUTXO saved successfully: " + KlaveUTXO_table);
}

/** 
 * @transaction 
 * @param {CreateInput} - A parsed input argument containing the name, symbol, decimals and total supply of the currency
 *  */
export function createCoin(input: CreateInput): void {    
    let KlaveUTXO_table = Ledger.getTable(KlaveUTXOTable).get("ALL");
    if (input.name.length === 0 || input.symbol.length === 0 || !input.decimals || !input.totalSupply) {
        emit("Your input is wrong");
        return;
    }
    if (KlaveUTXO_table.length != 0) {
        let details = JSON.parse<KlaveUTXO>(KlaveUTXO_table);
        if (details._name.length != 0 || details._symbol.length != 0 || details._decimals != 0 || details._totalSupply != 0) {
            emit("Coin already exists");
            return;
        }
    }
    let KlaveUTXO = new KlaveUTXO(input.name, input.symbol, input.decimals, input.totalSupply);    
    Ledger.getTable(KlaveUTXOTable).set("ALL", JSON.stringify<KlaveUTXO>(KlaveUTXO));
    emit("Coin created successfully");
}

/** 
 * @query return name
 *  */
export function name(): void {    
    let KlaveUTXO = _loadKlaveUTXO();
    emit(`Name is ${KlaveUTXO.name()}`);    
}

/** 
 * @query return symbol
 *  */
export function symbol(): void {    
    let KlaveUTXO = _loadKlaveUTXO();
    emit(`Symbol is ${KlaveUTXO.symbol()}`);    
}

/** 
 * @query return symbol
 *  */
export function decimals(): void {    
    let KlaveUTXO = _loadKlaveUTXO();
    emit(`Decimals are ${KlaveUTXO.decimals()}`);    
}

/** 
 * @query return total supply of the currency
 *  */
export function totalSupply(): void {    
    let KlaveUTXO = _loadKlaveUTXO();
    emit(`Total Supply is ${KlaveUTXO.totalSupply()}`);    
}

/** 
 * @query return balances of the currency
 * @param {string} owner - the address of the owner, takes the sender's address if not provided
 *  */
export function balanceOf(owner: string): void {
    let KlaveUTXO = _loadKlaveUTXO();
    if (owner.length == 0) {
        owner = Context.get('sender');        
    }
    if (!KlaveUTXO.accountHolder(owner))
        return;
    emit(`Balance for ${owner} is ${KlaveUTXO.balanceOf(owner)}`);    
}

/** 
 * @transaction 
 * @param {TransferInput} - A parsed input argument containing the "to" address and the value to be paid
 *  */
export function transfer(input: TransferInput): void {
    let KlaveUTXO = _loadKlaveUTXO();
    if (!KlaveUTXO.accountHolder(Context.get('sender')) || !KlaveUTXO.accountHolder(input.output.owner))
        return;
    KlaveUTXO.transfer(input.value, input.input, input.output);
    _saveKlaveUTXO(KlaveUTXO);
}

/**
 * @transaction create new tokens and assign them to the specified address
 * @param {MintInput} - A parsed input argument containing the address of the recipient and the amount of tokens to be created
 */
export function mint(input: MintInput): void {
    let KlaveUTXO = _loadKlaveUTXO();
    if (input.output.owner.length == 0) {
        input.output.owner = Context.get('sender');        
    }
    if (!KlaveUTXO.accountHolder(input.output.owner)) {
        KlaveUTXO.createAccount(input.output.owner);
    }        
    KlaveUTXO.mint(input.amount, input.output, input.data);
    _saveKlaveUTXO(KlaveUTXO);
}

/**
 * @transaction Destroy tokens from the specified address
 * @param {BurnInput} - A parsed input argument containing the address of the sender and the amount of tokens to be destroyed
 */
export function burn(input: BurnInput): void {
    let KlaveUTXO = _loadKlaveUTXO();
    if (input.output.owner.length == 0) {
        input.output.owner = Context.get('sender');
    }
    if (!KlaveUTXO.accountHolder(input.output.owner)) {
        KlaveUTXO.createAccount(input.output.owner);
    }        
    KlaveUTXO.burn(input.amount, input.output, input.data);
    _saveKlaveUTXO(KlaveUTXO);
}

/** 
 * @transaction 
 * @param {PaymentInput} - A parsed input argument containing the "to" address and the value to be paid
 *  */
export function payment(input: PaymentInput): void {
    let KlaveUTXO = _loadKlaveUTXO();
    if (input.payer.length == 0) {
        input.payer = Context.get('sender');        
    }
    if (input.payer == input.payee) {
        emit(`Payer and payee cannot be the same`);
        return;
    }

    if (!KlaveUTXO.accountHolder(input.payer)) {
        emit(`Account for ${input.payer} does not exist`);
        return;
    }
    if (!KlaveUTXO.accountHolder(input.payee)) {
        emit(`Account for ${input.payee} does not exist`);
        return;
    }
        
    let payer = KlaveUTXO.account(input.payer);
    let payee = KlaveUTXO.account(input.payee);
    
    if (payer.balance < input.value) {
        emit(`Insufficient balance on payer's account - ${payer.owner}`);
        return;    
    }

    emit(`Payer's balance is ${payer.balance} and payee's balance is ${payee.balance}`);
    emit(`Payment of ${input.value} from ${payer.owner} to ${payee.owner}`);

    let totalTransferred : amount = 0;    
    emit(`At first, total transferred is ${totalTransferred}, payer has ${payer.utxoList.length} UTXOs and payee has ${payee.utxoList.length} UTXOs`);
    for (let i = 0; i < payer.utxoList.length && totalTransferred < input.value; i++) {
        let toBeTransferred : amount = 0;
        if (payer.utxoList[i].value > (input.value - totalTransferred)) {
            toBeTransferred = input.value - totalTransferred;
        }

        emit(`on iteration ${i}, toBeTransferred is ${toBeTransferred} when totalTransferred is ${totalTransferred}. Reminder: input.value is ${input.value}`);
        let signInput = new SignInput(payer.owner, payer.utxoList[i].id.toString());
        emit(`Sign input is ${JSON.stringify(signInput)}`);        
        let txInput = new TxInput(payer.utxoList[i].id, sign(signInput));
        let txOutput = new TxOutput(toBeTransferred, input.payee);
        KlaveUTXO.transfer(toBeTransferred, txInput, txOutput);        

        totalTransferred += toBeTransferred;
    }
    emit(`Finally, total transferred is ${totalTransferred}`);
    _saveKlaveUTXO(KlaveUTXO);
}

/**
 * @transaction create new tokens and assign them to the specified address
 * @param {FundInput} - A parsed input argument containing the address of the recipient and the amount of tokens to be created
 */
export function fund(input: FundInput): void {
    let KlaveUTXO = _loadKlaveUTXO();
    if (input.payee.length == 0) {
        input.payee = Context.get('sender');        
    }
    if (!KlaveUTXO.accountHolder(input.payee)) {
        KlaveUTXO.createAccount(input.payee);
    }                
    KlaveUTXO.mint(input.amount, new TxOutput(input.amount, input.payee), "data");
    _saveKlaveUTXO(KlaveUTXO);
}

/**
 * @transaction Destroy tokens from the specified address
 * @param {DefundInput} - A parsed input argument containing the address of the sender and the amount of tokens to be destroyed
 */
export function defund(input: DefundInput): void {
    let KlaveUTXO = _loadKlaveUTXO();
    if (input.payer.length == 0) {
        input.payer = Context.get('sender');        
    }
    if (!KlaveUTXO.accountHolder(input.payer)) {
        KlaveUTXO.createAccount(input.payer);
    }                
    KlaveUTXO.burn(input.amount, new TxOutput(input.amount, input.payer), "data");
    _saveKlaveUTXO(KlaveUTXO);
}
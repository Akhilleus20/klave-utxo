import { JSON, Ledger, Context } from "@klave/sdk"
import { KlaveUTXO } from "./ccy/KlaveUTXO/KlaveUTXO"
import { /*amount, */emit } from "./klave/types"
import { TransferInput, CreateInput, MintInput, BurnInput } from "./klave/KlaveUTXO/KlaveUTXORouteArgs";

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
 * @param {CreateInput}
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
    let klaveUTXO = new KlaveUTXO(input.name, input.symbol, input.decimals, input.totalSupply);
    Ledger.getTable(KlaveUTXOTable).set("ALL", JSON.stringify<KlaveUTXO>(klaveUTXO));
    emit("Coin created successfully");
}

/**
 * @query
 *  */
export function name(): void {
    let KlaveUTXO = _loadKlaveUTXO();
    emit(`Name is ${KlaveUTXO.name()}`);
}

/**
 * @query
 *  */
export function symbol(): void {
    let KlaveUTXO = _loadKlaveUTXO();
    emit(`Symbol is ${KlaveUTXO.symbol()}`);
}

/**
 * @query
 *  */
export function decimals(): void {
    let KlaveUTXO = _loadKlaveUTXO();
    emit(`Decimals are ${KlaveUTXO.decimals()}`);
}

/**
 * @query
 *  */
export function totalSupply(): void {
    let KlaveUTXO = _loadKlaveUTXO();
    emit(`Total Supply is ${KlaveUTXO.totalSupply()}`);
}

/**
 * @query
 * @param {string} owner
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
 * @param {TransferInput}
 *  */
export function transfer(input: TransferInput): void {
    let KlaveUTXO = _loadKlaveUTXO();
    if (!KlaveUTXO.accountHolder(Context.get('sender')) || !KlaveUTXO.accountHolder(input.output.owner))
        return;
    KlaveUTXO.transfer(input.value, input.input, input.output);
    _saveKlaveUTXO(KlaveUTXO);
}

/**
 * @transaction
 * @param {MintInput}
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
 * @transaction
 * @param {BurnInput}
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
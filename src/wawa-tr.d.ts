import { TemplateResult } from "lit-html";
import { WawaItem } from "./wawa-item";
import { WawaTable } from "./wawa-table";
export declare class WawaTr extends HTMLTableRowElement {
    renderInnerRowCallback: (item: any, index: number, table: WawaTable, wawaitem: WawaItem) => TemplateResult;
    private _item;
    item: WawaItem;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private render;
}

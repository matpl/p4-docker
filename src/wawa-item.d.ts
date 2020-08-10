import { WawaTable } from "./wawa-table";
import { TemplateResult } from "lit-html";
export declare class WawaItem {
    item: any;
    index: number;
    id: number;
    table: WawaTable;
    private _template;
    templateUpdatedCallback: () => void;
    private static _uniqueIdCount;
    constructor(item: any, table: WawaTable);
    readonly template: TemplateResult;
    updateTemplate(): void;
}

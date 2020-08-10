import { LitElement, TemplateResult, PropertyValues } from "lit-element";
import { WawaItem } from "./wawa-item";
import "./wawa-tr";
import "./wawa-header-tr";
export declare class WawaTable extends LitElement {
    items: WawaItem[];
    scrollOffset: number;
    pageSize: number;
    rowHeight: number;
    private pageNumber;
    protected moreItems: boolean;
    protected fetching: boolean;
    private loadingData?;
    protected startIndex: number;
    protected visibleRows: number;
    fetchData?: (pageNumber: number, pageSize: number) => Promise<any[]>;
    monitor: boolean;
    /** Enables changing the header and/or row templates dynamically */
    observeChildren: boolean;
    private childObserver;
    rowTemplate: string;
    innerRowTemplate: string;
    private headerTemplate?;
    private loadingTemplate?;
    renderHeaderCallback: (table: WawaTable) => TemplateResult;
    renderRowCallback: (item: any, index: number, table: WawaTable, wawaitem: WawaItem) => TemplateResult;
    constructor();
    private loadTemplates;
    private resetObserver;
    protected fetch(): void;
    private lastScroll;
    private computeVisibleRows;
    connectedCallback(): void;
    private onScroll;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    protected update(_changedProperties: PropertyValues): void;
    private renderStyles;
    protected render(): TemplateResult;
    /**
     * Insert an item into the table at a specific index.
     * @param item The item to insert into the table
     * @param index The index to insert the item at
     */
    insertItem(item: any, index: number): void;
    /**
     * Remove an item from the table. Does nothing if the item is not present.
     * @param item The item to remove
     */
    removeItem(item: any): void;
}
export declare class LoadingData extends LitElement {
    fetching: boolean;
    private loadingTemplate?;
    render(): TemplateResult;
}

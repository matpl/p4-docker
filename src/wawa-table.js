var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, customElement, html, property, query } from "lit-element";
import { repeat } from "lit-html/directives/repeat";
import { RowTemplate } from "./row-template";
import { HeaderTemplate } from "./header-template";
import { LoadingTemplate } from "./loading-template";
import { WawaItem } from "./wawa-item";
import "./wawa-tr";
import "./wawa-header-tr";
let WawaTable = class WawaTable extends LitElement {
    constructor() {
        super();
        this.items = [];
        this.scrollOffset = 50;
        this.pageSize = 20;
        // setting the rowHeight enables virtualization
        this.rowHeight = 0;
        this.pageNumber = 0;
        this.moreItems = true;
        this.fetching = false;
        this.startIndex = 0;
        this.visibleRows = 0;
        this.fetchData = undefined;
        this.monitor = false;
        /** Enables changing the header and/or row templates dynamically */
        this.observeChildren = false;
        this.childObserver = new MutationObserver(() => { this.loadTemplates(); this.requestUpdate(); });
        this.rowTemplate = "";
        this.innerRowTemplate = "";
        this.lastScroll = 0;
        this.loadTemplates();
    }
    loadTemplates() {
        this.headerTemplate = undefined;
        this.loadingTemplate = undefined;
        this.rowTemplate = "";
        this.innerRowTemplate = "";
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i] instanceof HeaderTemplate) {
                if (this.headerTemplate) {
                    console.error("Only one header-template required");
                }
                var headerTemplateStr = this.children[i].innerHTML.replace(/`/g, "\\`");
                this.headerTemplate = Function('html', 'table', '"use strict";return (' + 'html`' + headerTemplateStr + '`' + ')')(html, this);
            }
            else if (this.children[i] instanceof LoadingTemplate) {
                if (this.loadingTemplate) {
                    console.error("Only one loading-template required");
                }
                this.loadingTemplate = Array.from(document.importNode(this.children[i].content, true).children);
            }
            else if (this.children[i] instanceof RowTemplate) {
                if (this.rowTemplate !== "") {
                    console.error("Only one row-template required");
                }
                this.rowTemplate = this.children[i].innerHTML.replace(/`/g, "\\`").replace(/<tr/, "<tr is='wawa-tr' .item=${wawaitem}");
                for (let j = 0; j < this.children[i].content.children.length; j++) {
                    if (this.children[i].content.children[j] instanceof HTMLTableRowElement) {
                        this.innerRowTemplate = this.children[i].content.children[j].innerHTML.replace(/`/g, "\\`");
                        break;
                    }
                }
            }
        }
        if (!this.headerTemplate && this.renderHeaderCallback) {
            this.headerTemplate = this.renderHeaderCallback(this);
        }
    }
    resetObserver() {
        this.childObserver.disconnect();
        if (this.observeChildren) {
            this.childObserver.observe(this, { childList: true });
            this.loadTemplates();
            this.requestUpdate();
        }
    }
    fetch() {
        if (!this.fetching && this.fetchData && this.moreItems) {
            this.fetching = true;
            if (this.loadingData) {
                this.loadingData.fetching = true;
            }
            this.fetchData(this.pageNumber, this.pageSize).then(async (items) => {
                this.moreItems = items.length > 0;
                for (let i = 0; i < items.length; i++) {
                    this.items.push(new WawaItem(items[i], this));
                }
                this.pageNumber++;
                this.computeVisibleRows();
                await this.requestUpdate();
                this.fetching = false;
                if (this.loadingData) {
                    this.loadingData.fetching = false;
                }
                if (items.length > 0) {
                    let div = this.renderRoot.querySelector("div");
                    if (div && div.clientHeight !== 0 && div.scrollHeight <= div.clientHeight + this.rowHeight) {
                        this.fetch();
                    }
                }
            });
        }
    }
    computeVisibleRows() {
        let div = this.renderRoot.querySelector("div");
        let thead = this.renderRoot.querySelector("thead");
        if (this.rowHeight > 0) {
            let visibleRows = Math.ceil(div.clientHeight / this.rowHeight) * 2;
            let startIndex = Math.max(Math.floor((div.scrollTop - thead.clientHeight) / this.rowHeight - this.visibleRows / 4), 0);
            let lastScroll = (div.scrollTop - thead.clientHeight) / this.rowHeight;
            if (visibleRows != this.visibleRows || Math.abs(this.lastScroll - lastScroll) > visibleRows / 4) {
                // if the number of visible rows changed, it's enough to request a render
                // if we scrolled one half table height, it's enough to request a render
                this.visibleRows = visibleRows;
                this.startIndex = startIndex;
                this.lastScroll = lastScroll;
            }
        }
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.items.length >= this.pageSize) {
            this.computeVisibleRows();
        }
    }
    onScroll(e) {
        let div = e.composedPath()[0];
        this.computeVisibleRows();
        if (div.scrollHeight - div.clientHeight - div.scrollTop < this.scrollOffset) {
            this.fetch();
        }
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        // if templates aren't loaded yet, do it now
        if (!this.headerTemplate && !this.rowTemplate && !this.loadingTemplate) {
            this.loadTemplates();
        }
        this.resetObserver();
        if (this.loadingData) {
            this.loadingData.fetching = this.fetching;
        }
    }
    update(_changedProperties) {
        if (_changedProperties.has("fetchData")) {
            this.items = [];
            this.pageNumber = 0;
            this.moreItems = true;
            this.fetch();
        }
        if (_changedProperties.has("monitor")) {
            if (this.monitor) {
                // monitor existing items
            }
        }
        if (_changedProperties.has("observeChildren")) {
            this.resetObserver();
        }
        super.update(_changedProperties);
    }
    renderStyles() {
        return html `
        <style>
            div {
                height: 100%;
                overflow-y: auto;
            }
        </style>
        `;
    }
    render() {
        return html `${this.renderStyles()}<div style="width:100%;" @scroll=${this.onScroll}>
            <table part="table" style="border-collapse: collapse;width:100%;">
                <thead part="head">
                    ${this.headerTemplate}
                </thead>
                <tbody part="body">
                    ${this.startIndex > 0 ? html `<tr style="height:${this.startIndex * this.rowHeight}px"></tr>` : html ``}
                    ${repeat(this.items, (i) => i.id, (i, index) => {
            if (index >= this.startIndex && (this.visibleRows == 0 || index < this.startIndex + this.visibleRows)) {
                return html `${i.template}`;
            }
            else {
                return html ``;
            }
        })}
                    ${this.visibleRows > 0 && this.items.length - this.visibleRows - this.startIndex > 0 ? html `<tr style="height:${(this.items.length - this.visibleRows - this.startIndex) * this.rowHeight}px"></tr>` : html ``}
                </tbody>
            </table>
            <loading-data .loadingTemplate=${this.loadingTemplate}></loading-data>
        </div>`;
    }
    /**
     * Insert an item into the table at a specific index.
     * @param item The item to insert into the table
     * @param index The index to insert the item at
     */
    insertItem(item, index) {
        const newItem = new WawaItem(item, this);
        newItem.index = index;
        this.items.filter(i => i.index >= index).forEach(i => {
            i.index += 1;
            i.updateTemplate();
        });
        this.items.splice(index, 0, newItem);
        this.requestUpdate();
    }
    /**
     * Remove an item from the table. Does nothing if the item is not present.
     * @param item The item to remove
     */
    removeItem(item) {
        const index = this.items.findIndex(i => i.item === item);
        if (index === -1) {
            return;
        }
        this.items.splice(index, 1);
        this.items.filter(i => i.index > index).forEach(i => {
            i.index -= 1;
            i.updateTemplate();
        });
        this.requestUpdate();
    }
};
__decorate([
    property({ type: Array })
], WawaTable.prototype, "items", void 0);
__decorate([
    property({ type: Number })
], WawaTable.prototype, "scrollOffset", void 0);
__decorate([
    property({ type: Number })
], WawaTable.prototype, "pageSize", void 0);
__decorate([
    property({ type: Number })
], WawaTable.prototype, "rowHeight", void 0);
__decorate([
    query("loading-data")
], WawaTable.prototype, "loadingData", void 0);
__decorate([
    property({ type: Number })
], WawaTable.prototype, "startIndex", void 0);
__decorate([
    property({ type: Number })
], WawaTable.prototype, "visibleRows", void 0);
__decorate([
    property()
], WawaTable.prototype, "fetchData", void 0);
__decorate([
    property({ type: Boolean })
], WawaTable.prototype, "monitor", void 0);
__decorate([
    property({ type: Boolean })
], WawaTable.prototype, "observeChildren", void 0);
__decorate([
    property({ type: Object })
], WawaTable.prototype, "renderHeaderCallback", void 0);
__decorate([
    property({ type: Object })
], WawaTable.prototype, "renderRowCallback", void 0);
WawaTable = __decorate([
    customElement("wawa-table")
], WawaTable);
export { WawaTable };
let LoadingData = class LoadingData extends LitElement {
    constructor() {
        super(...arguments);
        this.fetching = false;
    }
    render() {
        if (this.fetching) {
            if (this.loadingTemplate) {
                return html `${this.loadingTemplate}`;
            }
        }
        return html ``;
    }
};
__decorate([
    property({ type: Boolean })
], LoadingData.prototype, "fetching", void 0);
__decorate([
    property()
], LoadingData.prototype, "loadingTemplate", void 0);
LoadingData = __decorate([
    customElement("loading-data")
], LoadingData);
export { LoadingData };

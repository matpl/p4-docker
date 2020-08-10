import { html } from "lit-html";
export class WawaItem {
    constructor(item, table) {
        this.item = item;
        this.index = table.items.length;
        this.table = table;
        this.id = WawaItem._uniqueIdCount;
        WawaItem._uniqueIdCount++;
    }
    get template() {
        if (!this._template) {
            this.updateTemplate();
        }
        return this._template;
    }
    updateTemplate() {
        if (this.table.rowTemplate) {
            this._template = Function('html', 'item', 'index', 'table', 'wawaitem', '"use strict";return (' + 'html`' + this.table.rowTemplate + '`' + ')')(html, this.item, this.index, this.table, this);
        }
        else if (this.table.renderRowCallback) {
            this._template = this.table.renderRowCallback(this.item, this.index, this.table, this);
        }
        if (this.templateUpdatedCallback) {
            this.templateUpdatedCallback();
        }
    }
}
WawaItem._uniqueIdCount = 0;

import { IPage, Router, RouterComponent } from "@appnest/web-router";
import { html, LitElement, TemplateResult } from "../base";
import { Container } from "../container";
import { IEntity } from "../ientity";
import { DetailActionCreator } from "./overview/detail.action-creator";
import { DetailStore, DetailStoreEventKind, IDetailStoreEvent } from "./overview/detail.store";

export default class DetailComponent extends LitElement implements IPage {

	parentRouter: RouterComponent;
	private entity: IEntity | null;

	constructor (private detailStore = new DetailStore(), private detailActionCreator = new DetailActionCreator(Container.instance.api)) {
		super();
		this.detailStoreListener = this.detailStoreListener.bind(this);
	}

	/**
	 * When connected, hook up listener to the store and fetch the entity.
	 */
	connectedCallback () {
		super.connectedCallback();
		this.detailStore.addListener(this.detailStoreListener);

		// Fetch the entity based on the ID on the path.
		const pathAtoms = Router.currentPath.match(/detail\/(\d*)/);
		const id = pathAtoms.length > 0 ? Number(pathAtoms[1]) : -1;
		this.detailActionCreator.getEntity(id);
	}

	/**
	 * Handles events dispatched from the detail store.
	 * @param {IDetailStoreEvent} e
	 */
	private detailStoreListener (e: IDetailStoreEvent) {
		switch (e.kind) {
			case DetailStoreEventKind.getEntity:
				this.entity = e.data;
				break;
			case DetailStoreEventKind.getEntityFailed:
				alert(e.data);
				Router.replaceState(null, null, "");
				return;
		}

		this.invalidate();
	}

	render (): TemplateResult {
		return html`
<h2>Detail</h2>
<router-link path="home"><button>Home</button></router-link>
${this.entity != null ? html`<pre>${JSON.stringify(this.entity)}</pre>` : ""}
		`;
	}

}

window.customElements.define("detail-component", DetailComponent);

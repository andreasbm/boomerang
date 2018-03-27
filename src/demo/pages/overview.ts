import { IPage, Router } from "@appnest/web-router";
import { repeat } from "lit-html/lib/repeat";
import { html, LitElement, TemplateResult } from "../base";
import { Container } from "../container";
import { EntityStoreEventKind, IEntityStoreEvent } from "../entity/entity.store";

export default class OverviewComponent extends LitElement implements IPage {

	parentRouter: Router;

	private isLoading = false;

	constructor (private entityActionCreator = Container.instance.entityActionCreator,
							 private entityStore = Container.instance.entityStore) {
		super();

		this.entityStoreListener = this.entityStoreListener.bind(this);
	}

	connectedCallback () {
		super.connectedCallback();
		this.entityActionCreator.getEntities();

		this.entityStore.addListener(this.entityStoreListener);
	}

	private entityStoreListener (e: IEntityStoreEvent) {
		switch (e.kind) {
			case EntityStoreEventKind.entitiesChanged:
				break;
			case EntityStoreEventKind.entityAdded:
				break;
			case EntityStoreEventKind.entityAddedError:
				alert(e.data);
				return;
			case EntityStoreEventKind.loadingStarted:
				this.isLoading = true;
				break;
			case EntityStoreEventKind.loadingEnded:
				this.isLoading = false;
				break;
		}

		this.invalidate();
	}

	disconnectedCallback () {
		this.entityStore.removeListener(this.entityStoreListener);
	}

	private createEntity () {
		this.entityActionCreator.createEntity();
	}

	render (): TemplateResult {
		return html`
<h2>Overview</h2>
<button on-click="${_ => this.createEntity()}">Create entity</button>
${repeat(this.entityStore.entities, entity => entity.id, entity => html`
	<router-link path="detail/${entity.id}"><p>${entity.title}</p></router-link>
`)}
${this.isLoading ? "Loading..." : ""}
		`;
	}

}

window.customElements.define("overview-component", OverviewComponent);

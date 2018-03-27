import "@appnest/web-router";
import { Router } from "@appnest/web-router";

// Setup the router
customElements.whenDefined("router-component").then(async () => {
	const router: Router = document.querySelector("router-component");
	await router.setup([
		{
			path: new RegExp("/detail.*"),
			loader: import("./pages/detail")
		},
		{
			path: new RegExp("/overview.*"),
			loader: import("./pages/overview")
		},
		{
			path: new RegExp(".*"),
			redirectTo: "overview"
		}
	]);
});

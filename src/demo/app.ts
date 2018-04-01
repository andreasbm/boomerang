import "@appnest/web-router";
import { RouterComponent } from "@appnest/web-router";

// Setup the router
customElements.whenDefined("router-component").then(async () => {
	const router: RouterComponent = document.querySelector("router-component");
	console.log(router);
	await router.setup([
		{
			path: new RegExp("/detail.*"),
			component: import("./pages/detail")
		},
		{
			path: new RegExp("/overview.*"),
			component: import("./pages/overview")
		},
		{
			path: new RegExp(".*"),
			redirectTo: "overview"
		}
	]);
});

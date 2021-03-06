const rimraf = require("rimraf");
const tsc = require("node-typescript-compiler");
const tsconfig = {json: require("./tsconfig.json")};
const path = require("path");
const fs = require("fs-extra");

const outLib = "dist";

async function deploy () {
	await cleanLib();
	await compile();
	copySync("./package.json", `./${outLib}/package.json`);
	copySync("./README.md", `./${outLib}/README.md`);
}

function cleanLib (callback) {
	return new Promise((res, rej) => {
		rimraf(outLib, res);
	});
}

function compile (callback) {
	return new Promise((res, rej) => {
		tsc.compile(
			Object.assign({}, tsconfig.json.compilerOptions, {
				"outDir": outLib,
				"target": "es2017",
				"importHelpers": true,
				"declaration": true
			}),
			["src/lib/index.ts"]
		);
		res();
	});
}

function copyFiles (files) {
	return new Promise((res, rej) => {
		for (const file of files) {
			copySync(`./src/${file}`, `./${outLib}/${file}`);
		}
		res();
	});
}

function copySync (src, dest) {
	fs.copySync(path.resolve(__dirname, src), path.resolve(__dirname, dest));
}

deploy().then(_ => {
	console.log("Done!");
});

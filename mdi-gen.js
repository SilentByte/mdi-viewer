//
// Copy over MDI library icons and meta information.
//

/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const xml2js = require("xml2js");
const svgo = require("svgo");

const optimizer = new svgo();

async function extractSvgPath(svg) {
    svg = await optimizer.optimize(svg);
    return (await xml2js.parseStringPromise(svg.data)).svg.path[0].$.d;
}

async function generate() {
    const data = JSON
        .parse(fs.readFileSync("./node_modules/@mdi/svg/meta.json", "utf-8"))
        .map(m => ({
            n: m.name,
            a: m.aliases,
            t: m.tags,
        }));

    for(const [i, d] of data.entries()) {
        console.log(`[${i + 1}/${data.length}] mdi-${d.n}`);
        d.p = await extractSvgPath(fs.readFileSync(`./node_modules/@mdi/svg/svg/${d.n}.svg`, "utf-8"));
    }

    fs.writeFileSync("./src/mdi.gen.json", JSON.stringify(data), "utf-8");
}

generate().then(() => console.log("DONE"));

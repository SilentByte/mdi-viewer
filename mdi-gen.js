//
// Copy over MDI library icons and meta information.
//

/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

const meta = JSON
    .parse(fs.readFileSync("./node_modules/@mdi/svg/meta.json", "utf-8"))
    .map(m => ({
        n: m.name,
        c: m.codepoint,
        a: m.aliases,
        t: m.tags,
    }));

fs.writeFileSync("./src/mdi-meta.gen.json", JSON.stringify(meta), "utf-8");

if(!fs.existsSync("./public/mdi")) {
    fs.mkdirSync("./public/mdi");
}

glob.sync("./node_modules/@mdi/svg/svg/*.svg").forEach(filename => {
    fs.copyFileSync(filename, `./public/mdi/${path.basename(filename)}`);
});

const fs = require("fs-extra");
const rm = require("rimraf").sync;
const Metalsmith = require("metalsmith");
const Handlebars = require("handlebars");

module.exports = function (metadata, ignores, temp, name = ".", parser, clean = true) {
    if (!temp) {
        return Promise.reject(new Error(`invalid source: ${temp}`));
    }
    parser = parser || metaParser;
    return new Promise((resolve, reject) => {
        Metalsmith(process.cwd())
            .metadata(metadata)
            .clean(false)
            .source(temp)
            .ignore(ignores || [])
            .destination(name)
            .use((files, metalsmith, done) => {
                parser(files, metalsmith, done);
            })
            .build(err => {
                err ? reject(err) : resolve({ name, metadata });
                if (clean) {
                    fs.pathExists(temp, (err, exists) => {
                        if (!err) {
                            rm(temp);
                        }
                    });
                }
            })
    });
}

function metaParser(files, metalsmith, done) {
    const meta = metalsmith.metadata();
    Object.keys(files).forEach(fileName => {
        try {
            const content = files[fileName].contents.toString();
            files[fileName].contents = Buffer.from(Handlebars.compile(content)(meta));
        } catch (error) { }
    });
    done();
}
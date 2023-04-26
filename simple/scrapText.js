const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

async function scrape() {
    //* get html text and writed in to a html file
    const html = await request.get("https://www.toplearn.com");
    fs.writeFileSync("./simple/index.html", html);

    //* get h1 text
    const $ = cheerio.load(html);
    const text = $("h1").text();
    console.log(text);

    //* get all h2 texts and save it
    const h2Texts = [];
    $("div.course-col h2 a").each((index, element) => {
        h2Texts[index] = $(element).text();
    });
    fs.writeFileSync("./simple/result.txt", h2Texts.join("\n"));
    console.log(h2Texts);
}

scrape();

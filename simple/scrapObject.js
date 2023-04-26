const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

async function scrape() {
    const html = await request.get("https://www.toplearn.com");
    const $ = cheerio.load(html);

    const data = [];
    const titles = $("body > section > div > div.inner > div > div > div > h2 > a");
    titles.each((index, element) => {
        const previousSibling = $(element.parentNode.previousSibling);
        const nextSibling = $(element.parentNode.nextSibling);
        data[index] = {
            title: $(element).text(),
            author: $(nextSibling.find("a")[0]).text(),
            price: $(nextSibling.find("span.price")).text(),
            time: $(nextSibling.find("span.time")).text(),
            img: $(previousSibling.find("img")[0]).attr("src"),
        };
    });
    console.log($($(titles[0].parentNode.nextSibling).find("a")[1]).text());

    //* write to file
    fs.writeFileSync("./simple/courses.json", JSON.stringify(data));
}

scrape();

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const ObjectToCSV = require("objects-to-csv");
const nodeSchedule = require("node-schedule");
const fs = require("fs");
const url = "https://rahavard365.com";
const allBourseUrl = "/stock";

//* main function
(async () => {
    //* scrap every 30 second
    const job = nodeSchedule.scheduleJob("*/30 * * * * *", () => {
        console.log("scraping now!");
        main();
    });
})();

async function main() {
    //* initiate puppeteer
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url + allBourseUrl);

    //* get all list
    const list = await getList(page);

    //* get detailed list
    const detailedList = await getDetailedList(page, list, 5);

    //* close browser
    browser.close();

    //* write to a file [optional]
    fs.writeFileSync(`./medium/bourse.json`, JSON.stringify(detailedList));
    makeCSVFile(detailedList);
}

async function getList(page) {
    //* initiate cheerio
    const html = await page.content();
    const $ = cheerio.load(html);

    const list = $(".symbol")
        .map((index, element) => ({
            id: index,
            title: $(element).text(),
            url: `${url}${$(element).attr("href")}`,
        }))
        .get();
    return list;
}

async function getDetailedList(page, list, numberItem) {
    const newList = [];
    for (let i = 0; i < list.length; i++) {
        if (i > numberItem) break;
        await page.goto(list[i].url);
        const html = await page.content();
        const $ = cheerio.load(html);
        newList[i] = {
            ...list[i],
            description: $("span.asset-desc").text(),
            strategy: $("#main-gauge-text > span").text(),
            percent: $(
                "#asset-info > div > div:nth-child(1) > span.asset-close.pull-left > span:nth-child(1)"
            ).text(),
        };
        await sleep(1000);
    }

    return newList;
}

async function makeCSVFile(data) {
    const csv = new ObjectToCSV(data);
    await csv.toDisk("./medium/bourse.csv");
}

async function sleep(miliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("one second wait!");
        }, miliseconds);
    });
}

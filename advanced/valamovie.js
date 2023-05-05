const needle = require("needle");
const cheerio = require("cheerio");
const fs = require("fs");

(async () => {
    const movies = await getAllListOfMoviesByPageCount(25);
    fs.writeFileSync("./advanced/valamovie.json", JSON.stringify(movies));
    console.info(movies);
    debugger;
})();

async function getPageHtml(page = 1) {
    return page === 1
        ? needle("get", `https://valamovie.fans`)
        : needle("get", `https://valamovie.fans/page/${page}/`);
}

async function getMoviesFromHtml(html) {
    const $ = cheerio.load(html);
    const movies = $("div.post-body");

    return movies
        .map((index, element) => {
            return {
                title: $(element).find("h2").text(),
                img_url: $(element).find("img").attr("src"),
                genres: $(element)
                    .find("div.col-md-9.col-sm-12.pr-1 > ul > ul > li > span")
                    .text()
                    .split("|"),
                quality: $(element)
                    .find("div.col-md-9.col-sm-12.pr-1 > ul > ul > ul > li > span")
                    .text(),
                director: $(element)
                    .find("div.col-md-9.col-sm-12.pr-1 > ul > ul > ul > ul > ul > li > span > a")
                    .text(),
                actors: $(element)
                    .find("div.col-md-9.col-sm-12.pr-1 > ul > ul > ul > ul > ul > ul > li > span")
                    .text()
                    .trim()
                    .split(","),
                description: $(element)
                    .find(
                        "div.col-md-9.col-sm-12.pr-1 > ul > ul > ul > ul > ul > ul > ul > li > span"
                    )
                    .text(),
                rate: Number(
                    $(element)
                        .find("div.col-md-5.col-sm-12.pos-abs.hidden-sm > div > b")
                        .text()
                        .split("/")[1]
                        .trim()
                ),
                country: $(element)
                    .find("div.col-md-9.col-sm-12.pr-1 > ul > ul > ul > ul > li > span")
                    .text()
                    .split(","),
                more_info_url: $(element).find("h2 a").attr("href"),
            };
        })
        .get();
}

async function getAllListOfMoviesByPageCount(pageCount = 1) {
    const movies = [];
    for (let i = 1; i <= pageCount; i++) {
        const htmlPage = await getPageHtml(i);
        const pageMovies = await getMoviesFromHtml(htmlPage.body);
        movies.push(...pageMovies);
        console.log(`movies from page : ${i} successfully scrapped!`);
        await sleep(1000);
    }
    return movies;
}

async function sleep(milisecond = 1000) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res("sleep done!");
        }, milisecond);
    });
}

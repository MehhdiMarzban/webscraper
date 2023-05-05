const needle = require("needle");
const mongoose = require("mongoose");

(async function () {
    const list = await getLaptopList();
    debugger;
})();

async function getLaptopList(pageSize = 24) {
    const dataJson = await getLaptopListByPage(1, pageSize);
    const { count, categories, results } = dataJson.body;
    const numberOfPages = getNumberOfPages(count, pageSize);
    for (let i = 2; i <= numberOfPages; i++) {
        console.log(`geting data from page: ${i}`);
        const {body: {results: newResults}} = await getLaptopListByPage(i, pageSize);
        results.push(...newResults);
        await sleep(1000);
    }
    return { count, categories, results };
}

async function getLaptopListByPage(page = 1, pageSize = 24) {
    return needle(
        "get",
        `https://api.torob.com/v4/base-product/search/?sort=popularity&category=99&page=${page}&size=${pageSize}`
    );
}


async function sleep(milisec = 10000) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res("sleep done!");
        }, milisec);
    });
}

function getNumberOfPages(count, pageSize) {
    return Math.ceil(count / pageSize);
}

//* not neccessary
function addMoreInfo(list = []) {}

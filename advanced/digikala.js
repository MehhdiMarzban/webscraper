const needle = require("needle");
const fs = require("fs");

//* main function
(async function () {
    const totalPages = await getTotalPages(18);
    let allMobileData = [];

    //* get all phone of a brand
    for(let i = 1; i <= totalPages; i++){
        console.log(`get mobile list from page: ${i}`);
        let pageList = await getMobilesList(18, i);
        for(let j = 0; j<pageList.length; j++){
            console.log(`get mobile detail from item ${j+1}`);
            const detailMobile = await getMobileDetail(pageList[j].id);
            pageList[j].mobileDetail = {...detailMobile}
            await sleep();
        }
        allMobileData.push(...pageList);
    }
    fs.writeFileSync("./advanced/digikala.json", JSON.stringify(allMobileData));
    debugger;
})();

//* get total pages
async function getTotalPages(mobileBrand = 18) {
    const data = await needle(
        "get",
        `https://api.digikala.com/v1/categories/mobile-phone/search/?brands%5B0%5D=${mobileBrand}&seo_url=%2Fcategory-mobile-phone%2Fproduct-list%2F%3Fbrands%255B0%255D%3D18&page=1`
    );
    return data.body.data.pager.total_pages;
}

//* get mobile list based on pages
async function getMobilesList(mobileBrand = 18, page = 0) {
    const data = await needle(
        "get",
        `https://api.digikala.com/v1/categories/mobile-phone/search/?brands%5B0%5D=${mobileBrand}&seo_url=%2Fcategory-mobile-phone%2Fproduct-list%2F%3Fbrands%255B0%255D%3D18&page=${page}`
    );
    return data.body.data.products;
}

//* get detail of a product
async function getMobileDetail(productID = 10849401) {
    const data = await needle("get", `https://api.digikala.com/v1/product/${productID}/`);
    const {
        id,
        rating,
        brand,
        colors,
        title_en,
        title_fa,
        status,
        specifications,
        default_variant: {
            price
        },
    } = data.body.data.product;
    return {
        id,
        rating,
        brand,
        colors,
        title_en,
        title_fa,
        status,
        specifications,
        price,
    };
}

//* sleep
async function sleep(milisecond = 1000) {
    return new Promise((res, err) => {
        setTimeout(() => {
            res("finish 1 sec sleep!");
        }, milisecond);
    });
}

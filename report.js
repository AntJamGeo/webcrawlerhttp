function printReport(pages) {
  console.log("======");
  console.log("REPORT");
  console.log("======");
  const pagesArr = sortPages(pages);
  for (const page of pagesArr) {
    const pageURL = page[0];
    const hits = page[1];
    console.log(`Found ${hits} links to page: ${pageURL}`);
  }
  console.log("==========");
  console.log("END REPORT");
  console.log("==========");
}

function sortPages(pages) {
  const pagesArr = Object.entries(pages);
  pagesArr.sort((a, b) => {
    return b[1] - a[1];
  });
  return pagesArr;
}

module.exports = {
  sortPages,
  printReport,
}
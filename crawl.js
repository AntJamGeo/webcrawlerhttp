const { JSDOM } = require('jsdom');

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  pages[normalizedCurrentURL] = 1;

  console.log(`actively crawling ${currentURL}`);
  
  try {
    const resp = await fetch(currentURL);

    if (resp.status > 399) {
      console.log(`error in fetch with status code ${resp.status} on page ${currentURL}`);
      return pages;
    }

    const contentType = resp.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      console.log(`non-html response, content type ${contentType} on page ${currentURL}`);
      return pages;
    }

    const htmlBody = await resp.text();
    const urls = getURLsFromHTML(htmlBody, baseURL);
    for (const url of urls) {
      pages = await crawlPage(baseURL, url, pages);
    }
  } catch (err) {
    console.log(`error in fetch: ${err.message}, on page: ${currentURL}`);
  }

  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll('a');
  for (const linkElement of linkElements) {
    let url = linkElement.href;
    if (url[0] === '/') {
      url = baseURL + url;
    }
    try {
      const urlObj = new URL(url);
      urls.push(urlObj.href);
    } catch (err) {
      console.log(`invalid url found: ${err.message}`);
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) == '/') {
    return hostPath.slice(0, -1);
  }
  return hostPath
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
}
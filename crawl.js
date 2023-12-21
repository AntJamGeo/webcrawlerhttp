const { JSDOM } = require('jsdom');

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
}
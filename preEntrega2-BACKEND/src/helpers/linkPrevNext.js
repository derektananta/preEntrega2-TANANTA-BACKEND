export function getPrevLink(baseUrl, result) {
    return baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`);
  }
  export function getNextLink(baseUrl, result) {
    return baseUrl.includes('page') ? baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) : baseUrl.concat(`?page=${result.nextPage}`);
  }
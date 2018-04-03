export const BACKEND_URL = "http://localhost:8080/";
export const API_URL = BACKEND_URL + 'api/';

export function findOneAbstract(id, url) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(url + '/' + id, requestOptions).then(handleResponse);
}

export function loadFullAbstract(id, url) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(url + '/loadFull/' + id, requestOptions).then(handleResponse);
}

export function loadDetailedAbstract(id, url) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(url + '/loadDetailed/' + id, requestOptions).then(handleResponse);
}

export function loadDetailedBulkAbstract(ids, url) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(ids)
    };

    return fetch(url + '/loadDetailed', requestOptions).then(handleResponse);
}

export function findAllAbstract(url, page, size) {
    let url_res = new URL(url), params = {page, size};
    Object.keys(params).forEach(key => url_res.searchParams.append(key, params[key]))

    const requestOptions = {
        method: 'GET',
    };

    return fetch(url_res, requestOptions).then(handleResponse);
}

export function findAllFilteredAbstract(url, page, size, filter) {
    let url_res = new URL(url + '/loadFiltered'), params = {page, size};
    Object.keys(params).forEach(key => url_res.searchParams.append(key, params[key]))

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(filter)
    };

    return fetch(url_res, requestOptions).then(handleResponse);
}

export function findSearchCriteriaAbstract(url) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(url + '/loadSearchCriteria', requestOptions).then(handleResponse);
}

export function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}
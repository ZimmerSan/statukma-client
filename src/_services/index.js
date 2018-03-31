export const BACKEND_URL = "http://localhost:8080/";
export const API_URL = BACKEND_URL + 'api/';

export function findOneAbstract(id, url) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(url + id, requestOptions).then(handleResponse);
}

export function findAllAbstract(url, page, size) {
    let url_res = new URL(url), params = {page, size};
    Object.keys(params).forEach(key => url_res.searchParams.append(key, params[key]))

    const requestOptions = {
        method: 'GET',
    };

    return fetch(url_res, requestOptions).then(handleResponse);
}

export function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}

export * from './student.service'
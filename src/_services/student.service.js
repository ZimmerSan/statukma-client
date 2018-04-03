import {API_URL, findAllAbstract, findAllFilteredAbstract, findOneAbstract} from "./abstract.service";

const URL = API_URL + 'students';

const findOne = (id) => (findOneAbstract(id, URL));
const findAll = (page, size) => (findAllAbstract(URL, page, size));
const findAllFiltered = (page, size, filter) => (findAllFilteredAbstract(URL, page, size, filter));

export const studentService = {
    findOne,
    findAll,
    findAllFiltered,
};
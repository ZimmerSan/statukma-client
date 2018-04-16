import {
    API_URL, findAllAbstract, findAllFilteredAbstract, findOneAbstract, loadDetailedAbstract,
    loadFullAbstract
} from "./abstract.service";

const URL = API_URL + 'students';

const findOne = (id) => (findOneAbstract(id, URL));
const findAll = (page, size) => (findAllAbstract(URL, page, size));
const findAllFiltered = (page, size, filter) => (findAllFilteredAbstract(URL, page, size, filter));
const loadFull = (id) => (loadFullAbstract(id, URL));
const loadDetailed = (id) => (loadDetailedAbstract(id, URL));

export const studentService = {
    findOne,
    findAll,
    findAllFiltered,
    loadFull,
    loadDetailed
};
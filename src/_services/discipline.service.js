import {
    API_URL, findAllAbstract, findAllFilteredAbstract, findOneAbstract,
    findSearchCriteriaAbstract, loadDetailedAbstract, loadDetailedBulkAbstract, loadFullAbstract
} from "./abstract.service";

const URL = API_URL + 'disciplines';

const findOne = (id) => (findOneAbstract(id, URL));
const findAll = (page, size) => (findAllAbstract(URL, page, size));
const findAllFiltered = (page, size, filter) => (findAllFilteredAbstract(URL, page, size, filter));
const findSearchCriteria = () => (findSearchCriteriaAbstract(URL));
const loadFull = (id) => (loadFullAbstract(id, URL));
const loadDetailed = (id) => (loadDetailedAbstract(id, URL));
const loadDetailedBulk = (ids) => (loadDetailedBulkAbstract(ids, URL));

export const disciplineService = {
    findOne,
    findAll,
    findAllFiltered,
    findSearchCriteria,
    loadFull,
    loadDetailed,
    loadDetailedBulk
};
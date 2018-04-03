import {
    API_URL, findAllAbstract, findAllFilteredAbstract, findOneAbstract,
    findSearchCriteriaAbstract, loadDetailedAbstract, loadFullAbstract
} from "./abstract.service";

const URL = API_URL + 'specialities';

const findOne = (id) => (findOneAbstract(id, URL));
const findAll = (page, size) => (findAllAbstract(URL, page, size));
const findAllFiltered = (page, size, filter) => (findAllFilteredAbstract(URL, page, size, filter));
const findSearchCriteria = () => (findSearchCriteriaAbstract(URL));
const loadFull = (id) => (loadFullAbstract(id, URL));
const loadDetailed = (id) => (loadDetailedAbstract(id, URL));

export const specialityService = {
    findOne,
    findAll,
    findAllFiltered,
    findSearchCriteria,
    loadFull,
    loadDetailed,
};
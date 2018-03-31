import {API_URL, findAllAbstract, findOneAbstract} from "./index";

const URL = API_URL + 'students';

const findOne = (id) => (findOneAbstract(id, URL));
const findAll = (page, size) => (findAllAbstract(URL, page, size));

export const studentService = {
    findOne,
    findAll,
};
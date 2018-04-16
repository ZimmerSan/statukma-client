import React, {Component} from 'react';
import {studentService} from "../../_services/student.service";
import Pagination from "react-js-pagination";
import {changePage, loadData, loadFilteredData} from "./Hepler";
import BreadCrumbs from "../common/Breadcrumbs";
import {Col, InputGroup, Row} from "react-bootstrap";
import IboxTools from "../common/IboxTools";
import { Link } from 'react-router-dom';
import {facultyService} from "../../_services/faculty.service";
import {specialityService} from "../../_services/speciality.service";
import EntitiesCount from "../partials/EntitiesCount";

const ELEMENTS_PER_PAGE = 20;
const initialState = {
    page: {
        number: 0,
        totalPages: 0,
        totalElements: 0,
    },
    data: [],
    facultyFilters: [],
    specialityFilters: [],
};

class StudentsView extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        let self = this;
        facultyService.findSearchCriteria()
            .then(res => self.setState({
                facultyFilters: res
            }));
        specialityService.findSearchCriteria()
            .then(res => self.setState({
                specialityFilters: res
            }));
        this.load();
    }

    load = () => {
        let filter = {
            name: this.state.nameFilter,
            facultyId: this.state.facultyFilter,
            specialityId: this.state.specialityFilter,
            course: this.state.courseFilter,
        };
        loadFilteredData(this, studentService, ELEMENTS_PER_PAGE, filter);
    };

    changeFilter = (e) => {
        console.log("val = " + e.target.value);
        const { name, value } = e.target;
        this.setState({[name]: value}, this.load);
    };

    render() {
        let {data: students} = this.state;
        const {page, facultyFilters, specialityFilters} = this.state;

        let breadCrumbsElements = [
            {link: '/students', name: 'Students'},
        ];
        let breadCrumbs = <BreadCrumbs pageTitle={'Students'} elements={breadCrumbsElements} buttons={<EntitiesCount count={page.totalElements}/>}/>;

        return [
            breadCrumbs,
            <Row>
                <Col lg={12}>
                    <div className="wrapper wrapper-content animated fadeInRight">
                        <div className="ibox-content m-b-sm border-bottom">
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <label className="control-label" htmlFor="nameFilter">Name</label>
                                        <input type="text" id="nameFilter" name="nameFilter" value={this.state.nameFilter} onChange={this.changeFilter} placeholder="Name" className="form-control"/>
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    <div className="form-group">
                                        <label className="control-label" htmlFor="courseFilter">Course</label>
                                        <input type="text" id="courseFilter" name="courseFilter" value={this.state.courseFilter} onChange={this.changeFilter} placeholder="course" className="form-control"/>
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    <div className="form-group">
                                        <label className="control-label" htmlFor="specialityFilter">Speciality</label>
                                        <select name="specialityFilter" id="specialityFilter" className="form-control" onChange={this.changeFilter}>
                                            <option selected="" key="all" value={''}>All</option>
                                            {specialityFilters.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <label className="control-label" htmlFor="facultyFilter">Faculty</label>
                                        <select name="facultyFilter" id="facultyFilter" className="form-control" onChange={this.changeFilter}>
                                            <option selected="" key="all" value={''}>All</option>
                                            {facultyFilters.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <Row>
                            <Col lg={12}>
                                <div className="ibox float-e-margins">
                                    <div className="ibox-content">
                                        <table className="table table-stripped default table-hover"
                                               data-page-size="8" data-filter="#filter">
                                            <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Course</th>
                                                <th>Speciality</th>
                                                <th>Faculty</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {students.map(s => <tr>
                                                <td><Link to={`/students/${s.id}`}>{s.name}</Link></td>
                                                <td>{s.yearOfStudy}</td>
                                                <td><Link to={"/specialities/" + s.specId}>{s.specName}</Link></td>
                                                <td><Link to={"/faculties/" + s.facId}>{s.facName}</Link></td>
                                                </tr>)}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan={5} style={{'text-align': 'center'}}>
                                                    <Pagination
                                                        activePage={page.number + 1}
                                                        itemsCountPerPage={ELEMENTS_PER_PAGE}
                                                        totalItemsCount={page.totalElements}
                                                        onChange={(item) => changePage(this, item)}
                                                    />
                                                </td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        ];
    }
}

export default StudentsView;
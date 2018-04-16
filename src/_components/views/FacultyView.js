import React, {Component} from 'react';
import Pagination from "react-js-pagination";
import {changePage, loadData, loadFilteredData} from "./Hepler";
import BreadCrumbs from "../common/Breadcrumbs";
import {Col, InputGroup, Row} from "react-bootstrap";
import { Link } from 'react-router-dom';
import {facultyService} from "../../_services/faculty.service";
import EntitiesCount from "../partials/EntitiesCount";
import {specialityService} from "../../_services/speciality.service";
import {studentService} from "../../_services/student.service";

const ELEMENTS_PER_PAGE = 20;
const initialState = {
    faculty: {},
    page: {
        student: {
            number: 0,
            totalPages: 0,
            totalElements: 0,
        }
    },
    students: [],
    specialityFilters: [],
};

class FacultyView extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        this.load();
        specialityService.findSearchCriteria()
            .then(res => this.setState({
                specialityFilters: res
            }));
    }

    load = () => {
        let self = this;

        facultyService
            .loadDetailed(this.props.match.params.id)
            .then(r => {
                let studentFilter = {
                    name: self.state.studentNameFilter,
                    facultyId: r.id,
                    specialityId: self.state.studentSpecialityFilter,
                    course: self.state.studentCourseFilter,
                };

                studentService
                    .findAllFiltered(self.state.page.student.number, ELEMENTS_PER_PAGE, studentFilter)
                    .then(res => {
                        self.setState({
                            faculty: r,
                            students: res.content,
                            page: {
                                ...self.state.page,
                                student: {
                                    number: res.number,
                                    totalPages: res.totalPages,
                                    totalElements: res.totalElements,
                                }
                            }
                        })
                    })
            });
    };

    changeFilter = (e) => {
        console.log("val = " + e.target.value);
        const { name, value } = e.target;
        this.setState({[name]: value}, this.load);
    };

    changeStudentPage = (item) => {
        this.setState({
            page: {
                ...this.state.page,
                student:{
                    ...this.state.page.student,
                    number: item - 1
                }
            }
        }, this.load);
    };

    render() {
        let {faculty, specialityFilters, students} = this.state;
        const {page} = this.state;

        let breadCrumbsElements = [
            {link: `/faculties`, name: 'Faculties'},
            {link: `/faculties/${faculty.id}`, name: faculty.name},
        ];
        let breadCrumbs = <BreadCrumbs pageTitle={faculty.name} elements={breadCrumbsElements}/>;

        return [
            breadCrumbs,
            <Row>
                <Col lg={12}>
                    <div className="wrapper wrapper-content animated fadeInRight">
                        <div className="tabs-container">
                            <ul className="nav nav-tabs">
                                <li className="active"><a data-toggle="tab" href="#tab-1"> Students</a></li>
                            </ul>
                            <div className="tab-content">
                                <div id="tab-1" className="tab-pane active">
                                    <div className="panel-body">
                                        <div className="m-b-sm">
                                            <div className="row">
                                                <div className="col-sm-7">
                                                    <div className="form-group">
                                                        <label className="control-label" htmlFor="nameFilter">Name</label>
                                                        <input type="text" id="studentNameFilter" name="studentNameFilter" value={this.state.studentNameFilter} onChange={this.changeFilter} placeholder="Name" className="form-control"/>
                                                    </div>
                                                </div>
                                                <div className="col-sm-2">
                                                    <div className="form-group">
                                                        <label className="control-label" htmlFor="courseFilter">Course</label>
                                                        <input type="text" id="studentCourseFilter" name="studentCourseFilter" value={this.state.studentCourseFilter} onChange={this.changeFilter} placeholder="course" className="form-control"/>
                                                    </div>
                                                </div>
                                                <div className="col-sm-3">
                                                    <div className="form-group">
                                                        <label className="control-label" htmlFor="specialityFilter">Speciality</label>
                                                        <select name="studentSpecialityFilter" id="studentSpecialityFilter" className="form-control" onChange={this.changeFilter}>
                                                            <option selected="" key="all" value={''}>All</option>
                                                            {specialityFilters.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Row>
                                            <Col lg={12}>
                                                <table className="table table-stripped default table-hover"
                                                       data-page-size="8" data-filter="#filter">
                                                    <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Course</th>
                                                        <th>Speciality</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {students.map(s => <tr>
                                                        <td><Link to={`/students/${s.id}`}>{s.name}</Link></td>
                                                        <td>{s.yearOfStudy}</td>
                                                        <td><Link to={"/specialities/" + s.specId}>{s.specName}</Link>
                                                        </td>
                                                    </tr>)}
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <td colSpan={5} style={{'text-align': 'center'}}>
                                                            <Pagination
                                                                activePage={page.student.number + 1}
                                                                itemsCountPerPage={ELEMENTS_PER_PAGE}
                                                                totalItemsCount={page.student.totalElements}
                                                                onChange={this.changeStudentPage}
                                                            />
                                                        </td>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        ];
    }
}

export default FacultyView;
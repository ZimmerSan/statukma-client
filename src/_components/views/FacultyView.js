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
    item: {},
    page: {
        student: {
            number: 0,
            totalPages: 0,
            totalElements: 0,
        }
    },
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
        facultyService
            .loadDetailed(this.props.match.params.id)
            .then(r => {
                let studentFilter = {
                    name: this.state.studentNameFilter,
                    facultyId: r.id,
                    specialityId: this.state.studentSpecialityFilter,
                    course: this.state.studentCourseFilter,
                };
                studentService
                    .findAllFiltered(this.state.student.number, 10, studentFilter)
                    .then(students => this.setState({item: r}))
            });
    };

    changeFilter = (e) => {
        console.log("val = " + e.target.value);
        const { name, value } = e.target;
        this.setState({[name]: value}, this.load);
    };

    render() {
        let {item: faculty, specialityFilters} = this.state;
        const {page} = this.state;

        // const specialities = faculty.id ? faculty.specialities : [];
        const students = faculty.id ? [] : [];

        let breadCrumbsElements = [
            {link: `/faculties`, name: 'Faculties'},
            {link: `/faculties/${faculty.id}`, name: faculty.name},
        ];
        let breadCrumbs = <BreadCrumbs pageTitle={faculty.name} elements={breadCrumbsElements}/>;

        return [
            breadCrumbs,
            <Row>
                <Col lg={6}>
                    <div className="wrapper wrapper-content animated fadeInRight">
                        <div className="ibox-content m-b-sm border-bottom">
                            <div className="row">
                                <div className="col-sm-7">
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
                                <div className="col-sm-3">
                                    <div className="form-group">
                                        <label className="control-label" htmlFor="specialityFilter">Speciality</label>
                                        <select name="specialityFilter" id="specialityFilter" className="form-control" onChange={this.changeFilter}>
                                            <option selected="" key="all" value={''}>All</option>
                                            {specialityFilters.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
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
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {students.map(s => <tr>
                                                <td>{s.name}</td>
                                                <td>{s.yearOfStudy}</td>
                                                <td><Link to={"/specialities/" + s.specId}>{s.specName}</Link></td>
                                            </tr>)}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan={5} style={{'text-align': 'center'}}>
                                                    {/*<Pagination*/}
                                                        {/*activePage={page.number + 1}*/}
                                                        {/*itemsCountPerPage={ELEMENTS_PER_PAGE}*/}
                                                        {/*totalItemsCount={page.totalElements}*/}
                                                        {/*onChange={(item) => changePage(this, item)}*/}
                                                    {/*/>*/}
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
                <Col lg={6}>
                    <div className="wrapper wrapper-content animated fadeInRight">
                        <div className="ibox-content m-b-sm border-bottom">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="control-label" htmlFor="nameFilter">Name</label>
                                        <input type="text" id="nameFilter" name="nameFilter" value={this.state.nameFilter} onChange={this.changeFilter} placeholder="Name" className="form-control"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<Row>*/}
                            {/*<Col lg={12}>*/}
                                {/*<div className="ibox float-e-margins">*/}
                                    {/*<div className="ibox-content">*/}
                                        {/*<table className="table table-stripped default table-hover"*/}
                                               {/*data-page-size="8" data-filter="#filter">*/}
                                            {/*<thead>*/}
                                            {/*<tr>*/}
                                                {/*<th>Name</th>*/}
                                            {/*</tr>*/}
                                            {/*</thead>*/}
                                            {/*<tbody>*/}
                                            {/*{faculty.map(s => <tr>*/}
                                                {/*<td><Link to={"/faculty/" + s.id}>{s.name}</Link></td>*/}
                                            {/*</tr>)*/}
                                            {/*}*/}
                                            {/*</tbody>*/}
                                            {/*<tfoot>*/}
                                            {/*<tr>*/}
                                                {/*<td colSpan={5} style={{'textAlign': 'center'}}>*/}
                                                    {/*<Pagination*/}
                                                        {/*activePage={page.number + 1}*/}
                                                        {/*itemsCountPerPage={ELEMENTS_PER_PAGE}*/}
                                                        {/*totalItemsCount={page.totalElements}*/}
                                                        {/*onChange={(item) => changePage(this, item)}*/}
                                                    {/*/>*/}
                                                {/*</td>*/}
                                            {/*</tr>*/}
                                            {/*</tfoot>*/}
                                        {/*</table>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                    </div>
                </Col>
            </Row>
        ];
    }
}

export default FacultyView;
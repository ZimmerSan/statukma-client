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
    student: {
        enrollments: []
    },
    specialityFilters: ['ZFREE', 'OPTION', 'MANDAT'],
};

class StudentView extends Component {

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
        self.load();
    }

    load = () => {
        let self = this;

        studentService
            .loadDetailed(this.props.match.params.id)
            .then(r => {
                self.setState({student: r})
            });
    };

    changeFilter = (e) => {
        console.log("val = " + e.target.value);
        const { name, value } = e.target;
        this.setState({[name]: value}, this.load);
    };

    render() {
        let {student} = this.state;
        const {page, typeFilters} = this.state;

        let breadCrumbsElements = [
            {link: '/students', name: 'Students'},
            {link: `/students/${student.id}`, name: student.name},
        ];
        let breadCrumbs = <BreadCrumbs pageTitle={student.name} elements={breadCrumbsElements}/>;

        return [
            breadCrumbs,
            <Row>
                <Col lg={4}>
                    <div className="wrapper wrapper-content animated fadeInDown">
                        <div className="ibox float-e-margins">
                            <div className="ibox-title">
                                <h5>Student Detail</h5>
                            </div>
                            <div>
                                <div className="ibox-content no-padding border-left-right">
                                    <img alt="image" className="img-responsive" src="/img/NaUKMA.png"/>
                                </div>
                                <div className="ibox-content profile-content">
                                    <h4><strong>{student.name}</strong></h4>
                                    <p><i className="fa fa-graduation-cap"></i> {student.level}</p>
                                    <p>
                                        <dl className="small m-t-md">
                                            <dt>Faculty</dt>
                                            <dd><Link to={`/faculties/${student.facId}`}>{student.facName}</Link></dd>
                                            <dt>Speciality</dt>
                                            <dd><Link to={`/specialities/${student.specId}`}>{student.specName}</Link></dd>
                                        </dl>
                                    </p>
                                    <Row>
                                        <Col lg={4}>
                                            <dl className="small m-t-md">
                                                <dt>Course</dt>
                                                <dd>{student.yearOfStudy}</dd>
                                            </dl>
                                        </Col>
                                        <Col lg={4}>
                                            <dl className="small m-t-md">
                                                <dt>Entered</dt>
                                                <dd>{student.yearEnter}</dd>
                                            </dl>
                                        </Col>
                                        <Col lg={4}>
                                            <dl className="small m-t-md">
                                                <dt>Format</dt>
                                                <dd>{student.format}</dd>
                                            </dl>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col lg={8}>
                    <div className="wrapper wrapper-content animated fadeInRight">
                        {/*<div className="ibox-content m-b-sm border-bottom">*/}
                            {/*<div className="row">*/}
                                {/*<div className="col-sm-7">*/}
                                    {/*<div className="form-group">*/}
                                        {/*<label className="control-label" htmlFor="nameFilter">Name</label>*/}
                                        {/*<input type="text" id="nameFilter" name="nameFilter" value={this.state.nameFilter} onChange={this.changeFilter} placeholder="Name" className="form-control"/>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                                {/*<div className="col-sm-2">*/}
                                    {/*<div className="form-group">*/}
                                        {/*<label className="control-label" htmlFor="courseFilter">Course</label>*/}
                                        {/*<input type="text" id="courseFilter" name="courseFilter" value={this.state.courseFilter} onChange={this.changeFilter} placeholder="course" className="form-control"/>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                                {/*<div className="col-sm-3">*/}
                                    {/*<div className="form-group">*/}
                                        {/*<label className="control-label" htmlFor="specialityFilter">Speciality</label>*/}
                                        {/*<select name="typeFilter" id="typeFilter" className="form-control" onChange={this.changeFilter}>*/}
                                            {/*<option selected="" key="all" value={''}>All</option>*/}
                                            {/*{typeFilters.map(cat => <option key={cat} value={cat}>{cat}</option>)}*/}
                                        {/*</select>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                            {/*</div>*/}

                        {/*</div>*/}
                        <Row>
                            <Col lg={12}>
                                <div className="ibox float-e-margins">
                                    <div className="ibox-title">
                                        <h5>Student's Disciplines</h5>
                                        <div className="ibox-tools">
                                            <span className="btn btn-primary btn-xs">{student.enrollments.length} disciplines</span>
                                        </div>
                                    </div>
                                    <div className="ibox-content">
                                        <table className="table table-stripped default table-hover"
                                               data-page-size="8" data-filter="#filter">
                                            <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>On Course</th>
                                                <th>Type</th>
                                                {/*<th>Faculty</th>*/}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {student.enrollments.map(e => <tr>
                                                <td><Link to={`/disciplines/${e.discipline.id}`}>{e.discipline.name}</Link></td>
                                                <td>{e.studentCourse}</td>
                                                <td>{e.regType}</td>
                                                {/*<td><Link to={"/specialities/" + e.specId}>{e.specName}</Link></td>*/}
                                                {/*<td><Link to={"/faculties/" + e.facId}>{e.facName}</Link></td>*/}
                                                </tr>)}
                                            </tbody>
                                            {/*<tfoot>*/}
                                            {/*<tr>*/}
                                                {/*<td colSpan={5} style={{'text-align': 'center'}}>*/}
                                                    {/*<Pagination*/}
                                                        {/*activePage={page.number + 1}*/}
                                                        {/*itemsCountPerPage={ELEMENTS_PER_PAGE}*/}
                                                        {/*totalItemsCount={page.totalElements}*/}
                                                        {/*onChange={(item) => changePage(this, item)}*/}
                                                    {/*/>*/}
                                                {/*</td>*/}
                                            {/*</tr>*/}
                                            {/*</tfoot>*/}
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

export default StudentView;
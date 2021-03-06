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
import {Doughnut, Line} from "react-chartjs-2";

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

    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    studentsByLevelStat = () => {
        const levelNames = ['Бакалавр', 'Магістр'];
        const levels = ['BACHELOR', 'MASTER'];

        const data = {
            labels: levelNames,
            datasets: [{
                data: levels.map((l => this.state.faculty.students.filter(s => s.level === l).length)),
                backgroundColor: [
                    '#36A2EB',
                    '#FFCE56',
                ],
            }],
        };

        const options = {
            legend: {
                position: 'bottom',
            }
        };

        return <div className="p-lg text-center animated fadeIn">
            <div className="m-b-md">
                <h3 className="font-bold no-margins">Students by Level of study</h3>
                <br/>
                <Doughnut data={data} options={options}/>
            </div>
        </div>;
    };

    studentsByCourseStat = () => {
        const { faculty } = this.state;
        const courses = [1, 2, 3, 4];

        const data = {
            labels: courses,
            datasets: [{
                data: courses.map((l => faculty.students.filter(s => s.yearOfStudy === l).length)),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#1AB394'
                ]
            }],
        };

        const options = {
            legend: {
                position: 'bottom',
            }
        };

        return <div className="p-lg text-center animated fadeIn">
            <div className="m-b-md">
                <h3 className="font-bold no-margins">Students by course</h3>
                <br/>
                <Doughnut data={data} options={options}/>
            </div>
        </div>;
    };

    studentsByYearEnterStat = () => {
        const { faculty } = this.state;
        const years = [2012, 2013, 2014, 2015, 2016, 2017];

        const data = {
            labels: years,
            datasets: [
                {
                    label: 'Бакалавр',
                    data: years.map(c => faculty.students.filter(s => s.level === 'BACHELOR' && s.yearEnter === c).length),

                    fill: false,
                    lineTension: 0.1,
                    borderColor: '#1AB394',
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                },
                {
                    label: 'Магістр',
                    data: years.map(c => faculty.students.filter(s => s.level === 'MASTER' && s.yearEnter === c).length),

                    fill: false,
                    lineTension: 0.1,
                    borderColor: '#FF6384',
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                }
            ],
        };

        const options = {
            maintainAspectRatio: true,
            legend: {
                // display: false,
            }
        };

        return <div className="p-lg text-center animated fadeIn">
            <div className="m-b-md">
                <h3 className="font-bold no-margins">Students by Enter Year</h3>
                <br/>
                <Line
                    data={data}
                    options={options}
                    width={100}
                    height={30}
                />
            </div>
        </div>
    };

    studentsBySpecialityStat = () => {
        const { faculty } = this.state;
        const { specialities } = faculty;

        const data = {
            labels: specialities.map(s => s.name),
            datasets: [{
                data: specialities.map(s => s.studentsCount),
                backgroundColor: specialities.map(s => this.getRandomColor())
            }],
        };

        const options = {
            legend: {
                position: 'right',
            }
        };

        return <div className="p-lg text-center animated fadeIn">
            <div className="m-b-md">
                <h3 className="font-bold no-margins">Students by Speciality</h3>
                <br/>
                <br/>
                <Doughnut data={data} options={options}/>
            </div>
        </div>;
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
                                <li className="active"><a data-toggle="tab" href="#tab-1"> Students <span className="label label-info">{faculty.studentsCount}</span></a></li>
                                <li><a data-toggle="tab" href="#tab-2"> Specialities <span className="label label-primary">{faculty.specialitiesCount}</span></a></li>
                                <li><a data-toggle="tab" href="#tab-3"> Statistics</a></li>
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
                                <div id="tab-2" className="tab-pane">
                                    <div className="panel-body">
                                        <Row>
                                            <Col lg={12}>
                                                <table className="table table-stripped default table-hover"
                                                       data-page-size="8" data-filter="#filter">
                                                    <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Students</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {faculty.specialities && faculty.specialities.map(s => <tr>
                                                        <td><Link to={`/specialities/${s.id}`}>{s.name}</Link></td>
                                                        <td>{s.studentsCount}</td>
                                                    </tr>)}
                                                    </tbody>
                                                </table>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div id="tab-3" className="tab-pane">
                                    {faculty.id &&
                                    <div className="panel-body">
                                        <Row>
                                            <Col lg={6}>
                                                {this.studentsByLevelStat()}
                                            </Col>
                                            <Col lg={6}>
                                                {this.studentsByCourseStat()}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={12}>
                                                {this.studentsByYearEnterStat()}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={12}>
                                                {this.studentsBySpecialityStat()}
                                            </Col>
                                        </Row>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>,
            <br/>
        ];
    }
}

export default FacultyView;
import React, {Component} from 'react';
import Pagination from "react-js-pagination";
import {changePage, loadData, loadFilteredData} from "./Hepler";
import BreadCrumbs from "../common/Breadcrumbs";
import {Col, InputGroup, Row} from "react-bootstrap";
import {Link} from 'react-router-dom';
import {facultyService} from "../../_services/faculty.service";
import EntitiesCount from "../partials/EntitiesCount";
import {specialityService} from "../../_services/speciality.service";
import {studentService} from "../../_services/student.service";
import {Doughnut, Line} from "react-chartjs-2";

const ELEMENTS_PER_PAGE = 20;
const initialState = {
    speciality: {},
    studentPage: 0
};

class SpecialityView extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        this.load();
    }

    load = () => {
        specialityService
            .loadDetailed(this.props.match.params.id)
            .then(res => this.setState({speciality: res}));
    };

    changeFilter = (e) => {
        console.log("val = " + e.target.value);
        const {name, value} = e.target;
        this.setState({[name]: value}, this.load);
    };

    changeStudentPage = (item) => {
        this.setState({studentPage: item - 1}, this.load);
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
                data: levels.map((l => this.state.speciality.students.filter(s => s.level === l).length)),
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
        const { speciality } = this.state;
        const courses = [1, 2, 3, 4];

        const data = {
            labels: courses,
            datasets: [{
                data: courses.map((l => speciality.students.filter(s => s.yearOfStudy === l).length)),
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
        const { speciality } = this.state;
        const years = [2012, 2013, 2014, 2015, 2016, 2017];

        const data = {
            labels: years,
            datasets: [
                {
                    label: 'Бакалавр',
                    data: years.map(c => speciality.students.filter(s => s.level === 'BACHELOR' && s.yearEnter === c).length),

                    fill: false,
                    lineTension: 0.1,
                    borderColor: '#1AB394',
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                },
                {
                    label: 'Магістр',
                    data: years.map(c => speciality.students.filter(s => s.level === 'MASTER' && s.yearEnter === c).length),

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

    render() {
        let {speciality, studentPage} = this.state;

        const studentsFiltered = speciality.students
            ? speciality.students
                .filter(s =>
                    (this.state.studentNameFilter ? s.name.toLowerCase().includes(this.state.studentNameFilter) : true)
                    && (this.state.studentCourseFilter ? s.yearOfStudy === parseInt(this.state.studentCourseFilter) : true)
                )
            : [];

        let breadCrumbsElements = [
            {link: `/specialities`, name: 'Specialities'},
            {link: `/specialities/${speciality.id}`, name: speciality.name},
        ];
        let breadCrumbs = <BreadCrumbs pageTitle={speciality.name} elements={breadCrumbsElements}/>;

        return [
            breadCrumbs,
            <Row>
                <Col lg={12}>
                    <div className="wrapper wrapper-content animated fadeInRight">
                        <div className="tabs-container">
                            <ul className="nav nav-tabs">
                                <li className="active"><a data-toggle="tab" href="#tab-1"> Students <span
                                    className="label label-info">{studentsFiltered.length}</span></a></li>
                                <li><a data-toggle="tab" href="#tab-2"> Statistics</a></li>
                            </ul>
                            <div className="tab-content">
                                <div id="tab-1" className="tab-pane active">
                                    <div className="panel-body">
                                        <div className="m-b-sm">
                                            <div className="row">
                                                <div className="col-sm-10">
                                                    <div className="form-group">
                                                        <label className="control-label"
                                                               htmlFor="nameFilter">Name</label>
                                                        <input type="text" id="studentNameFilter"
                                                               name="studentNameFilter"
                                                               value={this.state.studentNameFilter}
                                                               onChange={this.changeFilter} placeholder="Name"
                                                               className="form-control"/>
                                                    </div>
                                                </div>
                                                <div className="col-sm-2">
                                                    <div className="form-group">
                                                        <label className="control-label"
                                                               htmlFor="courseFilter">Course</label>
                                                        <input type="text" id="studentCourseFilter"
                                                               name="studentCourseFilter"
                                                               value={this.state.studentCourseFilter}
                                                               onChange={this.changeFilter} placeholder="course"
                                                               className="form-control"/>
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
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {studentsFiltered
                                                        .slice(studentPage * ELEMENTS_PER_PAGE, (studentPage + 1) * ELEMENTS_PER_PAGE)
                                                        .map(s => (
                                                            <tr>
                                                                <td><Link to={`/students/${s.id}`}>{s.name}</Link></td>
                                                                <td>{s.yearOfStudy}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <td colSpan={5} style={{'text-align': 'center'}}>
                                                            <Pagination
                                                                activePage={this.state.studentPage + 1}
                                                                itemsCountPerPage={ELEMENTS_PER_PAGE}
                                                                totalItemsCount={studentsFiltered.length}
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
                                    {speciality.id &&
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

export default SpecialityView;
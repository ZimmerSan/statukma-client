import React, {Component} from 'react';
import Pagination from "react-js-pagination";
import {changePage, loadData, loadFilteredData} from "./Hepler";
import BreadCrumbs from "../common/Breadcrumbs";
import {Col, InputGroup, Row} from "react-bootstrap";
import { Link } from 'react-router-dom';
import {facultyService} from "../../_services/faculty.service";
import {disciplineService} from "../../_services/discipline.service";
import { Checkbox } from 'react-icheck';
import {Bar, Line, Doughnut} from "react-chartjs-2";

const ELEMENTS_PER_PAGE = 10;
const initialState = {
    page: {
        number: 0,
        totalPages: 0,
        totalElements: 0,
    },
    data: [],
    facultyFilters: [],
    selectedDisciplines: [],
    enrollmentOrder: 'DESC'
};

class DisciplinesView extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentWillMount () {
        this.checkboxes = new Set();
        this.selectedCheckboxes = new Set();
    }

    componentDidMount() {
        let self = this;
        facultyService.findSearchCriteria()
            .then(res => self.setState({
                facultyFilters: res
            }));
        this.load();
    }

    load = () => {
        let filter = {
            name: this.state.nameFilter,
            facultyId: this.state.facultyFilter,
            enrollmentOrder: this.state.enrollmentOrder
        };
        loadFilteredData(this, disciplineService, ELEMENTS_PER_PAGE, filter);
    };

    changeFilter = (e) => {
        console.log("val = " + e.target.value);
        const { name, value } = e.target;
        this.setState({[name]: value}, this.load);
    };

    createCheckbox = id => {
        let check = this.selectedCheckboxes.has(`checkbox-${id}`);
        return <Checkbox id={`checkbox-${id}`}
                  key={id}
                  onChange={this.toggleCheckbox}
                  checkboxClass="icheckbox_flat-green"
                  increaseArea="20%"
                  checked={check}
        />;
    };

    toggleCheckbox = event => {
        event.preventDefault();
        let { id } = event.target;
        if (this.selectedCheckboxes.has(id)) {
            this.selectedCheckboxes.delete(id);
        } else {
            this.selectedCheckboxes.add(id);
        }

        disciplineService
            .loadDetailedBulk([...this.selectedCheckboxes].map(id => id.replace('checkbox-', '')))
            .then(res => this.setState({selectedDisciplines: res}));
    };

    switchEnrollmentOrder = () => {
        let order = this.state.enrollmentOrder;
        let newOrder = order === 'ASC' ? 'DESC' : 'ASC';
        this.setState({enrollmentOrder: newOrder}, this.load);
    };

    clearSelection = () => {
        this.selectedCheckboxes.clear();
        this.setState({selectedDisciplines: []});
    };

    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    statByFaculties = () => {
        let dataSet = this.state.selectedDisciplines;
        let facs = this.state.facultyFilters.sort((f1, f2) => {
            if (f1.id > f2.id) {
                return 1;
            }
            if (f1.id < f2.id) {
                return -1;
            }
            return 0;
        });

        const data = {
            labels: facs.map(f => f.name),
            datasets: dataSet.map((d, i) => {
                return {
                    label: d.name,
                    backgroundColor: this.getRandomColor(),
                    borderWidth: 1,
                    data: facs.map(f => d.enrollments.filter(e => e.student.facId === f.id).length)
                }
            }),
        };

        const options = {
            maintainAspectRatio: true,
        };

        return <div className="p-lg text-center animated fadeIn">
            <div className="m-b-md">
                <h3 className="font-bold no-margins">Students by Years</h3>
                <br/>
                <Bar
                    data={data}
                    options={options}
                    width={100}
                    height={65}
                />
            </div>
        </div>
    };

    statByYears = () => {
        let dataSet = this.state.selectedDisciplines;
        let years = [2017, 2018];

        const data = {
            labels: years,
            datasets: dataSet.map((d, i) => {
                return {
                    label: d.name,
                    fill: false,

                    lineTension: 0.1,
                    borderColor: this.getRandomColor(),
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    data: years.map(y => d.enrollments.filter(e => new Date(e.enrollmentTime).getFullYear() === y).length)
                }
            }),
        };

        const options = {
            maintainAspectRatio: true,
        };

        return <div className="p-lg text-center animated fadeIn">
            <div className="m-b-md">
                <h3 className="font-bold no-margins">Students by Faculties</h3>
                <br/>
                <Line
                    data={data}
                    options={options}
                    width={100}
                    height={65}
                />
            </div>
        </div>
    };

    statByRegType = () => {
        let localKeys = ['Обов.', 'Проф.', 'Вільний вибір'];
        let keys = ['MANDAT', 'OPTION', 'ZFREE'];

        let plots = [];

        this.state.selectedDisciplines.forEach(d => {
            const data = {
                labels: localKeys,
                datasets: [{
                    data: keys.map(k => d.enrollments.filter(e => e.regType === k).length),
                    backgroundColor: [
                        this.getRandomColor(),
                        this.getRandomColor(),
                        this.getRandomColor(),
                    ],
                }],
            };

            const options = {
                legend: {
                    position: 'bottom',
                }
            };

            plots.push(
                <Col lg={6}>
                    <div className="p-lg text-center animated fadeIn">
                        <div className="m-b-md">
                            <h3 className="font-bold no-margins">{d.name}</h3>
                            <br/>
                            <Doughnut data={data} options={options}/>
                        </div>
                    </div>
                </Col>
            );
        });

        return <Row>{plots}</Row>
    };

    render() {
        let {data: disciplines} = this.state;
        const {page, facultyFilters} = this.state;

        let breadCrumbsElements = [
            {link: '/disciplines', name: 'Disciplines'},
        ];

        let btn = this.state.selectedDisciplines.length > 0
            ? <button type="button" className="btn btn-danger m-r-sm animated fadeInRight" onClick={this.clearSelection}>Clear selection</button>
            : <div/>;

        let breadCrumbs = <BreadCrumbs pageTitle={'Disciplines'} elements={breadCrumbsElements} buttons={btn}/>;

        return [
            breadCrumbs,
            <Row>
                <Col lg={12}>
                    <div className="wrapper wrapper-content animated fadeInRight">
                        <div className="tabs-container">
                            <ul className="nav nav-tabs">
                                <li className="active"><a data-toggle="tab" href="#tab-1">Disciplines <span className="label label-info">{page.totalElements}</span></a></li>
                                <li><a data-toggle="tab" href="#tab-2">Statistics {this.selectedCheckboxes.size > 0 && <span className="label label-primary">{this.selectedCheckboxes.size}</span>}</a></li>
                                <li><a data-toggle="tab" href="#tab-3">General Statistics</a></li>
                            </ul>
                            <div className="tab-content">
                                <div id="tab-1" className="tab-pane active">
                                    <div className="panel-body">
                                        <Row>
                                            <Col lg={8}>
                                                <div className="form-group">
                                                    <label className="control-label" htmlFor="nameFilter">Name</label>
                                                    <input type="text" id="nameFilter" name="nameFilter"
                                                           value={this.state.nameFilter} onChange={this.changeFilter}
                                                           placeholder="Name" className="form-control"/>
                                                </div>
                                            </Col>
                                            <Col lg={4}>
                                                <div className="form-group">
                                                    <label className="control-label"
                                                           htmlFor="facultyFilter">Faculty</label>
                                                    <select name="facultyFilter" id="facultyFilter"
                                                            className="form-control" onChange={this.changeFilter}>
                                                        <option selected="" key="all" value={''}>All</option>
                                                        {facultyFilters.map(cat => <option key={cat.id}
                                                                                           value={cat.id}>{cat.name}</option>)}
                                                    </select>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={12}>
                                                <table className="table table-stripped default table-hover"
                                                       data-page-size="8" data-filter="#filter">
                                                    <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Name</th>
                                                        <th>Faculty</th>
                                                        <th>Chair</th>
                                                        <th><a href="#" onClick={this.switchEnrollmentOrder}>Enrolled
                                                            Students</a></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {disciplines.map(s => <tr>
                                                        <td>{this.createCheckbox(s.id)}</td>
                                                        <td><Link to={"/disciplines/" + s.id}>{s.name}</Link></td>
                                                        <td><Link to={"/faculties/" + s.facId}>{s.facName}</Link></td>
                                                        <td><Link to={"/chairs/" + s.chairId}>{s.chairName}</Link></td>
                                                        <td>{s.enrollmentsCount}</td>
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
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div id="tab-2" className="tab-pane">
                                    <div className="panel-body">
                                        <Row>
                                            <Col lg={12}>
                                                {this.state.selectedDisciplines.length > 0
                                                    ? <table className="table table-stripped default table-hover"
                                                           data-page-size="8" data-filter="#filter">
                                                        <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th>Name</th>
                                                            <th>Faculty</th>
                                                            <th>Chair</th>
                                                            <th><a href="#" onClick={this.switchEnrollmentOrder}>Enrolled
                                                                Students</a></th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {this.state.selectedDisciplines.map(s => <tr>
                                                            <td>
                                                                {this.createCheckbox(s.id)}
                                                            </td>
                                                            <td><Link to={"/disciplines/" + s.id}>{s.name}</Link></td>
                                                            <td><Link to={"/faculties/" + s.facId}>{s.facName}</Link></td>
                                                            <td><Link to={"/chairs/" + s.chairId}>{s.chairName}</Link></td>
                                                            <td>{s.enrollmentsCount}</td>
                                                        </tr>)}
                                                        </tbody>
                                                    </table>
                                                    : <span>Select at least one entity, please</span>
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={12}>
                                                {this.state.selectedDisciplines.length > 0 && this.statByFaculties()}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={6}>
                                                {this.state.selectedDisciplines.length > 0 && this.statByYears()}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={12}>
                                                {this.state.selectedDisciplines.length > 0 && this.statByRegType()}
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div id="tab-3" className="tab-pane">
                                    <div className="panel-body">
                                        <Row>
                                            <Col lg={12}>
                                                <span>General Stats here</span>
                                            </Col>
                                        </Row>
                                    </div>
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

export default DisciplinesView;
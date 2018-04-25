import React, {Component} from 'react';
import Pagination from "react-js-pagination";
import {changePage, loadData, loadFilteredData} from "./Hepler";
import BreadCrumbs from "../common/Breadcrumbs";
import {Col, InputGroup, Row} from "react-bootstrap";
import { Link } from 'react-router-dom';
import {facultyService} from "../../_services/faculty.service";
import {Doughnut, Bar, Line} from 'react-chartjs-2';

import { Checkbox } from 'react-icheck';
import 'icheck/skins/all.css'; // or single skin css

const ELEMENTS_PER_PAGE = 20;
const initialState = {
    page: {
        number: 0,
        totalPages: 0,
        totalElements: 0,
    },
    data: [],
    selectedFaculties: [],
};

const colors = [
    'rgba(32,178,147,',
    'rgba(40,197,199,',
    'rgba(236,86,101,',
    'rgba(103,106,108,',
    'rgba(248,171,90,',
    'rgba(25,125,104,',
    'rgba(31,159,159,',
    'rgba(34,131,197,',
];

class FacultiesView extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentWillMount () {
        this.selectedCheckboxes = new Set();
    }

    componentDidMount() {
        let self = this;
        this.load();
    }

    load = () => {
        let filter = {
            name: this.state.nameFilter,
        };
        loadFilteredData(this, facultyService, ELEMENTS_PER_PAGE, filter);
    };

    changeFilter = (e) => {
        const { name, value } = e.target;
        this.selectedCheckboxes.clear();
        this.setState({[name]: value, selectedFaculties:[]}, this.load);
    };

    toggleCheckbox = event => {
        let { id } = event.target;
        if (this.selectedCheckboxes.has(id)) {
            this.selectedCheckboxes.delete(id);
        } else {
            this.selectedCheckboxes.add(id);
        }

        facultyService
            .loadDetailedBulk([...this.selectedCheckboxes].map(id => id.replace('checkbox-', '')))
            .then(res => this.setState({selectedFaculties: res}));
    };

    createCheckbox = id => {
        let check = this.selectedCheckboxes.has(`checkbox-${id}`);

        return <Checkbox id={`checkbox-${id}`}
                         key={id}
                         onChange={this.toggleCheckbox}
                         checkboxClass="icheckbox_flat-green"
                         increaseArea="20%"
                         checked={check}
        />
    };

    clearSelection = () => {
        this.selectedCheckboxes.clear();
        this.setState({selectedFaculties: []});
    };

    studentsWidgetMultiple = () => {
        const courses = [1, 2, 3, 4];
        const data = {
            labels: courses,
            datasets: this.state.selectedFaculties.map((fac, i) => ({
                label: fac.name,
                backgroundColor: colors[i] + '0.8)',
                borderWidth: 1,
                hoverBackgroundColor: colors[i] + '1)',
                data: courses.map(c => fac.students.filter(s => s.yearOfStudy === c).length)
            })),
        };

        const options = {
            maintainAspectRatio: true,
        };

        return <div className="p-lg text-center animated fadeIn">
                <div className="m-b-md">
                    <h3 className="font-bold no-margins">Students by courses</h3>
                    <br/>
                    <Bar
                        data={data}
                        options={options}
                        width={100}
                        height={60}
                    />
                </div>
            </div>
    };

    studentsByYearsWidget = () => {
        const years = [2012, 2013, 2014, 2015, 2016, 2017];

        const data = {
            labels: years,
            datasets: this.state.selectedFaculties.map((fac, i) => ({
                label: fac.name,
                data: years.map(c => fac.students.filter(s => s.yearEnter === c).length),

                fill: false,
                lineTension: 0.1,
                borderColor: colors[i] + '1)',
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
            })),
        };

        const options = {
            maintainAspectRatio: true,
        };

        return <div className="p-lg text-center animated fadeIn">
                <div className="m-b-md">
                    <h3 className="font-bold no-margins">Students by Enter Year</h3>
                    <br/>
                    <Line
                        data={data}
                        options={options}
                        width={100}
                        height={60}
                    />
                </div>
            </div>
    };

    studentLevelWidget = level => {
        const data = {
            labels: this.state.selectedFaculties.map(f => f.name),
            datasets: [{
                data: this.state.selectedFaculties.map((f => f.students.filter(s => s.level === level).length)),
                backgroundColor: this.state.selectedFaculties.map((f, i) => colors[i] + '1)'),
            }],

        };

        const options = {
            legend: {
                position: 'bottom',
            }
        };

        return <div className="p-lg text-center animated fadeIn">
            <div className="m-b-md">
                <h3 className="font-bold no-margins">{level === 'BACHELOR' ? 'Bachelors' : 'Masters'} by faculties</h3>
                <br/>
                <Doughnut data={data} options={options}/>
            </div>
        </div>;
    };

    render() {
        let {data: faculties, selectedFaculties} = this.state;
        const {page} = this.state;

        let breadCrumbsElements = [
            {link: '/faculties', name: 'Faculties'},
        ];

        let btn = this.state.selectedFaculties.length > 0
            ? <button type="button" className="btn btn-danger m-r-sm animated fadeInRight" onClick={this.clearSelection}>Clear selection</button>
            : <div/>;

        let breadCrumbs = <BreadCrumbs pageTitle={'Faculties'} elements={breadCrumbsElements} buttons={btn}/>;

        return [
            breadCrumbs,
            <Row>
                <Col lg={12}>
                    <div className="wrapper wrapper-content animated fadeInRight">
                        <div className="tabs-container">
                            <ul className="nav nav-tabs">
                                <li className="active"><a data-toggle="tab" href="#tab-1">Faculties <span className="label label-info">{page.totalElements}</span></a></li>
                                <li><a data-toggle="tab" href="#tab-2">Statistics {this.selectedCheckboxes.size > 0 && <span className="label label-primary">{this.selectedCheckboxes.size}</span>}</a></li>
                                {/*<li><a data-toggle="tab" href="#tab-3">General Statistics</a></li>*/}
                            </ul>
                            <div className="tab-content">
                                <div id="tab-1" className="tab-pane active">
                                    <div className="panel-body">
                                        <Row>
                                            <Col lg={12}>
                                                <div className="form-group">
                                                    <label className="control-label" htmlFor="nameFilter">Name</label>
                                                    <input type="text" id="nameFilter" name="nameFilter" value={this.state.nameFilter} onChange={this.changeFilter} placeholder="Name" className="form-control"/>
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
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {faculties.map(s => <tr>
                                                        <td>{this.createCheckbox(s.id)}</td>
                                                        <td><Link to={`/faculties/${s.id}`}>{s.name}</Link></td>
                                                    </tr>)
                                                    }
                                                    </tbody>
                                                </table>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div id="tab-2" className="tab-pane">
                                    <div className="panel-body">
                                        <Row>
                                            <Col lg={12}>
                                                {this.state.selectedFaculties.length > 0
                                                    ? <table className="table table-stripped default table-hover"
                                                             data-page-size="8" data-filter="#filter">
                                                        <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th>Name</th>
                                                            <th>Students <span className="label label-info">{this.state.selectedFaculties.map(f => f.studentsCount).reduce((a, b) => a + b, 0)}</span></th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {this.state.selectedFaculties.map(f => <tr className="animated fadeInRight">
                                                            <td>{this.createCheckbox(f.id)}</td>
                                                            <td><Link to={`/faculties/${f.id}`}>{f.name}</Link></td>
                                                            <td>{f.studentsCount}</td>
                                                        </tr>)
                                                        }
                                                        </tbody>
                                                    </table>
                                                    : <span>Select at least one entity, please</span>
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={this.state.selectedFaculties.length > 2 ? 12 : 6}>
                                                {this.state.selectedFaculties.length > 0 && this.studentsWidgetMultiple()}
                                            </Col>
                                            <Col lg={this.state.selectedFaculties.length > 2 ? 12 : 6}>
                                                {this.state.selectedFaculties.length > 0 && this.studentsByYearsWidget()}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={6}>
                                                {this.state.selectedFaculties.length > 0 && this.studentLevelWidget('BACHELOR')}
                                            </Col>
                                            <Col lg={6}>
                                                {this.state.selectedFaculties.length > 0 && this.studentLevelWidget('MASTER')}
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
                {/*<Col lg={6}>*/}
                    {/*<div className="wrapper wrapper-content animated fadeInDown">*/}
                        {/*<Row>*/}
                            {/*<Col lgOffset={4} lg={4} md={6}>*/}
                                {/*<div className="widget style1">*/}
                                    {/*<div className="row vertical-align">*/}
                                        {/*<div className="col-xs-3">*/}
                                            {/*<i className="fa fa-search fa-3x"></i>*/}
                                        {/*</div>*/}
                                        {/*<div className="col-xs-9 text-right">*/}
                                            {/*<span> Found </span>*/}
                                            {/*<h3 className="font-bold">{page.totalElements}</h3>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                            {/*</Col>*/}
                            {/*<Col lg={4} md={6}>*/}
                                {/*<div className={`widget style1 ${selectedFaculties.length === 0 ? `red-bg` : selectedFaculties.length === 1 ? `lazur-bg` : `yellow-bg`}`}>*/}
                                    {/*<div className="row vertical-align">*/}
                                        {/*<div className="col-xs-3">*/}
                                            {/*<i className="fa fa-dot-circle-o fa-3x"></i>*/}
                                        {/*</div>*/}
                                        {/*<div className="col-xs-9 text-right">*/}
                                            {/*<span> Selected </span>*/}
                                            {/*<h3 className="font-bold">{selectedFaculties.length}</h3>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                            {/*<Col lg={1}>*/}
                                {/*/!*{this.studentsWidget(selectedFaculties)}*!/*/}
                            {/*</Col>*/}
                            {/*<Col lg={11}>*/}
                                {/*{this.studentsWidget(selectedFaculties)}*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                    {/*</div>*/}
                {/*</Col>*/}
            </Row>,
            <br/>
        ];
    }
}

export default FacultiesView;
import React, {Component} from 'react';
import Pagination from "react-js-pagination";
import {changePage, loadData, loadFilteredData} from "./Hepler";
import BreadCrumbs from "../common/Breadcrumbs";
import {Col, InputGroup, Row} from "react-bootstrap";
import { Link } from 'react-router-dom';
import {facultyService} from "../../_services/faculty.service";
import {Doughnut, Bar} from 'react-chartjs-2';

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
    selectedFaculties: []
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

    createCheckbox = id => (
        <Checkbox id={`checkbox-${id}`}
                  key={id}
                  onChange={this.toggleCheckbox}
                  checkboxClass="icheckbox_flat-green"
                  increaseArea="20%"/>
    );

    studentsWidget = selFaculties => {
        if (selFaculties.length === 1) {
            return this.studentsWidgetSingle(selFaculties[0]);
        } else if (selFaculties.length > 1) {
            return this.studentsWidgetMultiple(selFaculties);
        }
    };

    studentsWidgetMultiple = facs => {
        console.log(facs);

        const data = {
            labels: [1, 2, 3, 4],
            datasets: facs.map((fac, i) => ({
                label: fac.name,
                backgroundColor: colors[i] + '0.8)',
                borderWidth: 1,
                hoverBackgroundColor: colors[i] + '1)',
                data: Object.values(fac.studentsByCourses)
            })),
        };

        const options = {
            maintainAspectRatio: true,
        };

        return <div className="widget white-bg p-lg text-center animated fadeIn">
                <div className="m-b-md">
                    <h3 className="font-bold no-margins">Students by courses</h3>
                    <br/>
                    <Bar
                        data={data}
                        options={options}
                        width={100}
                        height={75}
                    />
                </div>
            </div>
    };

    studentsWidgetSingle = fac => {
        const data = {
            labels: Object.keys(fac.studentsByCourses),
            datasets: [{
                data: Object.values(fac.studentsByCourses),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#fff'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#fff'
                ]
            }],

        };

        const options = {
            legend: {
                position: 'bottom',
                labels: {
                    fontColor: '#fff'
                }
            }
        };

        return <div className="widget lazur-bg p-lg text-center animated fadeIn">
            <div className="m-b-md">
                <h3 className="font-bold no-margins">Students by courses</h3>
                <small>{fac.studentsCount} total</small>
                <br/>
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
        let breadCrumbs = <BreadCrumbs pageTitle={'Faculties'} elements={breadCrumbsElements}/>;

        return [
            breadCrumbs,
            <Row>
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
                        <Row>
                            <Col lg={12}>
                                <div className="ibox float-e-margins">
                                    <div className="ibox-content">
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
                                                <td>
                                                    {this.createCheckbox(s.id)}
                                                </td>
                                                <td><Link to={`/faculties/${s.id}`}>{s.name}</Link></td>
                                            </tr>)
                                            }
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan={5} style={{'textAlign': 'center'}}>
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
                <Col lg={6}>
                    <div className="wrapper wrapper-content animated fadeInDown">
                        <Row>
                            <Col lgOffset={6} lg={3} md={6}>
                                <div className="widget style1">
                                    <div className="row vertical-align">
                                        <div className="col-xs-3">
                                            <i className="fa fa-search fa-3x"></i>
                                        </div>
                                        <div className="col-xs-9 text-right">
                                            <span> Entities found </span>
                                            <h3 className="font-bold">{page.totalElements}</h3>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={3} md={6}>
                                <div className={`widget style1 ${selectedFaculties.length === 0 ? `red-bg` : selectedFaculties.length === 1 ? `lazur-bg` : `yellow-bg`}`}>
                                    <div className="row vertical-align">
                                        <div className="col-xs-3">
                                            <i className="fa fa-dot-circle-o fa-3x"></i>
                                        </div>
                                        <div className="col-xs-9 text-right">
                                            <span> Selected </span>
                                            <h3 className="font-bold">{selectedFaculties.length}</h3>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                {/*{this.studentsWidget(selectedFaculties)}*/}
                            </Col>
                            <Col lg={6}>
                                {this.studentsWidget(selectedFaculties)}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        ];
    }
}

export default FacultiesView;
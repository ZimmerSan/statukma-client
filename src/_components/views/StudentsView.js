import React, {Component} from 'react';
import {studentService} from "../../_services/student.service";
import Pagination from "react-js-pagination";
import {changePage, loadData} from "./Hepler";
import BreadCrumbs from "../common/Breadcrumbs";
import {Col, Row} from "react-bootstrap";
import IboxTools from "../common/IboxTools";

const ELEMENTS_PER_PAGE = 20;
const initialState = {
    page: {
        number: 0,
        totalPages: 0,
        totalElements: 0,
    },
    data: {
        students: []
    }
};

class StudentsView extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        this.load()
    }

    load = () => loadData(this, studentService, ELEMENTS_PER_PAGE);

    render() {
        let {students} = this.state.data;
        const {page} = this.state;

        let breadCrumbsElements = [
            {link: '/students', name: 'Students'},
        ];
        let breadCrumbs = <BreadCrumbs pageTitle={'Students'} elements={breadCrumbsElements}/>;

        return [
            breadCrumbs,
            <Row>
                <Col lg={12}>
                    <div className="wrapper wrapper-content animated fadeInRight">
                        <div className="ibox float-e-margins">
                            <div className="ibox-title">
                                <h5>Students registered in StatUKMA</h5>

                                <IboxTools/>
                            </div>
                            <div className="ibox-content">
                                <div className="input-group">
                                    <input type="text" placeholder="Search" className="input-sm form-control"/>
                                    <span className="input-group-btn">
                                        <button type="button" className="btn btn-sm btn-primary"> Go!</button>
                                    </span>
                                </div>
                                <table className="footable table table-stripped default footable-loaded"
                                       data-page-size="8" data-filter="#filter">
                                    <thead>
                                    <tr>
                                        <th className="footable-visible footable-first-column footable-sortable footable-sorted">
                                            Rendering engine<span className="footable-sort-indicator"></span></th>
                                        <th className="footable-visible footable-sortable">Browser<span
                                            className="footable-sort-indicator"></span></th>
                                        <th data-hide="phone,tablet" className="footable-visible footable-sortable">
                                            Platform(s)<span className="footable-sort-indicator"></span></th>
                                        <th data-hide="phone,tablet" className="footable-visible footable-sortable">
                                            Engine version<span className="footable-sort-indicator"></span></th>
                                        <th data-hide="phone,tablet"
                                            className="footable-visible footable-last-column footable-sortable">CSS
                                            grade<span className="footable-sort-indicator"></span></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="gradeA footable-even">
                                        <td className="footable-visible footable-first-column"><span
                                            className="footable-toggle"></span>Gecko
                                        </td>
                                        <td className="footable-visible">Netscape Navigator 9</td>
                                        <td className="footable-visible">Win 98+ / OSX.2+</td>
                                        <td className="center footable-visible">1.8</td>
                                        <td className="center footable-visible footable-last-column">A</td>
                                    </tr>
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td colspan="5" className="footable-visible">
                                            <ul className="pagination pull-right">
                                                <li className="footable-page-arrow disabled">
                                                    <a data-page="first" href="#first">«</a>
                                                </li>
                                                <li className="footable-page-arrow disabled">
                                                    <a data-page="prev" href="#prev">‹</a>
                                                </li>
                                                <li className="footable-page active">
                                                    <a data-page="0" href="#">1</a>
                                                </li>
                                                <li className="footable-page"><a data-page="1" href="#">2</a></li>
                                                <li className="footable-page"><a data-page="2" href="#">3</a></li>
                                                <li className="footable-page"><a data-page="3" href="#">4</a></li>
                                                <li className="footable-page"><a data-page="4" href="#">5</a></li>
                                                <li className="footable-page-arrow"><a data-page="next"
                                                                                       href="#next">›</a></li>
                                                <li className="footable-page-arrow"><a data-page="last"
                                                                                       href="#last">»</a></li>
                                            </ul>
                                        </td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>


                        <div className="ibox">
                            <div className="ibox-title">
                                <h5>All projects assigned to this account</h5>
                                <div className="ibox-tools">
                                    <a href="" className="btn btn-primary btn-xs">Create new project</a>
                                </div>
                            </div>
                            <div className="ibox-content">
                                <div className="row m-b-sm m-t-sm">
                                    <div className="col-md-1">
                                        <button type="button" id="loading-example-btn" className="btn btn-white btn-sm">
                                            <i className="fa fa-refresh"></i> Refresh
                                        </button>
                                    </div>
                                    <div className="col-md-11">
                                        <div className="input-group"><input type="text" placeholder="Search"
                                                                            className="input-sm form-control"/> <span
                                            className="input-group-btn">
                                        <button type="button" className="btn btn-sm btn-primary"> Go!</button> </span>
                                        </div>
                                    </div>
                                </div>

                                <div>

                                    <table className="table table-hover">
                                        <tbody>
                                        <tr>
                                            <td className="project-status">
                                                <span className="label label-primary">Active</span>
                                            </td>
                                            <td className="project-title">
                                                <a href="project_detail.html">Contract with Zender Company</a>
                                                <br/>
                                                <small>Created 14.08.2014</small>
                                            </td>
                                            <td className="project-completion">
                                                <small>Completion with: 48%</small>
                                                <div className="progress progress-mini">
                                                    <div style={{width: 48 + '%'}} className="progress-bar"></div>
                                                </div>
                                            </td>
                                            <td className="project-people">
                                                <a href=""><img alt="image" className="img-circle"
                                                                src="img/a3.jpg"/></a>
                                                <a href=""><img alt="image" className="img-circle"
                                                                src="img/a1.jpg"/></a>
                                                <a href=""><img alt="image" className="img-circle"
                                                                src="img/a2.jpg"/></a>
                                                <a href=""><img alt="image" className="img-circle"
                                                                src="img/a4.jpg"/></a>
                                                <a href=""><img alt="image" className="img-circle"
                                                                src="img/a5.jpg"/></a>
                                            </td>
                                            <td className="project-actions">
                                                <a href="#" className="btn btn-white btn-sm"><i
                                                    className="fa fa-folder"></i> View </a>
                                                <a href="#" className="btn btn-white btn-sm"><i
                                                    className="fa fa-pencil"></i> Edit </a>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div>
                            {students.map(s => <p>{s.name}</p>)}
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <Pagination
                                activePage={page.number + 1}
                                itemsCountPerPage={ELEMENTS_PER_PAGE}
                                totalItemsCount={page.totalElements}
                                onChange={(item) => changePage(this, item)}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        ];
    }
}

export default StudentsView;
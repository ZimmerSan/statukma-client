import $ from 'jquery'
import React from 'react';
import { smoothlyMenu } from '../layouts/Helpers';
import {Link} from "react-router-dom";

class TopHeader extends React.Component {
    toggleNavigation(e) {
        e.preventDefault();
        $("body").toggleClass("mini-navbar");
        smoothlyMenu();
    }

    render() {
        const { loggedIn } = false;

        return (
            <div className="row border-bottom">
                <nav className="navbar navbar-static-top" style={{marginBottom: 0}}>
                    <div className="navbar-header">
                        <a className="navbar-minimalize minimalize-styl-2 btn btn-primary " onClick={this.toggleNavigation} href="#"><i className="fa fa-bars"></i> </a>
                    </div>
                    <ul className="nav navbar-top-links navbar-right">
                        {/*<li className="dropdown">*/}
                            {/*<a className="dropdown-toggle count-info" data-toggle="dropdown" href="#">*/}
                                {/*<i className="fa fa-shopping-cart"/>*/}
                                {/*{cart.item*/}
                                    {/*? <span className="label label-primary">{cart.item.itemsCount}</span>*/}
                                    {/*: cart.loading*/}
                                        {/*? <span className="label label-warning">...</span>*/}
                                        {/*: cart.error*/}
                                            {/*? <span className="label label-danger">!</span>*/}
                                            {/*: ''*/}
                                {/*}*/}
                            {/*</a>*/}
                            {/*<ul className="dropdown-menu dropdown-alerts">*/}
                                {/*{cartRecords && cartRecords.map(rec =>*/}
                                    {/*(*/}
                                        {/*<li>*/}
                                            {/*<Link to={'/siteTemplates/' + rec.siteTemplate.id}>*/}
                                                {/*<div>*/}
                                                    {/*<i className="fa fa-circle-o fa-fw"></i> {rec.siteTemplate.title}*/}
                                                    {/*<span className="pull-right text-muted small">x {rec.count}</span>*/}
                                                {/*</div>*/}
                                            {/*</Link>*/}
                                        {/*</li>*/}
                                    {/*)*/}
                                {/*)}*/}
                                {/*{cartRecords && <li className="divider"/>}*/}
                                {/*<li>*/}
                                    {/*<div className="text-center link-block">*/}
                                        {/*<Link to="/cart">*/}
                                            {/*<strong>Go to cart </strong>*/}
                                            {/*<i className="fa fa-angle-right"></i>*/}
                                        {/*</Link>*/}
                                    {/*</div>*/}
                                {/*</li>*/}
                            {/*</ul>*/}
                        {/*</li>*/}
                        <li>
                            <span className="m-r-sm text-muted welcome-message">Welcome to StatUKMA — Statistics of NaUKMA courses...</span>
                        </li>
                        <li>
                            {loggedIn
                                ? <Link to='/login'><i className="fa fa-sign-out"></i> Log Out</Link>
                                : <Link to='/login'><i className="fa fa-sign-in"></i> Log in</Link>
                            }
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default TopHeader;
import $ from 'jquery';
import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class Navigation extends Component {

    componentDidMount() {
        const {menu} = this.refs;
        $(menu).metisMenu();
    }

    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    }

    secondLevelActive(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
    }

    render() {
        return (
            <nav className="navbar-default navbar-static-side">
                <ul className="nav metismenu" id="side-menu" ref="menu">
                    <li className="nav-header">
                        <div className="profile-element">
                            <span></span>
                            <span className="block m-t-xs" style={{color: 'white'}}>
                                StatUKMA
                            </span>
                        </div>
                        <div className="logo-element">
                            S_+
                        </div>
                    </li>
                    <li className={this.activeRoute("/students")}>
                        <Link to="/students"><i className="fa fa-users"></i> <span className="nav-label">Students</span></Link>
                    </li>
                    <li className={this.activeRoute("/specialities")}>
                        <Link to="/specialities"><i className="fa fa-graduation-cap"></i> <span className="nav-label">Specialities</span></Link>
                    </li>
                    <li className={this.activeRoute("/faculties")}>
                        <Link to="/faculties"><i className="fa fa-desktop"></i> <span className="nav-label">Faculties</span></Link>
                    </li>
                    <li className={this.activeRoute("/disciplines")}>
                        <Link to="/disciplines"><i className="fa fa-bars"></i> <span className="nav-label">Disciplines</span></Link>
                    </li>
                    {/*<li className={this.activeRoute("/dashboard")}>*/}
                        {/*<Link to="/dashboard"><i className="fa fa-th-large"/> <span*/}
                            {/*className="nav-label">Dashboard</span> <span className="fa arrow"/></Link>*/}
                        {/*<ul className="nav nav-second-level collapse">*/}
                            {/*<li className={this.activeRoute("/dashboard/orders")}>*/}
                                {/*<Link to="/dashboard/orders">Orders</Link>*/}
                            {/*</li>*/}
                            {/*<li className={this.activeRoute("/dashboard/projects")}>*/}
                                {/*<Link to="/dashboard/projects">Projects</Link>*/}
                            {/*</li>*/}
                        {/*</ul>*/}
                    {/*</li>*/}

                    {/*<li className={this.activeRoute("/cart")}>*/}
                        {/*<Link to="/cart"><i className="fa fa-shopping-cart"></i> <span className="nav-label">Cart</span></Link>*/}
                    {/*</li>*/}
                </ul>
            </nav>
        )
    }
}

export default Navigation
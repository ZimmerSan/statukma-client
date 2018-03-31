import React from 'react';
import {Link} from "react-router-dom";

class BreadCrumbs extends React.Component {
    render() {
        let self = this;

        const {pageTitle, elements, buttons} = self.props;

        return (
            <div className="row wrapper border-bottom white-bg page-heading">
                <div className="col-lg-8">
                    <h2>{pageTitle}</h2>
                    <ol className="breadcrumb">
                        <li className="active">
                            <Link to="/">Home</Link>
                        </li>
                        {elements.map((e, index) =>
                            index !== elements.length - 1
                                ? <li><Link to={e.link}>{e.name}</Link></li>
                                : <li className='active'><strong>{e.name}</strong></li>
                        )}
                    </ol>
                </div>
                <div className="col-lg-4">
                    <div className="title-action">
                        {buttons}
                    </div>
                </div>
            </div>
        )
    }
}

export default BreadCrumbs
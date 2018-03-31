import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import {LoginView} from "../../views/auth/LoginView";
import {RegisterView} from "../../views/auth/RegisterView";

class BlankLayout extends React.Component {

    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/login" component={LoginView}/>
                    <Route exact path="/login/" component={LoginView}/>
                    <Route exact path="/register" component={RegisterView}/>
                    <Route exact path="/register/" component={RegisterView}/>
                </Switch>
            </div>
        )
    }

    componentDidMount(){
        $('body').addClass('gray-bg');
    }

    componentWillUnmount(){
        $('body').removeClass('gray-bg');
    }
}

export default BlankLayout
import React, {Component} from 'react';
import { history } from './_helpers/history';
import {Router, Route, Switch} from 'react-router-dom';
import MainLayout from "./_components/layouts/MainLayout";

class App extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    {/*<Route exact path="/login" component={BlankLayout}/>*/}
                    {/*<Route exact path="/register" component={BlankLayout}/>*/}
                    <Route path="/" component={MainLayout}/>
                </Switch>
            </Router>
        );
    }
}

export default App;

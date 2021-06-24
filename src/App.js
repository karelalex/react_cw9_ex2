import React from 'react'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import {Start} from "./Start";
import {Lk} from "./Lk";
import {Ups} from "./Ups";

function App() {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route path={['/register', '/singin']} component={Start} />
                    <Route path="/lk" component={Lk} />
                    <Redirect from="/" to="/register" exact/>
                    <Route component={Ups} />
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;

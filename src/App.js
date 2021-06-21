import React from 'react'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {RegForm} from "./RegForm";

function App() {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route path="/register" component={RegForm}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;

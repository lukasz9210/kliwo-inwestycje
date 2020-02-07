import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Investments from './Investments.js'
import Buildings from './Buildings.js'
import Levels from './Levels.js'
import Units from './Units.js'

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/inwestycja/:investId"  component={Investments} />
                <Route path="/budynek/:buildingId" component={Buildings} />
                <Route path="/pietro/:levelId" component={Levels} />
                <Route path="/mieszkanie/:unitId" component={Units} />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes
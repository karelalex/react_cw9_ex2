import React, {useState} from "react";
import {MainTitle} from "../MainTitle";
import {TabMenu} from "primereact/tabmenu";
import {Route, Switch} from "react-router-dom";
import {Card} from "primereact/card";
import {IssueTable} from "./IssueTable";
import {Issue} from "./Isuue";
import {CreateIssueDialog} from "./CreateIssueDialog";

export const IssueTracker = ({location, history}) => {
    const [showCreationDialog, setShowCreationDialog] = useState(false)
    const openAdditionWindow = () => setShowCreationDialog(true)
    const items = [
        {
            label: 'Вход', icon: 'pi pi-play', command: function () {
                history.push(this.path)
            }, path: '/singin'
        },
        {
            label: 'Регистрация', icon: 'pi pi-pencil', command: function () {
                history.push(this.path)
            }, path: '/register'
        },
        {
            label: 'Список проблем', icon: 'pi pi-list', command: function () {
                history.push(this.path)
            }, path: '/issues'
        }, {
            label: 'Создать проблему', icon: 'pi pi-plus', command: openAdditionWindow
        }
    ]
    const activeIndex = items.findIndex((item) => location.pathname.startsWith(item.path))
    return (
        <Card style={{marginLeft: '10vw', marginRight: '10vw', marginTop: '15px', backgroundColor: '#FFFCD7'}}>
            <MainTitle
                header='Иссью треккер'
            />
            <CreateIssueDialog visible={showCreationDialog} onHide={() => setShowCreationDialog(false)} />
            <div className="p-mt-4 p-mb-4">
                <TabMenu model={items} activeIndex={activeIndex}/>
            </div>
            <Switch>
                <Route path="/issues" exact><IssueTable callCreator={openAdditionWindow} /></Route>
                <Route path="/issues/:number(\d+)" component={Issue}/>
            </Switch>
        </Card>
    );
}


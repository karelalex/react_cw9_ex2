import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom'
import {getIssueList} from "./issueService";
import {Button} from "primereact/button";
import {openInNewTab} from "./helpers";
import {Panel} from "primereact/panel";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import cat from '../GitHub-Mark-32px.png'
import {Tooltip} from "primereact/tooltip";

export const IssueTable = ({callCreator}) => {
    const [issues, setIssues] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null)
    const history = useHistory()
    const loadIssues = () => {
        getIssueList().then((data) => setIssues(data))
    }

    useEffect(() => loadIssues(), [])

    const renderCreated = (rowData) => new Date(rowData.created_at).toLocaleString()
    const renderReporter = (rowData) => (<span>{rowData.user.login} <Button
        icon="pi pi-angle-right"
        className="p-button-rounded p-button-info p-button-outlined"
        onClick={() => openInNewTab(rowData.user.html_url)}
        tooltip="Перейти на страницу пользователя"
        style={{height: '1em', width: '1em'}}
    /></span>)

    const handleShowIssue = (number) => history.push(`/issues/${number}`)
    const renderButtons = (rowData) => (
        <>
            <Button icon="pi pi-list" className="p-button-rounded p-mr-2" tooltip="Открыть проблему"
                    onClick={() => handleShowIssue(rowData.number)}/>
            <Tooltip target=".gh-icon" />
            <img className="gh-icon" data-pr-tooltip="Открыть на гитхабе" src={cat} onClick={() => openInNewTab(rowData.html_url)}/>
        </>
    )
    const handleRowToggle = (e) => setExpandedRows(e.data)
    const rowExpansionTemplate = (data) => (
        <Panel header={data.title}>
            <p>{data.body}</p>
        </Panel>
    )
    const header = (
        <div>
            <Button  icon="pi pi-plus" tooltip="Создать проблему" onClick={callCreator} className="p-button-rounded p-button-lg p-"/>
            <Button  icon="pi pi-refresh" tooltip="Обновить таблицу" onClick={loadIssues} className="p-button-rounded p-button-lg"/>
        </div>
    )
    return (
        <div className="card">
            <DataTable value={issues} onRowToggle={handleRowToggle} dataKey="number" expandedRows={expandedRows}
                       rowExpansionTemplate={rowExpansionTemplate} header={header}>
                <Column expander style={{width: '3em'}}/>
                <Column field="state" header="Статус" sortable/>
                <Column field="number" header="Номер" sortable/>
                <Column field="title" header="Тема сообщения" sortable/>
                <Column field="created_at" body={renderCreated} header="Создан" sortable/>
                <Column field="user.login" body={renderReporter} header="Создатель" sortable/>
                <Column body={renderButtons} header="Действия"/>
            </DataTable>
        </div>
    )
}

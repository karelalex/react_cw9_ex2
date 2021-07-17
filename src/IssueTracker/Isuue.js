import React, {useEffect, useState} from 'react'
import {isArray} from 'lodash'
import {useParams} from 'react-router-dom'
import {getIssue, getIssueComments, updateIssue} from "./issueService";
import {Button} from "primereact/button";
import {Panel} from "primereact/panel";
import {useForm} from "react-hook-form";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {Card} from "primereact/card";
import {IssueDialog} from "./IssueDialog";

export const Issue = () => {
    const [issue, setIssue] = useState(null)
    const [showDialog, setShowDialog] = useState(false)
    const [commentToSite, setCommentToCite] = useState('')
    const [comments, setComments] = useState(null)
    const [editing, setEditing] = useState(false)
    const {number} = useParams();
    const {register, setValue, handleSubmit} = useForm({shouldUnregister: true});
    const loadIssue = () => {
        try {
            getIssue(number).then(setIssue)
        } catch (e) {
            alert("ошибка загрузки" + e)
        }
    }
    useEffect(loadIssue, [number])

    const handleEditButtonClick = () => {
        if (!editing) {
            setEditing(true)
            setValue('title', issue.title)
            setValue('body', issue.body)
            return
        }

        handleSubmit((issueToSend) =>
            updateIssue(number, issueToSend)
                .then((data) => {
                        setEditing(false)
                        setIssue(data)
                    }
                ).catch((e) => alert('ошибка сохранения' + e))
        )()


    }

    const handleReply = (string) => {
        setCommentToCite(string)
        setShowDialog(true)
    }

    const handleAddComment = (comment) => {
        setComments([
            ...comments,
            comment
        ])
    }

    const loadComments = () => {
        try {
            getIssueComments(number).then(setComments)
        } catch (e) {
            alert("ошибка загрузки" + e)
        }
    }
    const footer = () => (
        <span>
            <Button onClick={loadComments} className="p-mr-2" disabled={!issue.comments || editing}>Показать каменты</Button>
            <Button onClick={handleEditButtonClick}
                    className="p-mr-2">{editing ? 'Cохранить' : 'Редактировать'}</Button>
            {editing && <Button onClick={() => setEditing(false)} className="p-mr-2 p-button-outlined p-button-secondary">Отмена</Button>}
            <Button className="p-mr-2" onClick={() => handleReply('')} disabled={editing}>Ответить</Button>
        </span>
    )
    const renderComments = () =>
        isArray(comments) && (
            <Card title="Комментарии" style={
                {
                    marginLeft: '5vw',
                    marginRight: '5vw',
                    marginTop: '20px'
                }
            }
            >
                {
                    comments.map((comment) => (
                        <Panel header={comment.user.login} key={comment.body}>
                            {comment.body}

                            <Button
                                icon="pi pi-comments"
                                className="p-button-rounded p-button-info p-button-outlined p-mr-2"
                                onClick={() => handleReply(comment.body)}
                                tooltip="Ответить"
                                style={{ float: 'right'}}
                            />
                        </Panel>
                    ))
                }
            </Card>
        )

    const renderEditForm = () => (
        <form>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="title">Заголовок</label>
                    <InputText id="title" {...register('title', {required: true})} />
                </div>
                <div className="p-field">
                    <label htmlFor="body">Описание</label>
                    <InputTextarea rows={3} id="body" {...register('body', {required: true})} />
                </div>
            </div>
        </form>
    )

    const renderCard = () => (
        < >
            <h1>Проблема номер {number}</h1>
            <IssueDialog issueNumber={number} onHide={() => setShowDialog(false)} visible={showDialog} commentToCite={commentToSite} addComent={handleAddComment}/>
            < Card
                title={
                    issue.title
                }
                footer={footer}>
                {editing ? renderEditForm() : <Panel header={issue.user.login}>{issue.body}</Panel>}
            </Card>
            {
                renderComments()
            }
        </>
    )


    const renderEmpty = () => (
        <Card>
            <p>Данные не загружены</p>
        </Card>
    )
    return issue ? renderCard() : renderEmpty()
}

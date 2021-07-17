import React, {useEffect} from "react";
import {Dialog} from "primereact/dialog";
import {InputTextarea} from "primereact/inputtextarea";
import {useForm} from "react-hook-form";
import {Button} from "primereact/button";
import {addComment, closeIssue, lockIssue} from "./issueService";

export const IssueDialog = ({visible, onHide, issueNumber, commentToCite, addComent}) => {
    const {register, handleSubmit, setValue} = useForm({
        shouldUnregister: true
    });
    const onSave = handleSubmit((data) => {
        addComment(issueNumber, data).then(
            (data) => {
                addComent(data)
                onHide()
            }
        ).catch((e) => alert('Ошибка сохранения ' + e))

    })

    const onIssueClose = async () => {
        try {
            await closeIssue(issueNumber)
            await lockIssue(issueNumber)
            onHide()
        } catch (e) {
            alert("ошибка закрытия " + e)
        }

    }


    const footer = () => (
        <div>
            <Button label="Отмена" icon="pi pi-times" onClick={() => onHide()} className="p-button-text"/>
            <Button label="Добавить камент" icon="pi pi-check" onClick={onSave} autoFocus/>
            <Button label="Закрыть проблему" icon="pi pi-ban" onClick={onIssueClose} className="p-button-danger"/>
        </div>
    )

    useEffect(() => setValue('body', ` > ${commentToCite}`), [commentToCite])

    return (
        <Dialog onHide={onHide} visible={visible} header="Управление проблемой" footer={footer()}>
            <form>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="body">Камент</label>
                        <InputTextarea rows={3} id="body" {...register('body', {required: true})} />
                    </div>
                </div>
            </form>
        </Dialog>
    )
}

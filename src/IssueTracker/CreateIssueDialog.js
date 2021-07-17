import React from "react";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {useForm} from "react-hook-form";
import {Button} from "primereact/button";
import {createIssue} from "./issueService";

export const CreateIssueDialog = ({visible, onHide}) => {
    const {register, handleSubmit} = useForm({shouldUnregister: true});
    const onSave = handleSubmit((data) => {
        createIssue(data).then(() => onHide()).catch((e) => alert('Ошибка сохранения '+ e))

    })
    const footer = () => (
        <div>
        <Button label="Отмена" icon="pi pi-times" onClick={() => onHide()} className="p-button-text" />
        <Button label="Создать" icon="pi pi-check" onClick={onSave} autoFocus />
    </div>
    )
    return(
        <Dialog onHide={onHide} visible={visible} header="Создание проблемы" footer={footer()}>
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
        </Dialog>
    )
}

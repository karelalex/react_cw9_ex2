import React from "react";
import {Card} from "primereact/card";
import {MainTitle} from "./MainTitle";
import {Button} from "primereact/button";

export const Ups = ({history}) => (
    <Card style={{width: '500px', marginLeft: '20vw'}}>
        <MainTitle
            header='Что-то пошло не так'
        />
        <div >
            <Button label="Вернитесь на главную страницу" className="p-button-link" onClick={() => history.push('/')}/>
        </div>
    </Card>
)

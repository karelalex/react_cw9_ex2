import {MainTitle} from './MainTitle'
import {TabMenu} from "primereact/tabmenu";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Password} from "primereact/password";
import axios from 'axios'
import {Calendar} from "primereact/calendar";
import {InputMask} from "primereact/inputmask";
import {SelectButton} from "primereact/selectbutton";
import {FioSuggestions} from "react-dadata";
import 'react-dadata/dist/react-dadata.css';
import {Card} from "primereact/card";

const items = [
    {label: 'Вход', icon: 'pi pi-play'},
    {label: 'Регистрация', icon: 'pi pi-pencil'}
]

const genders = [
    {label: 'Мужской', value: 'MALE'},
    {label: 'Женский', value: 'FEMALE'}
]

const API_KEY = '7b4ed6885784c3bbae56027c41ea69ccb911fe7d'

export const RegForm = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    return (
        <Card style={{width: '500px', marginLeft: '20vw'}}>
            <MainTitle
                header='Личный кабинет клиента'
                subHeader='Войдите или зарегистрируйтесь в личном кабинете. При регистрации укажите действующий номер телефона на него будет направлен пароль через смс'
            />
            <div className="p-mt-4 p-mb-4">
                <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
            </div>
            {activeIndex === 0 && <SingInForm/>}
            {activeIndex === 1 && <SingUpForm/>}
        </Card>
    )
}

const SingInForm = () => {
    const {register, handleSubmit} = useForm()
    const onSubmit = (data) => {
        axios.post('https://jsonplaceholder.typicode.com/posts', data).then((resp) => console.log(resp))
    }
    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="phone">Телефон</label>
                        <InputText id="phone" {...register('phone')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="pass">Пароль</label>
                        <Password id="pass" {...register('pass')} />
                    </div>
                    <div className="p-field">
                        <Button icon="pi pi-check" iconPos="right" type='submit' label="Войти"/>
                    </div>
                </div>
            </form>
        </Card>
    )
}

const SingUpForm = () => {
    const {register, handleSubmit, setValue} = useForm()
    const [fio, setFio] = useState()
    const [gender, setGender] = useState("MALE")
    const onGenderChange = (value) => {
        setGender(value)
        setValue('gender', value)
    }
    const onSubmit = (data) => {
        axios.post('https://jsonplaceholder.typicode.com/posts', data).then((resp) => console.log(resp))
    }
    const setFioHandler = (value) => {
        setValue('name', value.data.name)
        setValue('surname', value.data.surname)
        setValue('patronymic', value.data.patronymic)
        onGenderChange(value.data.gender)

        setFio(value)
    }
    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="fio">ФИО</label>
                        <FioSuggestions
                            token={API_KEY}
                            value={fio}
                            onChange={setFioHandler}
                            inputProps={{
                                id: "fio",
                                className: 'p-inputtext p-component'
                            }}/>
                    </div>
                    <div className="p-field">
                        <label htmlFor="surname">Фамилия</label>
                        <InputText id="surname" {...register('surname')}/>
                    </div>
                    <div className="p-field">
                        <label htmlFor="name">Имя</label>
                        <InputText id="name" {...register('name')}/>
                    </div>
                    <div className="p-field">
                        <label htmlFor="patronymic">Отчество</label>
                        <InputText id="patronymic" {...register('patronymic')}/>
                    </div>
                    <div className="p-field">
                        <label htmlFor="birthday">День рождения</label>
                        <Calendar id="birthday" {...register('birthday')} monthNavigator yearNavigator yearRange="1900:2030"/>
                    </div>
                    <div className="p-field">
                        <label htmlFor="phone">Телефон</label>
                        <InputMask mask="+9 999 999 99 99" id="phone" {...register('phone')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="gender">Пол</label>
                        <SelectButton id="gender" {...register('gender')} options={genders} value={gender}
                                      onChange={(e) => onGenderChange(e.target.value)}/>
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">E-mail</label>
                        <InputText id="email" {...register('email')}/>
                    </div>
                    <div className="p-field">
                        <Button icon="pi pi-check" iconPos="right" type='submit' label="Зарегистрироваться"/>
                    </div>
                </div>
            </form>
        </Card>
    )
}

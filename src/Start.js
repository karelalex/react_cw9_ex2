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
import {Route, Switch} from "react-router-dom";
import {API_KEY} from "./constants";
import {useDispatch} from "react-redux";
import {setUserInitials} from "./redux/action";


const genders = [
    {label: 'Мужской', value: 'MALE'},
    {label: 'Женский', value: 'FEMALE'}
]

export const Start = ({location, history}) => {
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
        }
    ]
    const activeIndex = items.findIndex((item) => item.path === location.pathname)
    return (
        <Card style={{width: '500px', marginLeft: '20vw'}}>
            <MainTitle
                header='Личный кабинет клиента'
                subHeader='Войдите или зарегистрируйтесь в личном кабинете. При регистрации укажите действующий номер телефона на него будет направлен пароль через смс'
            />
            <div className="p-mt-4 p-mb-4">
                <TabMenu model={items} activeIndex={activeIndex}/>
            </div>
            <Switch>
                <Route path="/singin" component={SingInForm} />
                <Route path="/register" component={SingUpForm} />
            </Switch>
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

const SingUpForm = ({history}) => {
    const {register, handleSubmit, setValue, watch} = useForm()
    const [fio, setFio] = useState()
    const [showFioFields, setShowFioField] = useState(false)
    const dispatch = useDispatch()
    const onSubmit = (data) => {
        axios.post('https://jsonplaceholder.typicode.com/posts', data).then((resp) => {
            console.log(resp, fio)
            dispatch(setUserInitials(fio))
            history.push('/lk')
        })
    }
    const setFioHandler = (value) => {
        setValue('name', value.data.name)
        setValue('surname', value.data.surname)
        setValue('patronymic', value.data.patronymic)
        setValue('gender', value.data.gender)

        setFio(value)
        setShowFioField(true)
    }
    const gender = watch('gender')
    const birthday=watch('birthday')
    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="fio">ФИО</label>
                        <FioSuggestions
                            token={API_KEY}
                            value={fio}
                            delay={500}
                            onChange={setFioHandler}
                            inputProps={{
                                id: "fio",
                                className: 'p-inputtext p-component'
                            }}/>
                    </div>
                    {showFioFields ? (
                        <>
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
                                <label htmlFor="gender">Пол</label>
                                <SelectButton id="gender" {...register('gender')} options={genders} value={gender}/>
                            </div>
                        </>
                        ) : (
                        <div className="p-d-flex p-jc-end">
                            <Button
                                icon="pi pi-plus"
                                className="p-button-secondary p-button-raised p-button-rounded"
                                onClick={() => setShowFioField(true)}
                            />
                        </div>
                    )}

                    <div className="p-field">
                        <label htmlFor="birthday">День рождения</label>
                        <Calendar
                            id="birthday"
                            {...register('birthday', {
                                pattern: /^[0123]\d\.[01]\d\.(?:19|20)\d{2}$/
                            })}
                            value={birthday}
                            monthNavigator
                            yearNavigator
                            yearRange="1900:2030"
                            dateFormat="dd.mm.yy"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="phone">Телефон</label>
                        <InputMask
                            mask="+9 (999) 999-99-99"
                            id="phone" {...register('phone', {
                                pattern: /^\+\d \(\d{3}\) \d{3}-\d{2}-\d{2}$/
                            })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">E-mail</label>
                        <InputText
                            id="email"
                            {...register('email', {
                                pattern: /^[a-z.]+@[a-z]+\.[a-z]{2,}$/
                            })}
                        />
                    </div>
                    <div className="p-field">
                        <Button icon="pi pi-check" iconPos="right" type='submit' label="Зарегистрироваться"/>
                    </div>
                </div>
            </form>
        </Card>
    )
}

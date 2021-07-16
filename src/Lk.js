import React, {useEffect, useState} from "react";
import {Card} from "primereact/card";
import {MainTitle} from "./MainTitle";
import {AddressSuggestions, FioSuggestions} from "react-dadata";
import {InputText} from "primereact/inputtext";
import {API_KEY} from "./constants";
import {useForm} from "react-hook-form";
import {RadioButton} from "primereact/radiobutton";
import {Calendar} from "primereact/calendar";
import {isEmpty, sum} from "lodash";
import {ProgressBar} from "primereact/progressbar";
import {Badge} from "primereact/badge";
import {Button} from "primereact/button";
import {useDispatch, useSelector} from "react-redux";
import {getUserInitials} from "./redux/selectors";
import {withAnimation} from "./withAnimation";
import {setUserInitials} from "./redux/action";

const calculateFirst = (fields) => {
    const {name, surname, patronymic, gender, surnameChange, newSurname} = fields;
    if (isEmpty(name)) return 0;
    if (isEmpty(surname)) return surnameChange === 'no' ? 25 : 20
    if (isEmpty(patronymic)) return surnameChange === 'no' ? 50 : 40
    if (isEmpty(gender)) return surnameChange === 'no' ? 75 : 60
    if (isEmpty(newSurname)) return surnameChange === 'no' ? 100 : 80
    return 100
}

const calculateSecond = (fields) => {
    const {passNumber, issueDate, issuerCode, issuer, birthday, placeOfBirth} = fields
    if (isEmpty(passNumber)) return 0;
    if (!issueDate) return 16;
    if (isEmpty(issuerCode)) return 33;
    if (isEmpty(issuer)) return 50;
    if (!birthday) return 66;
    if (isEmpty(placeOfBirth)) return 84;
    return 100;
}

const calculateThird = (fields) => {
    const {addressReg, addressFact, factAddressEqual} = fields
    if (isEmpty(addressReg)) return 0
    if (isEmpty(addressFact)) return factAddressEqual === 'yes' ? 100 : 50
    return 100
}
const progressCalculator = (fields) => {
    const first = calculateFirst(fields)
    const second = first < 100 ? 0 : calculateSecond(fields);
    const third = second < 100 ? 0 : calculateThird(fields)
    return [first, second, third]
}


export const Lk = () => {
    const {register, handleSubmit, setValue, watch, getValues} = useForm({
        defaultValues: {
            surnameChange: 'no',
            factAddressEqual: 'yes'
        }
    })
    const [progresses, setProgresses] = useState([0, 0, 0])
    const fields = getValues();
    const handleBlur = () => {
        setProgresses(progressCalculator(getValues()))
    }
    return (
        <Card style={{width: '1200px', marginLeft: '10vw'}}>
            <MainTitle
                header='Личный кабинет клиента'
            />
            <div className="p-grid">
                <div className="p-col-7">
                    <MainInfo register={register} setValue={setValue} watch={watch} onBlur={handleBlur}/>
                    <PassData register={register} setValue={setValue} watch={watch} onBlur={handleBlur}/>
                    <AddressData register={register} setValue={setValue} watch={watch} onBlur={handleBlur}/>
                    <div className="p-field">
                        <Button icon="pi pi-check" iconPos="right" type='submit' label="Отправить"/>
                    </div>
                </div>
                <div className="p-col-5">
                    {progresses[0] === 100 && <MainInfoStaticAnimated fields={fields}/>}
                    {progresses[1] === 100 && <PassDataStaticAnimated fields={fields}/>}
                    {progresses[2] === 100 && <AddressDataStaticAnimated fields={fields}/>}
                </div>
            </div>
            <Progress progresses={progresses}/>
        </Card>
    );
}
const MainInfo = ({register, setValue, watch, onBlur}) => {
    const [fio, setFio] = useState()
    const surname = register('surname')
    const name = register('name')
    const patronymic = register('patronymic')
    const gender = register('gender')
    const newSurname = register('newSurname')
    const surnameChangeValue = watch('surnameChange')
    const dispatch = useDispatch()
    const setFioHandler = (value) => {
        setValue('name', value && value.data.name)
        setValue('surname', value && value.data.surname)
        setValue('patronymic', value && value.data.patronymic)
        setValue('gender', value && value.data.gender)

        setFio(value)
        dispatch(setUserInitials(value))
        onBlur()
    }
    const userInitials = useSelector(getUserInitials)
    useEffect(() => {
        setFioHandler(userInitials)
    }, [userInitials])
    return (
        <Card title="Основная информация">
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
                <div className="p-field">
                    <label>Смена фамилии</label>
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="snc1" name="surnameChange" value="yes" onChange={(e) => {
                            setValue('surnameChange', e.value)
                            onBlur()
                        }} checked={surnameChangeValue === 'yes'}/>
                        <label htmlFor="snc2">Да</label>
                    </div>
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="snc2" name="surnameChange" value="no"
                                     onChange={(e) => {
                                         setValue('surnameChange', e.value)
                                         onBlur()
                                     }}
                                     checked={surnameChangeValue === 'no'}/>
                        <label htmlFor="snc2">Нет</label>
                    </div>
                </div>
                {surnameChangeValue === 'yes' && (
                    <div className="p-field">
                        <label htmlFor="newSurname">Новая фамилия</label>
                        <InputText id="newSurname" {...newSurname} onBlur={(e) => {
                            newSurname.onBlur(e)
                            onBlur()
                        }}/>
                    </div>
                )}
            </div>
        </Card>)
}

const MainInfoStatic = ({fields}) => {
    const {name, surname, patronymic, gender, surnameChange, newSurname} = fields;
    return (
        <Card title="Основная информация">
            <div className="p-fluid">
                <div className="p-grid p-fluid">
                    <div className="p-field p-col-12 p-md-5 p-text-bold">
                        Фамилия
                    </div>
                    <div className="p-field p-col-12 p-md-7">
                        {surname}
                    </div>
                </div>
                <div className="p-grid p-fluid">
                    <div className="p-field p-col-12 p-md-5 p-text-bold">
                        Имя
                    </div>
                    <div className="p-field p-col-12 p-md-7">
                        {name}
                    </div>
                </div>
                <div className="p-grid p-fluid">
                    <div className="p-field p-col-12 p-md-5 p-text-bold">
                        Отчество
                    </div>
                    <div className="p-field p-col-12 p-md-7">
                        {patronymic}
                    </div>
                </div>
                <div className="p-grid p-fluid">
                    <div className="p-field p-col-12 p-md-5 p-text-bold">
                        Пол
                    </div>
                    <div className="p-field p-col-12 p-md-7">
                        {gender === 'MALE' ? 'Мужской' : gender === 'FEMALE' ? 'женский' : ''}
                    </div>
                </div>
                {surnameChange === 'yes' && <div className="p-grid p-fluid">
                    <div className="p-field p-col-12 p-md-5 p-text-bold">
                        Новая фамилия
                    </div>
                    <div className="p-field p-col-12 p-md-7">
                        {newSurname}
                    </div>
                </div>}
            </div>
        </Card>

    )
}

const AddressDataStatic = ({fields}) => {
    const {addressReg, addressFact, factAddressEqual} = fields
    return (
        <Card title="Адрес регистрации">
            <div className="p-fluid">
                <div className="p-grid p-fluid">
                    <div className="p-field p-col-12 p-md-5 p-text-bold">
                        Адресс регистрации
                    </div>
                    <div className="p-field p-col-12 p-md-7">
                        {addressReg}
                    </div>
                </div>
                {factAddressEqual === 'no' && <div className="p-grid p-fluid">
                    <div className="p-field p-col-12 p-md-5 p-text-bold">
                        Фактический адрес
                    </div>
                    <div className="p-field p-col-12 p-md-7">
                        {addressFact}
                    </div>
                </div>}
            </div>
        </Card>)
}

const PassDataStatic = ({fields}) => {
    const {passNumber, issueDate, issuerCode, issuer, birthday, placeOfBirth} = fields
    return (
        <Card title="Паспортные данные">
            <div className="p-fluid">
                <div className="p-grid p-fluid">
                    <div className="p-field p-col-12 p-md-5 p-text-bold">
                        Номер и серия
                    </div>
                    <div className="p-field p-col-12 p-md-7">
                        {passNumber}
                    </div>
                </div>
                <div className="p-grid p-fluid">
                    <div className="p-field p-col-12 p-md-5 p-text-bold">
                        Дата выдачи
                    </div>
                    <div className="p-field p-col-12 p-md-7">
                        {issueDate && issueDate.toLocaleDateString()}
                    </div>
                </div>
                <div className="p-grid p-fluid">
                    <div className="p-field p-col-12 p-md-5 p-text-bold">
                        Код
                    </div>
                    <div className="p-field p-col-12 p-md-7">
                        {issuerCode}
                    </div>
                </div>
                <div className="p-grid p-fluid">
                    <div className="p-field p-col-12 p-md-5 p-text-bold">
                        Кем выдан
                    </div>
                    <div className="p-field p-col-12 p-md-7">
                        {issuer}
                    </div>
                </div>
                <div className="p-grid p-fluid">
                    <div className="p-field p-col-12 p-md-5 p-text-bold">
                        Дата рождения
                    </div>
                    <div className="p-field p-col-12 p-md-7">
                        {birthday && birthday.toLocaleDateString()}
                    </div>
                </div>
                <div className="p-grid p-fluid">
                    <div className="p-field p-col-12 p-md-5 p-text-bold">
                        Место рождения
                    </div>
                    <div className="p-field p-col-12 p-md-7">
                        {placeOfBirth}
                    </div>
                </div>
            </div>
        </Card>)
}

const PassData = ({register, setValue, watch, onBlur}) => {
    const issueDate = register('issueDate')
    const birthday = register('birthday')
    const passNumber = register('passNumber')
    const issueDateValue = watch('issueDate')
    const birthdayValue = watch('birthDay')
    const issuerCode = register('issuerCode')
    const issuer = register('issuer')
    const placeOfBirth = register('placeOfBirth')
    return (<Card title="Паспортные данные">
        <div className="p-fluid">
            <div className="p-grid p-fluid">
                <div className="p-field p-col-12 p-md-5">
                    <label htmlFor="passNumber">Серия и номер</label>
                    <InputText id="passNumber" {...passNumber} onBlur={(e) => {
                        passNumber.onBlur(e)
                        onBlur()
                    }}/>
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <label htmlFor="issueDate">Дата выдачи</label>
                    <Calendar id="issueDate" value={issueDateValue} onChange={(e) => setValue('issueDate', e.value)}
                              onBlur={(e) => {
                                  onBlur()
                                  issueDate.onBlur(e)
                              }}/>
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="issuerCode">Код</label>
                    <InputText id="issuerCode" {...issuerCode} onBlur={(e) => {
                        issuerCode.onBlur(e)
                        onBlur()
                    }}/>
                </div>
            </div>
            <div className="p-field">
                <label htmlFor="issuer">Кем выдан</label>
                <InputText id="issuer" {...issuer} onBlur={(e) => {
                    issuer.onBlur(e)
                    onBlur()
                }}/>
            </div>
            <div className="p-field">
                <label htmlFor="birthday">Дата рождения</label>
                <Calendar id="birthday" value={birthdayValue} onChange={(e) => setValue('birthday', e.value)}
                          onBlur={(e) => {
                              onBlur()
                              birthday.onBlur(e)
                          }}/>
            </div>
            <div className="p-field">
                <label htmlFor="placeOfBirth">Место рождения</label>
                <InputText id="placeOfBirth" {...placeOfBirth} onBlur={(e) => {
                    placeOfBirth.onBlur(e)
                    onBlur()
                }}/>
            </div>
        </div>
    </Card>)
}

const AddressData = ({register, setValue, watch, onBlur}) => {
    const [addressReg, setAddressReg] = useState()
    const [addressFact, setAddressFact] = useState()
    const factAddressEqualValue = watch('factAddressEqual')
    const setAddressRegHandler = (value) => {
        setValue('addressReg', value.unrestricted_value)
        setAddressReg(value)
        onBlur()
    }
    const setAddressFactHandler = (value) => {
        setValue('addressFact', value.unrestricted_value)
        setAddressFact(value)
        onBlur()
    }
    return (
        <Card title="Адрес регистрации">
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="addressReg">Адрес регистрации</label>
                    <AddressSuggestions
                        token={API_KEY}
                        value={addressReg}
                        delay={500}
                        onChange={setAddressRegHandler}
                        inputProps={{
                            id: "addressReg",
                            className: 'p-inputtext p-component'
                        }}/>
                </div>
                <div className="p-field">
                    <label>Совпадает с фактическим</label>
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="snc1" name="factAddressEqual" value="yes" onChange={(e) => {
                            setValue('factAddressEqual', e.value)
                            onBlur()
                        }} checked={factAddressEqualValue === 'yes'}/>
                        <label htmlFor="snc2">Да</label>
                    </div>
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="snc2" name="factAddressEqual" value="no"
                                     onChange={(e) => {
                                         setValue('factAddressEqual', e.value)
                                         onBlur()
                                     }}
                                     checked={factAddressEqualValue === 'no'}/>
                        <label htmlFor="snc2">Нет</label>
                    </div>
                </div>
                {factAddressEqualValue === 'no' && (
                    <div className="p-field">
                        <label htmlFor="addressFact">Фактический адрес</label>
                        <AddressSuggestions
                            token={API_KEY}
                            value={addressFact}
                            delay={500}
                            onChange={setAddressFactHandler}
                            inputProps={{
                                id: "addressFact",
                                className: 'p-inputtext p-component'
                            }}/>
                    </div>
                )}
            </div>
        </Card>)
}

const Progress = ({progresses}) => {
    const segments = progresses.length
    const pbValue = sum(progresses) / segments
    return (
        <div className="card">
            <div style={{
                position: 'relative',
                height: '50px',
                paddingTop: '10px',
                paddingLeft: '5px',
                paddingRight: '5px'
            }}>
                <ProgressBar value={pbValue} displayValueTemplate={() => null} style={{height: '6px'}}/>
                <Badge value="Старт" style={{position: 'absolute', left: 0, top: 0,}}/>
                {progresses.map((item, index) =>
                    <Badge
                        key={index}
                        value={index + 1}
                        style={{
                            position: 'absolute',
                            left: `calc(${(index + 1) * 100 / segments}% - ${(index + 1) === segments ? '20' : '5'}px)`,
                            top: 0,
                            backgroundColor: item < 100 ? 'gray' : undefined
                        }}/>)}
            </div>

        </div>
    )
}

const MainInfoStaticAnimated = withAnimation(MainInfoStatic)
const AddressDataStaticAnimated = withAnimation(AddressDataStatic)
const PassDataStaticAnimated = withAnimation(PassDataStatic)

import React, {useState} from "react"
import "./RegisterPage.css"
import {Link, useNavigate} from "react-router-dom";
import api from "../../components/api";


const RegisterPage = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [fullname, setFullname] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordRepeatError, setPasswordRepeatError] = useState('')
    const [serverError, setServerError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const validatePasswordMatch = () => {
        if (password !== passwordRepeat) {
            setPasswordRepeatError('Пароли не совпадают')
        }
        else setPasswordRepeatError('')
    }

    const submit = async (e) => {
        e.preventDefault()
        const isFormValid = await validateForm()
        if (!isFormValid)
            return

        setIsLoading(true)
        api.post('/register', {username, password, fullname})
            .then(response => {
                setIsLoading(false)
                if (response.status === 201) {
                    navigate('/login', {
                        state: { successMessage: 'Регистрация прошла успешно!' }
                    })
                }
            })
            .catch((error) => {
                if (error.response.status === 409) {
                    setUsernameError('Пользователь с таким логином уже существует')
                }
                else {
                    setServerError('Возникла ошибка, повторите попытку позже')
                }
                setIsLoading(false)
            })
    }

    const validateForm = async () => {
        if (passwordRepeat !== password)
            return false

        return true
    }

    return (
        <div className="fullscreen-form-container">
            <div className="form-wrapper">
                <div className="form-wrapper__head"></div>
                <div className="form-wrapper__body">
                    <form className="register-form" onSubmit={submit}>
                        <div className="form-group">
                            <label>Логин</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Введите логин"
                                name='username'
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                onBlur={() => setUsernameError('')}
                            />
                            {usernameError && (
                                <div className="input-error">
                                    {usernameError}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Пароль</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Введите пароль"
                                name='password'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onBlur={() => validatePasswordMatch()}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Повтор пароля</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Повторите пароль"
                                name='password-repeat'
                                value={passwordRepeat}
                                onChange={e => setPasswordRepeat(e.target.value)}
                                onBlur={() => validatePasswordMatch()}
                                required
                            />
                            {passwordRepeatError && (
                                <div className="input-error">
                                    {passwordRepeatError}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>ФИО</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Введите ФИО"
                                name='fullname'
                                value={fullname}
                                onChange={e => setFullname(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            {isLoading ? (
                                <div className="spinner"></div>
                            ) : (
                                <button className="btn btn-primary">Войти</button>
                            )}
                            <hr/>
                            {serverError && (
                                <div className="input-error">
                                    {serverError}
                                </div>
                            )}
                            <p>Уже зарегистрированы? <Link to='/login'>Войти</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
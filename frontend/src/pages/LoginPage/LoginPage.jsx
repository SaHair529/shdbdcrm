import React, {useState} from "react"
import './../RegisterPage/RegisterPage.css'
import {Link, useLocation, useNavigate} from "react-router-dom"
import api from "../../components/api"
import { UserSessionContext } from "../../contexts/UserSessionContext"


const LoginPage = () => {
    const { userSessionData, setUserSessionData } = React.useContext(UserSessionContext)
    const location = useLocation()
    const successMessage = location.state?.successMessage
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const submit = (e) => {
        e.preventDefault()

        setIsLoading(true)
        setLoginError('')
        api.post('/login', {username, password})
            .then((response) => {
                setIsLoading(false)
                if (response.status === 200){
                    setUserSessionData(response.data)
                    localStorage.setItem('userSessionData', JSON.stringify(response.data))
                }
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    setLoginError('Неверный логин или пароль')
                } 
                else {
                    setLoginError('Возникла ошибка, повторите попытку позже')
                }
                setIsLoading(false)
            })
    }

    React.useEffect(() => {
        if (userSessionData) {
            navigate('/')
        }
    })

    return (
        <div className="fullscreen-form-container">
            <div className="form-wrapper">
                <div className="form-wrapper__head"></div>
                <div className="form-wrapper__body">
                    <form onSubmit={submit} className="register-form">
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
                            />
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
                            {loginError && <div className="input-error">{loginError}</div>}
                            {successMessage && <div className="input-success">{successMessage}</div>}
                            <p><Link to="/register">Регистрация</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
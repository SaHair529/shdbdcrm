import React from "react"
import './../RegisterPage/RegisterPage.css'
import {Link} from "react-router-dom";


const LoginPage = () => {
    return (
        <div className="fullscreen-form-container">
            <div className="form-wrapper">
                <div className="form-wrapper__head"></div>
                <div className="form-wrapper__body">
                    <form className="register-form">
                        <div className="form-group">
                            <label>Логин</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Введите логин"
                                name='username'
                                // value={newLead.title}
                                // onChange={handleCreateLeadInputChange}
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
                                // value={newLead.title}
                                // onChange={handleCreateLeadInputChange}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-primary">Войти</button>
                            <hr/>
                            <p><Link to="/register">Регистрация</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
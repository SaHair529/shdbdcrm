import React, {useState} from "react"
import './NewStatusForm.css'
import api from "../../api";
import { UserSessionContext } from "../../../contexts/UserSessionContext"

const NewStatusForm = ({index, fetchStatusesAndLeads, setNewStatusIndex}) => {
    const [name, setName] = useState('')
    const [color, setColor] = useState('')
    const { userSessionData, setUserSessionData } = React.useContext(UserSessionContext)

    const submitNewStatus = (e) => {
        e.preventDefault()
        api.post('/status/', {
            name: name,
            color: color || 'black',
            index: index
        }, {
            headers: {
                'Authorization': `Bearer ${userSessionData.accessToken}`
            }
        })
            .then(response => {
                if (response.status === 201) {
                    setNewStatusIndex(null)
                    console.log('Статус успешно добавлен')
                    fetchStatusesAndLeads()
                }
            })
            .catch(error => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('userSessionData')
                    setUserSessionData(null)
                }
                alert('Ошибка. Обратитесь к разработчику')
                console.error(error)
            })
    }

    const onCancel = (e) => {
        e.preventDefault()
        setNewStatusIndex(null)
    }

    return (
        <div className="new-status-form" key='newStatusForm'>
            <form onSubmit={submitNewStatus}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Введите название"
                    name='name'
                    value={name}
                    required
                    onChange={e => setName(e.target.value)}
                />

                <hr/>

                <div className="form-group">
                    <label>Выберите цвет статуса</label>
                    <input
                        className="form-control"
                        id='new-status-color'
                        type="color"
                        name='color'
                        value={color}
                        required
                        onChange={e => setColor(e.target.value)}
                    />
                </div>

                <hr/>

                <div className="form-actions">
                    <button className="btn btn-outline-primary">Сохранить</button>
                    <button className="btn btn-cancel" onClick={onCancel}>Отмена</button>
                </div>
            </form>
        </div>
    )
}

export default NewStatusForm
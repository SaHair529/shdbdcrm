import React, {useState} from "react"
import './NewStatusForm.css'
import api from "../../api";

const NewStatusForm = ({index, fetchStatusesAndLeads, setNewStatusIndex}) => {
    const [name, setName] = useState('')
    const [color, setColor] = useState('')

    const submitNewStatus = (e) => {
        e.preventDefault()
        api.post('/status/', {
            name: name,
            color: color || 'black',
            index: index
        })
            .then(response => {
                if (response.status === 201) {
                    fetchStatusesAndLeads()
                }
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
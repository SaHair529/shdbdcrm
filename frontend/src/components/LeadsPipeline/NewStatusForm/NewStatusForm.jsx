import React from "react"
import './NewStatusForm.css'

const NewStatusForm = () => {
    return (
        <div className="new-status-form">
            <form>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Введите название"
                    name='name'
                    required
                />

                <hr/>

                <div className="form-group">
                    <label>Выберите цвет статуса</label>
                    <input
                        className="form-control"
                        id='new-status-color'
                        type="color"
                        name='color'
                        required
                    />
                </div>

                <hr/>

                <div className="form-actions">
                    <button className="btn btn-outline-primary">Сохранить</button>
                    <button className="btn btn-cancel">Отмена</button>
                </div>
            </form>
        </div>
    )
}

export default NewStatusForm
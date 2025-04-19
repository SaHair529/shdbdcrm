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
            </form>
        </div>
    )
}

export default NewStatusForm
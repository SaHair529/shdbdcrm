import React, {useEffect, useRef, useState} from 'react'
import './LeadsPipelinePage.css'
import useClickOutside from "../../components/useClickOutside"
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import api from "../../components/api";

const LeadsPipelinePage = () => {
    const [statuses, setStatuses] = useState([]);
    const [leads, setLeads] = useState({});
    const [activeLeadId, setActiveLeadId] = useState(null);
    const leadcardMenuRef = useRef(null);
    const [openNewLeadForm, setOpenNewLeadForm] = useState(false);
    const [newLead, setNewLead] = useState({
        title: "",
        fullname: "",
        phone: "",
        email: "",
        status_id: "",
        description: "",
    })

    useClickOutside(leadcardMenuRef, () => setActiveLeadId(null));

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        // Если элемент был перемещен в ту же колонку и на то же место
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceStatusId = source.droppableId;
        const destinationStatusId = destination.droppableId;
        const lead = leads[sourceStatusId][source.index];

        // Создаем копии массивов
        const newLeads = { ...leads };

        // Удаляем элемент из исходной колонки
        newLeads[sourceStatusId].splice(source.index, 1);

        // Добавляем элемент в целевую колонку
        newLeads[destinationStatusId].splice(destination.index, 0, lead);

        // Обновляем состояние
        setLeads(newLeads);

        api.patch(`/lead/${lead.id}`, {
            status_id: destinationStatusId,
        })
    };

    useEffect(() => {
        fetchStatusesAndLeads()
    }, [])

    const fetchStatusesAndLeads = async () => {
        try {
            let response = await api.get('/status/')
            response.data.map((status) => {
                status['id'] = status['id'].toString()
            })
            setStatuses(response.data)

            const leadsObject = {}
            response.data.map((status) => {
                leadsObject[status['id']] = []
            })

            response = await api.get('/lead/')
            response.data.map((lead) => {
                if (!leadsObject[lead.status.id]) {
                    leadsObject[lead.status.id] = []
                }
                lead.id = lead.id.toString()
                leadsObject[lead.status.id].push(lead)
            })
            setLeads(leadsObject)
        }
        catch(error) {
            alert('Ошибка загрузки страницы. Обратитесь к разработчику')
            console.error(error)
        }
    }

    const submitCreateLead = async (e) => {
        e.preventDefault()
        api.post('/lead/', newLead)
            .then((response) => {
                if (response.status === 201) {
                    fetchStatusesAndLeads()
                }
            })

        setNewLead({
            title: "",
            fullname: "",
            phone: "",
            email: "",
            status_id: "",
            description: "",
        })
        setOpenNewLeadForm(false)
    }

    const cancelCreateLead = async (e) => {
        setNewLead({
            title: "",
            fullname: "",
            phone: "",
            email: "",
            status_id: "",
            description: "",
        })
        setOpenNewLeadForm(false)
    }

    const handleCreateLeadInputChange = (e) => {
        const { name, value } = e.target;
        setNewLead((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="container-fluid">
                <div className="pipeline">
                    {statuses.map((status, index) => (
                        <div className="status" key={status.id}>
                            <div className="status__title" style={{borderColor: status.color}}>
                                {status.name}
                            </div>
                            {/* Перенос Droppable на status__body */}
                            <Droppable droppableId={status.id}>
                                {(provided, snapshot) => (
                                    <div
                                        className={`status__body ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {index === 0 && (
                                            <div className='add-lead-button' onClick={() => setOpenNewLeadForm(true)}>
                                                Новый лид
                                            </div>
                                        )}
                                        {leads[status.id] && leads[status.id].map((lead, leadIndex) => (
                                            <Draggable draggableId={lead.id} index={leadIndex} key={lead.id}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        className={`lead-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => setActiveLeadId(activeLeadId === lead.id ? null : lead.id)}
                                                    >
                                                        <a href="#">{lead.title}</a>
                                                        {activeLeadId === lead.id && (
                                                            <div className="leadcard-menu" ref={leadcardMenuRef}>
                                                                <div className="leadcard-menu-btn btn-success">Реализовано</div>
                                                                <div className="leadcard-menu-btn btn-fail">Не реализовано</div>
                                                                <div className="leadcard-menu-btn btn-update">Обновить</div>
                                                                <div className="leadcard-menu-btn btn-delete">Удалить</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {/* Индикатор места вставки */}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </div>
            {openNewLeadForm && (
                <div className="create-lead-panel">
                    <div className="create-lead-header">
                        <h3>Создание нового лида</h3>
                        <div className="close-icon" onClick={cancelCreateLead}>×</div>
                    </div>
                    <form onSubmit={submitCreateLead}>
                        <div className="create-lead-body">
                            <div className="form-group">
                                <label>Название лида</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Введите название"
                                    name='title'
                                    value={newLead.title}
                                    onChange={handleCreateLeadInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>ФИО</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Введите ФИО"
                                    name='fullname'
                                    value={newLead.fullname}
                                    onChange={handleCreateLeadInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Телефон</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Введите телефон"
                                    name='phone'
                                    value={newLead.phone}
                                    onChange={handleCreateLeadInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Введите email"
                                    name='email'
                                    value={newLead.email}
                                    onChange={handleCreateLeadInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Статус</label>
                                <select className="form-control" name='status_id' value={newLead.status_id} onChange={handleCreateLeadInputChange} required>
                                    <option value='' disabled>Выберите статус</option>
                                    {statuses.map(status => (
                                        <option key={status.id} value={status.id}>{status.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Описание</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Добавьте описание"
                                    name='description'
                                    value={newLead.description}
                                    onChange={handleCreateLeadInputChange}
                                ></textarea>
                            </div>

                            <div className="form-actions">
                                <button className="btn btn-primary">Создать</button>
                                <button className="btn btn-cancel" onClick={cancelCreateLead}>Отмена</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </DragDropContext>
    );
};

export default LeadsPipelinePage;

import React, { useRef, useState } from 'react'
import './LeadsPipelinePage.css'
import useClickOutside from "../../components/useClickOutside"
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const LeadsPipelinePage = () => {
    const [statuses, setStatuses] = useState([
        { name: 'Первичный контакт', color: '#339dc8', id: '1' },
        { name: 'Переговоры', color: 'yellow', id: '2' },
        { name: 'В работе', color: 'orange', id: '3' },
    ]);
    const [leads, setLeads] = useState({
        1: [
            { name: 'Лид №12345', id: '1' },
            { name: 'Лид №12346', id: '2' },
        ],
        2: [
            { name: 'Лид №12347', id: '3' },
            { name: 'Лид №12348', id: '4' },
            { name: 'Лид №12349', id: '5' },
        ],
        3: []
    });
    const [activeLeadId, setActiveLeadId] = useState(null);
    const leadcardMenuRef = useRef(null);
    const [newLead, setNewLead] = useState(null)

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
                                            <div className='add-lead-button' onClick={() => setNewLead({})}>
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
                                                        <a href="#">{lead.name}</a>
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
            {newLead && (
                <div className="create-lead-panel">
                    <div className="create-lead-header">
                        <h3>Создание нового лида</h3>
                        <div className="close-icon" onClick={() => setNewLead(null)}>×</div>
                    </div>

                    <div className="create-lead-body">
                        <div className="form-group">
                            <label>Название лида</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Введите название"
                                name='title'
                            />
                        </div>

                        <div className="form-group">
                            <label>ФИО</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Введите ФИО"
                                name='fullname'
                            />
                        </div>

                        <div className="form-group">
                            <label>Телефон</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Введите телефон"
                                name='phone'
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Введите email"
                                name='email'
                            />
                        </div>

                        <div className="form-group">
                            <label>Статус</label>
                            <select className="form-control" name='status'>
                                <option>Первичный контакт</option>
                                <option>Переговоры</option>
                                <option>В работе</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Описание</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Добавьте описание"
                                name='description'
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-primary">Создать</button>
                            <button className="btn btn-cancel">Отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </DragDropContext>
    );
};

export default LeadsPipelinePage;

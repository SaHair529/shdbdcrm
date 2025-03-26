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
                            <div className="status__title" style={{ borderColor: status.color }}>
                                {status.name}
                            </div>
                            <Droppable droppableId={status.id}>
                                {(provided, snapshot) => (
                                    <div
                                        className={`status__body ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {index === 0 && (
                                            <div className='add-lead-button'>
                                                Новый лид
                                            </div>
                                        )}
                                        {leads[status.id] && leads[status.id].map((lead, leadIndex) => (
                                            <Draggable draggableId={lead.id} index={leadIndex} key={lead.id}>
                                                {(provided) => (
                                                    <div
                                                        className="lead-card"
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
        </DragDropContext>
    );
};

export default LeadsPipelinePage;

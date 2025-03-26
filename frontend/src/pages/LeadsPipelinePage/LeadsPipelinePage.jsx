import React, {useRef, useState} from 'react';
import './LeadsPipelinePage.css'
import useClickOutside from "../../components/useClickOutside";

const LeadsPipelinePage = () => {
    const [statuses, setStatuses] = useState([
        { name: 'Первичный контакт', color: '#339dc8', id: 1},
        { name: 'Переговоры', color: 'yellow', id: 2 },
        { name: 'В работе', color: 'orange', id: 3 },
    ])
    const [leads, setLeads] = useState({
        1: [
            { name: 'Лид №12345', id: 1 },
            { name: 'Лид №12346', id: 2 },
        ],
        2: [
            { name: 'Лид №12347', id: 3 },
            { name: 'Лид №12348', id: 4 },
            { name: 'Лид №12349', id: 5 },
        ],
    })
    const [activeLeadId, setActiveLeadId] = useState(null)
    const leadcardMenuRef = useRef(null)

    useClickOutside(leadcardMenuRef, () => setActiveLeadId(null))

    return (
        <div className="container-fluid">
            <div className="pipeline">
                {statuses.map((status, index) => (
                    <div className="status" key={status.id}>
                        <div className="status__title" style={{borderColor: status.color}}>
                            {status.name}
                        </div>
                        {index === 0 && (
                            <div className='add-lead-button'>
                                Новый лид
                            </div>
                        )}
                        {leads[status.id] && leads[status.id].map((lead) => (
                            <div className="lead-card" key={lead.id} onClick={() => setActiveLeadId(activeLeadId === lead.id ? null : lead.id)}>
                                <a href="#">{lead.name}</a>
                                {activeLeadId === lead.id && (
                                    <div className="leadcard-menu" ref={leadcardMenuRef}>
                                        <div className="leadcard-menu-btn btn-success">Реализовано</div>
                                        <div className="leadcard-menu-btn btn-fail">Не реализовано</div>
                                        <div className="leadcard-menu-btn btn-delete">Удалить</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
};

export default LeadsPipelinePage;

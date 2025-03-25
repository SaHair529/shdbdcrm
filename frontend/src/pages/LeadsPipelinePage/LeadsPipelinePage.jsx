import React, {useState} from 'react';
import './LeadsPipelinePage.css'

const LeadsPipelinePage = () => {
    const [statuses, setStatuses] = useState([
        { name: 'Первичный контакт', color: '#339dc8', id: 1},
        { name: 'Переговоры', color: 'yellow', id: 2 },
    ])
    const [leads, setLeads] = useState({
        1: [
            { name: 'Лид №12345' },
            { name: 'Лид №12346' },
        ],
        2: [
            { name: 'Лид №12347' },
            { name: 'Лид №12348' },
            { name: 'Лид №12349' },
        ],
    })
    return (
        <div className="container-fluid">
            <div className="pipeline">
                {statuses.map((status) => (
                    <div className="status">
                        <div className="status__title" style={{borderColor: status.color}}>
                            {status.name}
                        </div>
                        {leads[status.id].map((lead) => (
                            <div className="lead-card">
                                <a href="#">{lead.name}</a>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
};

export default LeadsPipelinePage;

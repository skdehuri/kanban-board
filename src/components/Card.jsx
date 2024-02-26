import React from 'react'
import { BoardContext, PRIORITY_PARAMETERS, STATUS_PARAMETERS } from '../App'
import { useContext } from 'react'

function Card({ item, userParameters }) {

    const { filters } = useContext(BoardContext)

    return (
        <div className='card'>
            <div className='card-section-wrapper'>
                <div className='card-section-1'>
                    <div>{item.id}</div>
                </div>
                <div className='card-section-2'>
                    {
                        filters.groupBy != 'status' ? <div>
                            <img className='card-title-icon' src={STATUS_PARAMETERS[item.status].icon} alt="" />
                            <div></div>
                        </div> : null
                    }

                    <div className='card-title'>{item.title}</div>
                </div>
                <div className='card-section-3'>
                    {
                        filters.groupBy != 'priority' ?
                            <div className='card-priority-icon'>
                                <img src={PRIORITY_PARAMETERS[item.priority].icon} alt="" />
                            </div> : null
                    }
                    {item.tag.map(tagValues => (
                        <div className='card-tag-icon' key={tagValues}>
                            <div className='card-tag-dot'></div>
                            <div>{tagValues}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                {
                    filters.groupBy != 'userId' ?
                        <div className='user-image-wrapper'>
                            <img className={userParameters[item.userId].iconClass} src={userParameters[item.userId].icon} alt="" />
                            <div className={`user-availability ${userParameters[item.userId].available ? 'available' : 'offline'}`}></div>
                        </div> : null
                }

            </div>
        </div>
    )
}

export default Card
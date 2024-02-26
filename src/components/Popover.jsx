import { useEffect, useState, useRef } from 'react'

import Slider from '../assets/slider.svg'
import ChevronDown from '../assets/chevron-down.svg'
import { useContext } from 'react';
import { BoardContext } from '../App';


function Popover() {

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, [])

    const { filters, setFilters } = useContext(BoardContext)

    const popoverRef = useRef()

    const toggleDisplay = (event) => {
        const popoverClassList = popoverRef.current.classList
        if (popoverClassList.contains('d-none'))
            popoverClassList.remove('d-none')
        else
            popoverClassList.add('d-none')

        event.stopPropagation();
    }

    const handleClickOutside = (event) => {

        if (popoverRef.current && !popoverRef.current.contains(event.target)) {
            popoverRef.current.classList.add('d-none')
        }
    }

    const setGroupByFilters = (event) => {
        const modifiedFilters = { ...filters, groupBy: event.target.value }
        setFilters(modifiedFilters)

        localStorage.setItem('filters', JSON.stringify(modifiedFilters))
    }

    const setOrderByFilters = (event) => {
        const modifiedFilters = { ...filters, orderBy: event.target.value }
        setFilters(modifiedFilters)

        localStorage.setItem('filters', JSON.stringify(modifiedFilters))
    }

    return (
        <>
            <button onClick={toggleDisplay}>
                <img src={Slider} alt="" />
                <span>Display</span>
                <img src={ChevronDown} alt="" />
            </button>
            <div ref={popoverRef} className='popover d-none'>
                <div className='d-flex j-content-sb a-items-center'>
                    <div className='color-grey'>Grouping</div>
                    <div>
                        <select
                            name="Grouping"
                            value={filters.groupBy}
                            onChange={e => setGroupByFilters(e)}>
                            <option value="status">Status</option>
                            <option value="userId">User</option>
                            <option value="priority">Priority</option>
                        </select>
                    </div>
                </div>
                <div className='d-flex j-content-sb a-items-center'>
                    <div className='color-grey'>Ordering</div>
                    <div>
                        <select
                            name="Ordering"
                            value={filters.orderBy}
                            onChange={e => setOrderByFilters(e)}>
                            <option value="priority">Priority</option>
                            <option value="title">Title</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Popover
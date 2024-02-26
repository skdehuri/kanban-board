import { useEffect, useState, createContext } from 'react'
import './App.css'
import MockData from './MockData'
import Popover from './components/Popover'
import Plus from './assets/plus.svg'
import ThreeDots from './assets/three-dots.svg'
import Reception1 from './assets/reception-1.svg'
import Reception2 from './assets/reception-2.svg'
import Reception3 from './assets/reception-3.svg'
import Reception4 from './assets/reception-4.svg'
import Exclamation from './assets/exclamation-square.svg'
import XCircle from './assets/x-circle.svg'
import CheckCircle from './assets/check-circle.svg'
import HalfCircle from './assets/circle-half.svg'
import Circle from './assets/circle.svg'
import FilterCircle from './assets/filter-circle.svg'
import Card from './components/Card'


export const BoardContext = createContext()

export const STATUS_PARAMETERS = {
    'Backlog': { name: 'Backlog', icon: FilterCircle },
    'Todo': { name: 'Todo', icon: Circle },
    'In progress': { name: 'In progress', icon: HalfCircle },
    'Done': { name: 'Done', icon: CheckCircle },
    'Canceled': { name: 'Canceled', icon: XCircle }
}

export const PRIORITY_PARAMETERS = {
    0: { name: 'Urgent', icon: Exclamation },
    1: { name: 'High', icon: Reception4 },
    2: { name: 'Medium', icon: Reception3 },
    3: { name: 'Low', icon: Reception2 },
    4: { name: 'No Priority', icon: Reception1 }
}

function App() {

    const [responseData, setResponseData] = useState(null)
    const [filteredData, setFilteredData] = useState({})
    const [filters, setFilters] = useState({ groupBy: 'status', orderBy: 'priority' })
    const [filteredHeaders, setFilteredHeaders] = useState([])
    const [userParameters, setUserParameters] = useState([])
    const [responseErrorStatus, setResponseErrorStatus] = useState(false)
    const [responseLoadingStatus, setResponseLoadingStatus] = useState(true)

    useEffect(() => {

        fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
            .then(response => response.json())
            .then(data => {
                setResponseData(data)
                setResponseErrorStatus(false)
                setResponseLoadingStatus(false)
            })
            .catch(error => {
                setResponseErrorStatus(true)
                setResponseLoadingStatus(false)
            })

        setResponseData(MockData)
        applyFiltersAndSetResults(MockData)

        const localfilters = JSON.parse(localStorage.getItem('filters'));
        if (localfilters) {
            setFilters(localfilters);
        }
    }, [])

    useEffect(() => {
        applyFiltersAndSetResults(MockData)
    }, [filters])


    // Appling the filters here and building heading and board data
    const applyFiltersAndSetResults = (response) => {
        const { tickets = [] } = response
        const { groupBy, orderBy } = filters

        const results = tickets
            .sort(function (a, b) {
                if (orderBy === 'priority') {
                    if (!a.priority) return 1
                    if (!b.priority) return -1

                    return a.priority > b.priority ? 1 : a.priority < b.priority ? -1 : 0
                } else {
                    return a.title.localeCompare(b.title.localeCompare)
                }
            })
            .reduce(function (accumulator, currentItem) {
                accumulator[currentItem[groupBy]] = accumulator[currentItem[groupBy]] || []
                accumulator[currentItem[groupBy]].push(currentItem)

                return accumulator
            }, {})

        setFilteredData(results)

        prepareColumnHeaders(response)
    }


    const prepareColumnHeaders = (response) => {
        const { groupBy } = filters

        let columns = []

        const { users = [] } = response

        const userMappings = users.map(user => ({
            ...user,
            key: user.id,
            icon: `https://ui-avatars.com/api/?name=${user.name}&color=fff&background=${getImageBackgroundColor()}`,
            iconClass: 'avatar'
        }))

        const userKeys = userMappings.reduce(function (accumulator, item) {
            accumulator[item.key] = item
            return accumulator
        }, {})


        setUserParameters(userKeys)

        if (groupBy === 'status') {
            columns = Object.keys(STATUS_PARAMETERS).map(item => ({ name: STATUS_PARAMETERS[item]['name'], icon: STATUS_PARAMETERS[item]['icon'], key: STATUS_PARAMETERS[item]['name'] }))
        } else if (groupBy === 'priority') {
            columns = Object.keys(PRIORITY_PARAMETERS).map(item => ({ name: PRIORITY_PARAMETERS[item]['name'], icon: PRIORITY_PARAMETERS[item]['icon'], key: item }))
        } else if (groupBy === 'userId') {
            columns = userMappings
        }

        setFilteredHeaders(columns)
    }

    const getImageBackgroundColor = () => {
        const imageBackgroundColors = ['E91E63', '0D8ABC', '0D8ABC', '0D8ABC', '0D8ABC']

        const randomNumber = Math.floor(Math.random() * imageBackgroundColors.length)

        return imageBackgroundColors[randomNumber]
    }

    const renderBoard = () => {
        if (responseLoadingStatus) {
            return (
                <div className='d-flex'>
                    <span>
                        Loading
                    </span>
                </div>
            )
        }

        if (responseErrorStatus) {
            return (
                <div className='d-flex'>
                    <span>
                        Something went wrong while getting data
                    </span>
                </div>
            )
        }

        return (
            <>
                {
                    filteredHeaders.map(item => (
                        <div className='board-columns' key={'boardColumns_' + item.name}>
                            <div className='card-heading'>
                                <div className='card-heading-items'>
                                    <div className='d-flex'>
                                        {
                                            filters.groupBy === 'userId' ?
                                                <div className='user-image-wrapper'>
                                                    <img className={userParameters[item.id].iconClass} src={userParameters[item.id].icon} alt="" />
                                                    <div className={`user-availability ${userParameters[item.id].available ? 'available' : 'offline'}`}></div>
                                                </div> : <img className={item.iconClass} src={item.icon} alt="" />
                                        }

                                    </div>
                                    <div>{item.name}</div>
                                    <div className='color-grey'>{(filteredData[item.key] || []).length}</div>
                                </div>
                                <div className='card-heading-items'>
                                    <div><img className='action-1' src={Plus} alt="" /></div>
                                    <div><img className='action-2' src={ThreeDots} alt="" /></div>
                                </div>
                            </div>
                            <div className='card-container'>{(filteredData[item.key] || []).map(item => (
                                <Card key={item.id} item={item} userParameters={userParameters} />
                            ))}</div>
                        </div>
                    ))
                }
            </>
        )
    }

    return (
        <BoardContext.Provider value={{ filters, setFilters }}>
            <div className='navbar'>
                <div className='p-relative'>
                    <Popover />
                </div>
            </div>
            <div className='board-container'>
                {renderBoard()}
            </div>
        </BoardContext.Provider>
    )
}

export default App

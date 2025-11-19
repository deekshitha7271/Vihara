import React, { useState, useEffect } from 'react'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const CalenderComponent = () => {
  const [showCalender, setShowCalender]=useState(false)
  const [date,setDate]=useState([
    {
    startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }

  ])

  const [selectedDates, setSelectedDates]=useState(null)

  //   useEffect(() => {

  //         const timer = setTimeout(() => setMounted(true), 0)
  //         return () => clearTimeout(timer)

  // }, [])




  const handleSelectDates = async ()=>{
    const startDate = date[0].startDate.toLocaleDateString();
    const endDate = date[0].endDate.toLocaleDateString();

    setSelectedDates(`selectedDates: ${startDate} - ${endDate}`)
    setShowCalender(false)
    const bookingDates={startDate, endDate}
    console.log("selectedDates from calender:",bookingDates)
  }
    const currentDate = new Date().toDateString();
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate()+1)

  const formattedDate=nextDate.toDateString()

  return (
    <div className='calenderSection'>

      <div className="currentDate" onClick={()=>setShowCalender(!showCalender)}>
        {!selectedDates && (<>{`${currentDate} - ${formattedDate}`}</>)}
        { selectedDates && (<div className='' style={{color:'red'}}>{selectedDates}</div>)}
      </div>
      {showCalender && <DateRange
      editableDateInputs={true}
      onChange={item => setDate([item.selection])}
      moveRangeOnFirstSelection={false}
      ranges={date} className='dateRange'
    />}

    <button onClick={handleSelectDates} className='calenderButton'>Select Dates</button>
      
    </div>
  )
}

export default CalenderComponent

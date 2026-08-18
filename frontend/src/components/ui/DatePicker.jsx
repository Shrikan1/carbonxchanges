import React, { useState, useRef, useEffect } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, 
  addYears, subYears 
} from 'date-fns';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export function DatePicker({ value, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const [view, setView] = useState('days'); // 'days', 'months', 'years'
  const popoverRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
        setTimeout(() => setView('days'), 200); // reset view after closing
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (day) => {
    onChange(format(day, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Render Days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const renderDays = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><FiChevronLeft /></button>
        <button type="button" onClick={() => setView('months')} className="font-semibold text-gray-900 hover:bg-gray-100 px-3 py-1 rounded-lg transition-colors">
          {format(currentMonth, 'MMMM yyyy')}
        </button>
        <button type="button" onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><FiChevronRight /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-xs font-medium text-gray-500">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isSelected = value && isSameDay(day, new Date(value));
          const isCurrentMonth = isSameMonth(day, monthStart);
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleDateClick(day)}
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                isSelected ? 'bg-gray-900 text-white font-bold shadow-sm' : 
                isCurrentMonth ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-300 hover:text-gray-500 hover:bg-gray-50'
              }`}
            >
              {format(day, dateFormat)}
            </button>
          );
        })}
      </div>
    </>
  );

  const renderMonths = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={() => setCurrentMonth(subYears(currentMonth, 1))} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><FiChevronLeft /></button>
        <button type="button" onClick={() => setView('years')} className="font-semibold text-gray-900 hover:bg-gray-100 px-3 py-1 rounded-lg transition-colors">
          {format(currentMonth, 'yyyy')}
        </button>
        <button type="button" onClick={() => setCurrentMonth(addYears(currentMonth, 1))} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><FiChevronRight /></button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }).map((_, i) => {
          const month = new Date(currentMonth.getFullYear(), i, 1);
          const isSelected = isSameMonth(month, currentMonth);
          return (
            <button
              key={i}
              type="button"
              onClick={() => { setCurrentMonth(month); setView('days'); }}
              className={`p-2 rounded-xl text-sm font-medium transition-colors ${
                isSelected ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {format(month, 'MMM')}
            </button>
          );
        })}
      </div>
    </>
  );
  
  const renderYears = () => {
    const currentYear = currentMonth.getFullYear();
    const startYear = currentYear - 5; // Show 12 years around current
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={() => setCurrentMonth(subYears(currentMonth, 12))} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><FiChevronLeft /></button>
          <div className="font-semibold text-gray-900 px-3 py-1">Select Year</div>
          <button type="button" onClick={() => setCurrentMonth(addYears(currentMonth, 12))} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><FiChevronRight /></button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 12 }).map((_, i) => {
            const year = startYear + i;
            const isSelected = year === currentYear;
            return (
              <button
                key={i}
                type="button"
                onClick={() => { setCurrentMonth(new Date(year, currentMonth.getMonth(), 1)); setView('months'); }}
                className={`p-2 rounded-xl text-sm font-medium transition-colors ${
                  isSelected ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {year}
              </button>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="relative" ref={popoverRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full border rounded-xl px-4 h-[42px] cursor-pointer transition-all duration-200 bg-white ${
          isOpen ? 'border-gray-900 ring-2 ring-gray-900/10' : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
      >
        <span className={value ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {value ? format(new Date(value), 'dd-MM-yyyy') : 'dd-mm-yyyy'}
        </span>
        <FiCalendar className={`transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-400'}`} size={18} />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 top-full mt-2 left-0 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 w-[280px]">
          {view === 'days' && renderDays()}
          {view === 'months' && renderMonths()}
          {view === 'years' && renderYears()}
        </div>
      )}
    </div>
  );
}

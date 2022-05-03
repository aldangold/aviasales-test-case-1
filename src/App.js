import { useEffect, useState } from 'react';
import logo from './logo.png';
import './css/style.css';
import ticketsInFile from './tickets.json' ;
import axios from 'axios';


const SORT_BY_PRICE = 'SORT_BY_PRICE';
const SORT_BY_SPEED = 'SORT_BY_SPEED';
const OPTIMAL_SORT = 'OPTIMAL_SORT';
const defaultStackTickets = 5;

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [reconciledTickets, setReconciledTickets] = useState([]);
  const [topFilter, setTopFilter] = useState(SORT_BY_PRICE);
  const [sideFilter, setSideFilter] = useState([
    {name: 'none_transfer', checked: true, id: 0, description: 'Без пересадок'},
    {name: 'one_transfer', checked: true, id: 1, description: '1 пересадка'},
    {name: 'two_transfer', checked: true, id: 2, description: '2 пересадки'},
    {name: 'three_transfer', checked: true, id: 3, description: '3 пересадки'},
  ]);
  const [count, setCount] = useState(defaultStackTickets);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const getId = await axios.get('https://front-test.beta.aviasales.ru/search');
        const searchIdData = await getId.json();
        const { searchId } = searchIdData;
        
        const getTickets = await axios.get(`https://front-test.beta.aviasales.ru/tickets?searchId=${searchId}`);
        const ticketsData = await getTickets.json();
        const { tickets } = ticketsData;
        setTickets(tickets);
        setReconciledTickets(tickets);
        
      } catch (error) {
        if (error.name === 'AxiosError') {
          alert('front-test.beta.aviasales.ru недоступен, билеты будут загружены из фикстур');
          const ticketsData = await ticketsInFile;
          const { tickets } = ticketsData;
          setTickets(tickets);
          setReconciledTickets(tickets);
        }
      }
    }
    makeRequest();

  }, []);

  const handleTopFilter = (event) => {
    const { target } = event;
    const currentFilter = target.value;
    setCount(defaultStackTickets);
    setTopFilter(currentFilter);
  }

  const handlerSideFilter = (event) => {
    const { target } = event;
    const idx = parseInt(target.id);
    setSideFilter(filters => { 
      return filters.map((filter) => idx === filter.id ? { ...filter, checked: !filter.checked } : filter )
    });
  };

  const allChecked = sideFilter.every(({ checked }) => checked);

  const handlerSideFilterAll = () => {
    setSideFilter(filters=> {
      return filters.map((filter) => ({...filter, checked: !allChecked}))
    })
  };

  const filterOutTickets = () => {
    const transfers = sideFilter.reduce((acc, {checked, id}) => {
      if (checked === true) acc.push(id)
      return acc;  
    }, []);

    const filterByTransfers = (keys) => {
      const filteredTickets = tickets.filter((ticket) => {
        return ticket.segments.reduce((flag, segment) => (flag && keys.includes(segment.stops.length)), true);
      });
      return filteredTickets;
    };
   
    const filterByTransfersTickets = filterByTransfers(transfers);
    setReconciledTickets(filterByTransfersTickets);
  }

  useEffect(() => {
    filterOutTickets();
  },[sideFilter]);

  useEffect(() => {
    sortOutTickets();
  },[topFilter, reconciledTickets.length]);

  const sortOutTickets = () => {
    switch (topFilter) {
      case SORT_BY_PRICE: {
        const sortedTickets = reconciledTickets.sort((a, b) => a.price - b.price);
        setReconciledTickets([...sortedTickets]);
      }
      break;

      case SORT_BY_SPEED: {
        const sortedTickets = reconciledTickets.sort((a, b) => {
          const add = (a, b) => a + b;
          const minADuration = add(...a.segments.map(({ duration }) => duration));
          const minBDuration = add(...b.segments.map(({ duration }) => duration));
          return minADuration - minBDuration;
        });
        setReconciledTickets([...sortedTickets]);
      }
      break;

      case OPTIMAL_SORT: {
        const add = (a, b) => a + b;
        const allPrice = reconciledTickets.reduce((acc, ticket) => acc + ticket.price, 0);
        const allDuration = reconciledTickets.reduce((acc, ticket) => acc + add(...ticket.segments.map(({ duration }) => duration)), 0);
        const sortedTickets = reconciledTickets.sort((a, b) => {
          const durationA = add(...a.segments.map(({ duration }) => duration));
          const durationB = add(...b.segments.map(({ duration }) => duration));
          const rateDurationA = durationA / allDuration;
          const rateDurationB = durationB / allDuration;

          const ratePriceA = a.price / allPrice;
          const ratePriceB = b.price / allPrice;

          const optimalA = rateDurationA + ratePriceA;
          const optimalB = rateDurationB + ratePriceB;

          return optimalA - optimalB;
        });
        setReconciledTickets([...sortedTickets]);
      }
      break;
    }

  }

const getTime = (dataTime) => {
  const date = new Date(dataTime);
  return date.toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow', hour12: false, hour: '2-digit', minute:'2-digit'});
}

const getTimeArrival = (dataTime, minutes) => {
  const date = new Date(dataTime);
  return date.setMinutes(date.getMinutes() + minutes);
}

  return (
    <div className="App">
        <div className='logo'><img src={logo} alt="logo" /></div>
        <div className='main'>
            <div className='side_group-filters col-12 col-md-3 position-sticky sticky-top d-flex flex-column'>
            <div className='side_group-filters_header'> количество пересадок </div>
            <div className="side_group-filters-item d-flex">
				      <input type="checkbox" id="all_transfer" name="all_transfer" value="all_transfer" onChange={handlerSideFilterAll} checked={allChecked}/>
              <label htmlFor="all_transfer">Все</label>
             </div>
             {sideFilter
              .map(({name, description, id, checked}, index) => <div className="side_group-filters-item d-flex" key={index}>
                 <input type="checkbox" id={id} name={id} value={id} onChange={handlerSideFilter} checked={checked}/>
                 <label htmlFor={id}>{description}</label>
                </div>
              )}
            </div>
            <div className='result col-12 col-md-9 flex-column'>
              <div className='top_group-filters'>
                <div className='top_group-filters-item'>
                  <input id="btn-sort_by_price" className='btn-check' onChange={handleTopFilter} type="radio" name="topFilter" value={SORT_BY_PRICE} checked={topFilter === SORT_BY_PRICE}/>
                  <label htmlFor='btn-sort_by_price' className='unselectable'>самый дешевый</label>
                </div>
              <div className='top_group-filters-item'>
                <input id='btn-sort_by_speed' className='btn-check' onChange={handleTopFilter} type="radio" name="topFilter" value={SORT_BY_SPEED} checked={topFilter === SORT_BY_SPEED}/>
                <label htmlFor='btn-sort_by_speed' className='unselectable'>самый быстрый</label>
              </div>
              <div className='top_group-filters-item'>
                <input id='btn-optimal_sort' className='btn-check' onChange={handleTopFilter} type="radio" name="topFilter" value={OPTIMAL_SORT} checked={topFilter === OPTIMAL_SORT}/>
                <label htmlFor='btn-optimal_sort' className='unselectable'>оптимальный</label>
              </div>
              </div>
              <div className='tickets_list flex-column'>
                {reconciledTickets
                .slice(0, count)
                .map((ticket, index) => <div className='ticket col-md-9' key={index}>
                  <div className='flex-item flex-grow-1 price'>{ticket.price} Р</div>
                  <div className='flex-item  flex-grow-1 carrier'><img src={`//pics.avs.io/99/36/${ticket.carrier}.png`}></img></div>
                  <div className='destination'>
                      {ticket.segments.map((segment, index) => <div className='route' key={index}>
                        <div className='gr d-flex'>{segment.origin}-{segment.destination}</div>
                        <div className='bk d-flex'>{getTime(segment.date)} - {getTime(getTimeArrival(segment.date, segment.duration))}</div>
                         </div>)}
                    </div> 
                    <div className='duration'>
                      {ticket.segments.map((segment, index) => <div className='route' key={index}>
                      <div className='gr d-flex'>В ПУТИ</div>
                      <div className='bk d-flex'>{segment.duration}</div>
                      </div>)}
                    </div>
                    <div className='stops'>
                      {ticket.segments.map((segment, index) => <div className='route' key={index}> 
                      <div className='gr d-flex'>{segment.stops.length} пересадки</div>
                      <div className='bk d-flex'>{segment.stops.map((stop, index) => <span key={index}> {stop} </span>)}</div>
                       </div>)}
                    </div>
                  </div>)}
                  <div className='show-more-tickets'>
                  <button className='show-more-tickets_button' onClick={(e) => e.target.blur() & setCount(count + defaultStackTickets)}>показать еще 5 билетов!</button>
                  </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default App;

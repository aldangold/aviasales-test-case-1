import { useEffect, useState } from 'react';
import logo from './logo.png';
import './App.css';
import ticketsInFile from './tickets.json' ;


const SORT_BY_PRICE = 'SORT_BY_PRICE';
const SORT_BY_SPEED = 'SORT_BY_SPEED';
const OPTIMAL_SORT = 'OPTIMAL_SORT';
const defaultStackTickets = 5;

function App() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [topFilter, setTopFilter] = useState('');
  const [sideFilter, setSideFilter] = useState({
    all_transfer: true,
    non_transfer: false,
    one_transfer: false,
    two_transfer: false,
    three_transfer: false,
  });
  const [count, setCount] = useState(defaultStackTickets);

  useEffect(() => {
    const makeRequest = async () => {
      // const getId = await fetch('https://front-test.beta.aviasales.ru/search');
      // const searchIdData = await getId.json();
      // const { searchId } = searchIdData;
      
      // const getTickets = await fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${searchId}`);
      // const ticketsData = await getTickets.json();
      const ticketsData = ticketsInFile;
      const { tickets } = ticketsData;
      setTickets(tickets);
      setFilteredTickets(tickets);
    }
    makeRequest();

  }, []);

  const handleTopFilter = (event) => {
    const { target } = event;
    const currentFilter = target.value;
    setCount(defaultStackTickets);
    setTopFilter(currentFilter);
    sortTickets(currentFilter);
  }

  const handlerSideFilter = (event) => {
    const { target } = event;
    const checkboxName = target.value;
    const value = target.checked ;
  
    setSideFilter( f => ({ ...f, [checkboxName]: value }));
    filterTickets();
  };

  const filterTickets = () => {
    const keys = [1]
    const filterOnTransfers = (keys) => {
      const filteredTickets = tickets.filter((ticket) => {
        return ticket.segments.reduce((flag, segment) => (flag && keys.includes(segment.stops.length)), true);
      });
      return filteredTickets;
    };

      // const filteredTickets = tickets.reduce((acc, ticket) => {
      //   const stopsA = ticket.segments[0].stops.length;
      //   const stopsB = ticket.segments[1].stops.length;
      //   if (stopsA === n && stopsB === n) acc.push(ticket);
      //   return acc;  
      // }, []);
      // return filteredTickets;
    // }
    
    // const nonTransfers = filterOnTransfers();
    // const oneTransfers = filterOnTransfers(1);
    // const twoTransfers = filterOnTransfers(2);
    const threeTransfers = filterOnTransfers(keys);

    // setSortedTickets(f => ({ ...f, allTransfers: tickets }));
    // setSortedTickets(f => ({ ...f, nonTransfers }));
    // setSortedTickets(f => ({ ...f, oneTransfers }));
    // setSortedTickets(f => ({ ...f, twoTransfers }));
    setFilteredTickets(threeTransfers);

  }

  const sortTickets = (topFilter) => {
    switch (topFilter) {
      case SORT_BY_PRICE: {
        const sortedTickets = filteredTickets.sort((a, b) => a.price - b.price);
        setFilteredTickets([...sortedTickets]);
      }
      break;

      case SORT_BY_SPEED: {
        const sortedTickets = filteredTickets.sort((a, b) => {
          const add = (a, b) => a + b;
          const minADuration = add(...a.segments.map(({ duration }) => duration));
          const minBDuration = add(...b.segments.map(({ duration }) => duration));
          return minADuration - minBDuration;
        });
        setFilteredTickets([...sortedTickets]);
      }
      break;

      case OPTIMAL_SORT: {
        const add = (a, b) => a + b;
        const allPrice = filteredTickets.reduce((acc, ticket) => acc + ticket.price, 0);
        const allDuration = filteredTickets.reduce((acc, ticket) => acc + add(...ticket.segments.map(({ duration }) => duration)), 0);
        const sortedTickets = filteredTickets.sort((a, b) => {
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
        setFilteredTickets([...sortedTickets]);
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
              {/* <div className='side_checkbox'></div> */}
				      
				      <input type="checkbox" id="all_transfer" name="transferQt" value="all_transfer" onChange={handlerSideFilter} checked={sideFilter['all_transfer']}/>
              <label for="all_transfer" className="label">Все</label>
             </div>
            <div className="side_group-filters-item">
              <label for="non_transfer" className="label">Без пересадок</label>
              <input type="checkbox" id="non_transfer" name="transferQt" value="non_transfer" onChange={handlerSideFilter} checked={sideFilter['non_transfer']}/>
            </div>
            <div className="side_group-filters-item">
              <label for="one_transfer" className="label">1 пересадка</label>
              <input type="checkbox" id="one_transfer" name="transferQt" value="one_transfer" onChange={handlerSideFilter} checked={sideFilter['one_transfer']}/>
            </div>
            <div className="side_group-filters-item">
              <label for="two_transfer" className="label">2 пересадки</label>
              <input  type="checkbox" id="two_transfer" name="transferQt" value="two_transfer" onChange={handlerSideFilter} checked={sideFilter['two_transfer']}/>
            </div>
            <div className="side_group-filters-item">
              <label for="three_transfer" className="label">3 пересадки</label>
              <input type="checkbox" id="three_transfer" name="transferQt" value="three_transfer" onChange={handlerSideFilter} checked={sideFilter['three_transfer']}/>
            </div>
            </div>
            <div className='result col-12 col-md-9 flex-column'>
              <div className='top_group-filters'>
                <div className='top_group-filters-item'>
                  <input id="btn-sort_by_price" className='btn-check' onChange={handleTopFilter} type="radio" name="topFilter" value={SORT_BY_PRICE} checked={topFilter === SORT_BY_PRICE}/>
                  <label for='btn-sort_by_price'>самый дешевый</label>
                </div>
              <div className='top_group-filters-item'>
                <input id='btn-sort_by_speed' className='btn-check' onChange={handleTopFilter} type="radio" name="topFilter" value={SORT_BY_SPEED} checked={topFilter === SORT_BY_SPEED}/>
                <label for='btn-sort_by_speed'>самый быстрый</label>
              </div>
              <div className='top_group-filters-item'>
                <input id='btn-optimal_sort' className='btn-check' onChange={handleTopFilter} type="radio" name="topFilter" value={OPTIMAL_SORT} checked={topFilter === OPTIMAL_SORT}/>
                <label for='btn-optimal_sort'>оптимальный</label>
              </div>
              </div>
              <div className='tickets_list flex-column'>
                {filteredTickets
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
                  <button className='show-more-tickets_button' onClick={() => setCount(count + defaultStackTickets)}>показать еще 5 билетов!</button>
                  </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default App;

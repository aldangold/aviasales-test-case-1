import { useEffect, useState } from 'react';
import axios from 'axios';
import ticketsInFile from '../tickets.json';

const Tickets = () => {
  const defaultStackTickets = 5;

  const [tickets, setTickets] = useState([]);
  const [reconciledTickets, setReconciledTickets] = useState([]);
  const [topFilter, setTopFilter] = useState({
    currentFilter: 'sort_by_price',
    filters: [
      { id: 1, name: 'sort_by_price', description: 'Самый дешевый' },
      { id: 2, name: 'sort_by_speed', description: 'Самый быстрый' },
      { id: 3, name: 'optimal_sort', description: 'Оптимальный' },
    ],
  });
  const [sideFilter, setSideFilter] = useState([
    { id: 0, name: 'none_transfer', checked: true, description: 'Без пересадок' },
    { id: 1, name: 'one_transfer', checked: true, description: '1 пересадка' },
    { id: 2, name: 'two_transfer', checked: true, description: '2 пересадки' },
    { id: 3, name: 'three_transfer', checked: true, description: '3 пересадки' },
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
    };
    makeRequest();
  }, []);

  const handleTopFilter = (event) => {
    const { target } = event;
    const { value } = target;
    console.log(value);
    setCount(defaultStackTickets);
    setTopFilter((f) => ({ ...f, currentFilter: value }));
  };

  const handlerSideFilter = (event) => {
    const { target } = event;
    const idx = target.id;
    setSideFilter((filters) => filters.map((filter) => (idx === filter.name ? { ...filter, checked: !filter.checked } : filter)));
  };

  const allChecked = sideFilter.every(({ checked }) => checked);

  const handlerSideFilterAll = () => {
    setSideFilter((filters) => filters.map((filter) => ({ ...filter, checked: !allChecked })));
  };

  const filterOutTickets = () => {
    const transfers = sideFilter.reduce((acc, { checked, id }) => {
      if (checked === true) acc.push(id);
      return acc;
    }, []);

    const filterByTransfers = (keys) => {
      const filteredTickets = tickets.filter((ticket) => ticket.segments.reduce((flag, segment) => (flag && keys.includes(segment.stops.length)), true));
      return filteredTickets;
    };

    const filterByTransfersTickets = filterByTransfers(transfers);
    setReconciledTickets(filterByTransfersTickets);
  };

  const sortOutTickets = () => {
    switch (topFilter.currentFilter) {
      case 'sort_by_price': {
        const sortedTickets = reconciledTickets.sort((a, b) => a.price - b.price);
        setReconciledTickets([...sortedTickets]);
      }
        break;

      case 'sort_by_speed': {
        const sortedTickets = reconciledTickets.sort((a, b) => {
          const add = (i, j) => i + j;
          const minADuration = add(...a.segments.map(({ duration }) => duration));
          const minBDuration = add(...b.segments.map(({ duration }) => duration));
          return minADuration - minBDuration;
        });
        setReconciledTickets([...sortedTickets]);
      }
        break;

      case 'optimal_sort': {
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

      default:
        break;
    }
  };

  useEffect(() => {
    filterOutTickets();
  }, [sideFilter]);

  useEffect(() => {
    sortOutTickets();
  }, [topFilter, reconciledTickets.length]);

  const getTime = (dataTime) => {
    const date = new Date(dataTime);
    return date.toLocaleTimeString('ru-RU', {
      timeZone: 'Europe/Moscow', hour12: false, hour: '2-digit', minute: '2-digit',
    });
  };

  const getTimeArrival = (dataTime, minutes) => {
    const date = new Date(dataTime);
    return date.setMinutes(date.getMinutes() + minutes);
  };

  return (
    <>
      <div className='side_group-filters col-12 col-md-3 position-sticky sticky-top d-flex flex-column'>
      <div className='side_group-filters_header'> количество пересадок </div>
      <div className="side_group-filters-item d-flex">
        <input type="checkbox" id="all_transfer" name="all_transfer" value="all_transfer" onChange={handlerSideFilterAll} checked={allChecked}/>
        <label htmlFor="all_transfer">Все</label>
      </div>
          {sideFilter
          .map(({ name, description, checked }, index) => <div className="side_group-filters-item d-flex" key={index}>
              <input type="checkbox" id={name} name={name} value={name} onChange={handlerSideFilter} checked={checked}/>
              <label htmlFor={name}>{description}</label>
          </div>)}
      </div>
      <div className='result col-12 col-md-9 flex-column'>
          <div className='top_group-filters'>
          {topFilter.filters
              .map(({ name, description }, index) => <div className='top_group-filters-item' key={index}>
              <input id={name} className='btn-check' onChange={handleTopFilter} type="radio" name={name} value={name} checked={topFilter.currentFilter === name}/>
              <label htmlFor={name} className='unselectable'>{description}</label>
              </div>)}
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
    </>
  );
};

export default Tickets;

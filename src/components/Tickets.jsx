import { useEffect } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import axios from 'axios';
import ticketsInFile from '../tickets.json';
import { useTranslation } from 'react-i18next';
import LoadingPage from './LoadingPage';
import { actions as ticketsActions } from '../slices/ticketsSlice.js';

const Tickets = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { ticketsStack, reconciledTickets } = useSelector((state) => state.ticketsReducer);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const getId = await axios.get('https://front-test.beta.aviasales.ru/search');
        const { searchId } = await getId.json();

        const getTickets = await axios.get(`https://front-test.beta.aviasales.ru/tickets?searchId=${searchId}`);
        const { tickets } = await getTickets.json();
        batch(() => {
          dispatch(ticketsActions.setTickets(tickets));
          dispatch(ticketsActions.setReconciledTickets(tickets));
        });
      } catch (error) {
        if (error.name === 'AxiosError') {
          alert('front-test.beta.aviasales.ru недоступен, билеты будут загружены из фикстур');
          const { tickets } = await ticketsInFile;
          batch(() => {
            dispatch(ticketsActions.setTickets(tickets));
            dispatch(ticketsActions.setReconciledTickets(tickets));
          });
        }
      }
    };
    makeRequest();
  }, []);

  const handler = (event) => {
    event.target.blur();
    dispatch(ticketsActions.addStackTickets());
  }

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

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const formatH = h > 1 ? `${h}ч` : ''; 
    const formatM = m > 0 ? `${m}м` : ''; 
    return `${formatH} ${formatM}`.trim();
  }

  if ( !reconciledTickets.length ) {
    return <LoadingPage/>
  }

  return (
    <>
      <div className='tickets_list flex-column'>
      {reconciledTickets
          .slice(0, ticketsStack)
          .map((ticket, index) => <div className='ticket col-md-9' key={index}>
          <div className='flex-item flex-grow-1 price'>{(ticket.price).toLocaleString('ru')} Р</div>
          <div className='flex-item  flex-grow-1 carrier'><img src={`//pics.avs.io/99/36/${ticket.carrier}.png`}></img></div>
          <div className='destination'>
              {ticket.segments.map((segment, index) => <div className='route' key={index}>
              <div className='gr d-flex'>{segment.origin}-{segment.destination}</div>
              <div className='bk d-flex'>{getTime(segment.date)} - {getTime(getTimeArrival(segment.date, segment.duration))}</div>
                  </div>)}
          </div>
          <div className='duration'>
              {ticket.segments.map((segment, index) => <div className='route' key={index}>
              <div className='gr d-flex'>{t('ticket.duration')}</div>
              <div className='bk d-flex'>{formatTime(segment.duration)}</div>
              </div>)}
          </div>
          <div className='stops'>
              {ticket.segments.map((segment, index) => <div className='route' key={index}>
              <div className='gr d-flex'>{t('ticket.transfersCount', { count: segment.stops.length })}</div>
              <div className='bk d-flex'>{segment.stops.map((stop, index) => <span key={index}> {stop} </span>)}</div>
              </div>)}
          </div>
          </div>)}
          <div className='show-more-tickets'>
          <button className='show-more-tickets_button' onClick={handler}>{t('showMoreTicketsButton')}</button>
          </div>
      </div>
    </>
  );
};

export default Tickets;

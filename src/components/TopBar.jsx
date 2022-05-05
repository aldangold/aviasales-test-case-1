import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { actions as ticketsActions } from '../slices/ticketsSlice.js';
import { actions as topFiltersActions } from '../slices/topFiltersSlice.js';

const TopBar = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const topFilters = useSelector((state) => state.topFiltersReducer);
  const reconciledTickets = useSelector((state) => state.ticketsReducer.reconciledTickets);

  const handleFilter = (event) => {
    const { target } = event;
    const { value } = target;
    dispatch(topFiltersActions.setCurrentFilter(value));
    dispatch(ticketsActions.setDefaultStackTickets());
  };

  const sortByPrice = (tickets) => {
    const sortedTickets = tickets.slice().sort((a, b) => a.price - b.price);
    dispatch(ticketsActions.setReconciledTickets(sortedTickets));
  };

  const sortBySpeed = (tickets) => {
    const sortedTickets = tickets.slice().sort((a, b) => {
      const add = (i, j) => i + j;
      const minADuration = add(...a.segments.map(({ duration }) => duration));
      const minBDuration = add(...b.segments.map(({ duration }) => duration));
      return minADuration - minBDuration;
    });
    dispatch(ticketsActions.setReconciledTickets(sortedTickets));
  };

  const sortByOprimal = (tickets) => {
    const add = (a, b) => a + b;
    const allPrice = tickets.slice().reduce((acc, ticket) => acc + ticket.price, 0);
    const allDuration = tickets.slice().reduce((acc, ticket) => acc + add(...ticket.segments.map(({ duration }) => duration)), 0);
    const sortedTickets = tickets.slice().sort((a, b) => {
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
    dispatch(ticketsActions.setReconciledTickets(sortedTickets));
  };

  const sortOutTickets = () => {
    switch (topFilters.currentFilter) {
      case 'sort_by_price':
        sortByPrice(reconciledTickets);
        break;

      case 'sort_by_speed':
        sortBySpeed(reconciledTickets);
        break;

      case 'optimal_sort':
        sortByOprimal(reconciledTickets);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    sortOutTickets();
  }, [topFilters, reconciledTickets.length]);

  return (
    <div className='top_group-filters'>
      {topFilters.filters
        .map(({ name, description }, index) => <div className='top_group-filters-item' key={index}>
          <input id={name} className='btn-check' onChange={handleFilter} type="radio" name={name} value={name} checked={topFilters.currentFilter === name}/>
          <label htmlFor={name} className='unselectable'>{t(description)}</label>
          </div>)}
      </div>
  );
};

export default TopBar;

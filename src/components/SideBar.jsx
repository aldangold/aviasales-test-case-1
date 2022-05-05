import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { actions as ticketsActions } from '../slices/ticketsSlice.js';
import { actions as sideFiltersActions } from '../slices/sideFiltersSlice.js';

const SideBar = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const tickets = useSelector((state) => state.ticketsReducer.tickets);
  const sideFilters = useSelector((state) => state.sideFiltersReducer);

  const handlerFilter = (event) => {
    const { target } = event;
    const idx = target.id;
    dispatch(sideFiltersActions.setSideFilter(idx));
    dispatch(ticketsActions.setDefaultStackTickets());
  };

  const allChecked = sideFilters.filters.every(({ checked }) => checked);

  const handlerCheckAll = () => {
    dispatch(sideFiltersActions.setCheckedAll(allChecked));
  };

  const filterOutTickets = () => {
    const transfers = sideFilters.currentFilters;

    const filterByTransfers = (keys) => {
      const filteredTickets = tickets.filter((ticket) => ticket.segments.reduce((flag, segment) => (flag && keys.includes(segment.stops.length)), true));
      return filteredTickets;
    };

    const filterByTransfersTickets = filterByTransfers(transfers);
    dispatch(ticketsActions.setReconciledTickets(filterByTransfersTickets));
  };

  useEffect(() => {
    filterOutTickets();
  }, [sideFilters.currentFilters]);

  return (
      <div className='side_group-filters col-12 col-md-3 position-sticky sticky-top d-flex flex-column'>
      <div className='side_group-filters_header'>{t('sideFilter.title')}</div>
      <div className="side_group-filters-item d-flex">
        <input type="checkbox" id="all_transfer" name="all_transfer" value="all_transfer" onChange={handlerCheckAll} checked={allChecked}/>
        <label htmlFor="all_transfer">{t('sideFilter.allTransfer')}</label>
      </div>
          {sideFilters.filters
            .map(({ name, description, checked }, index) => <div className="side_group-filters-item d-flex" key={index}>
              <input type="checkbox" id={name} name={name} value={name} onChange={handlerFilter} checked={checked}/>
              <label htmlFor={name}>{t(description)}</label>
          </div>)}
      </div>
  );
};

export default SideBar;

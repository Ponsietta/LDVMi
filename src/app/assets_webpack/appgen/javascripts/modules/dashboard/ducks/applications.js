import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import * as api from '../api'
import { withPaginationInfo, createPaginatedReducer, createEntitiesReducer, createPageContentSelector, createPagePromiseStatusSelector } from '../../core/ducks/lazyPagination'
import { Application } from '../../app/models'
import moduleSelector from '../selector'

// Actions

export const APPLICATIONS_PAGINATOR = prefix('APPLICATIONS_PAGINATOR');

export const GET_APPLICATIONS = prefix('GET_APPLICATIONS');
export const GET_APPLICATIONS_START = GET_APPLICATIONS + '_START';
export const GET_APPLICATIONS_ERROR = GET_APPLICATIONS + '_ERROR';
export const GET_APPLICATIONS_SUCCESS = GET_APPLICATIONS + '_SUCCESS';
export const GET_APPLICATIONS_RESET = GET_APPLICATIONS + '_RESET';

export function getApplications(page) {
  return withPaginationInfo(APPLICATIONS_PAGINATOR, page)(paginationInfo => {
    const promise = api.getApplications(paginationInfo);
    return createAction(GET_APPLICATIONS, { promise });
  });
}

export function getApplicationsReset() {
  return createAction(GET_APPLICATIONS_RESET);
}

// Reducers

const applicationsReducer = createEntitiesReducer(
  GET_APPLICATIONS_SUCCESS,
  GET_APPLICATIONS_RESET,
  app => new Application(app));

export default createPaginatedReducer(
  APPLICATIONS_PAGINATOR,
  GET_APPLICATIONS_SUCCESS,
  applicationsReducer);

// Selectors

const selector = createSelector([moduleSelector], state => state.applications);

export const createApplicationsSelector = pageSelector =>
  createPageContentSelector(APPLICATIONS_PAGINATOR, selector, pageSelector);

export const createApplicationsStatusSelector = pageSelector =>
  createPagePromiseStatusSelector(GET_APPLICATIONS, APPLICATIONS_PAGINATOR, pageSelector);

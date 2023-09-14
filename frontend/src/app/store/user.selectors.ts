import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserName = createSelector(
  selectUserState,
  (state) => state.name
);

export const selectUserPhoto = createSelector(
  selectUserState,
  (state) => state.photo
);

export const selectToggleSidebar = createSelector(
  selectUserState,
  (state) => state.toggleSidebar
)

export const selectAccount = createSelector(
  selectUserState,
  (state) => state.account
)

export const selectLoginData = createSelector(
  selectUserState,
  (state) => state.loginData
)

export const selectLogin = createSelector(
  selectUserState,
  (state) => state.login
)

export const selectPageList = createSelector(
  selectUserState,
  (state) => state.pageList
)

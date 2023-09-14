import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';

export interface UserState {
  name: string;
  photo: string;
  toggleSidebar: boolean;
  account: any;
  loginData: any;
  login: boolean;
}

const initialState: UserState = {
  name: '',
  photo: '',
  toggleSidebar: false,
  account: {},
  loginData: {},
  login: false
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.changeUserName, (state, { newName }) => ({ ...state, name: newName })),
  on(UserActions.changeUserPhoto, (state, { newPhoto }) => ({ ...state, photo: newPhoto })),
  on(UserActions.changeToggleSidebar, (state, { toggleSidebar }) => ({ ...state, toggleSidebar })),
  on(UserActions.changeAccount, (state, { account }) => ({ ...state, account })),
  on(UserActions.changeLoginData, (state, { loginData }) => ({ ...state, loginData })),
  on(UserActions.changeLogin, (state, { login }) => ({ ...state, login }))
);

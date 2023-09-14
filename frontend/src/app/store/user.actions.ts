import { createAction, props } from '@ngrx/store';

export const changeUserName = createAction('[User] Change Name', props<{ newName: string }>());
export const changeUserPhoto = createAction('[User] Change Photo', props<{ newPhoto: string }>());
export const changeToggleSidebar = createAction('[User] Toggle Sidebar', props<{ toggleSidebar: boolean }>());
export const changeAccount = createAction('[User] Change Account', props<{ account: any }>());
export const changeLoginData = createAction('[User] Change Login Data', props<{ loginData: any }>());
export const changeLogin = createAction('[User] Change Login', props<{ login: boolean }>());
export const changePageList = createAction('[User] Change Page List', props<{ pageList: any[] }>());

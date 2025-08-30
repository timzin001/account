export const LANGUAGES = ['vi', 'en']
export const ACCEPT_TYPE = ['ios', 'android', 'web']
export const USER_AGENT = 'user-agent'

export const Keys = {
  FULL_NAME_USER_SEARCH: 'fullNameUserSearch',
  PHONE_NUMBER_USER_SEARCH: 'phoneNumberUserSearch',
  DISPLAY_NAME_USER_SEARCH: 'displayNameUserSearch',

  CODE_SEARCH: 'codeSearch',
  NAMES_BRANCH_SEARCH: 'namesBranchSearch',
  NAMES_DEPARTMENT_SEARCH: 'namesDepartmentSearch',
  NAME_PERMISSION_SEARCH: 'namePermissionSearch',
  NAMES_POSITION_SEARCH: 'namesPositionSearch',
  FULL_NAME_LAST_UPDATER_SEARCH: 'fullNameLastUpdaterSearch',
  FULL_NAME_CREATOR_SEARCH: 'fullNameCreatorSearch',
}

export const TIME_REDIS = {
  THIRTY_DAYS: 30 * 24 * 60 * 60,
  TWENTY_FOUR_HOURS: 24 * 60 * 60,
}

export const KEY_REDIS = {
  USER: 'user',
}

export const JWT = {
  EXPIRES_IN: '30d',
}

// Realtime event
export const REALTIME = {
  UPDATE_NO_AUTH: 'update-no-auth',
  UPDATE_AUTH: 'update-auth',

  ROOM_AUTH: 'room_auth',
  ROOM_NO_AUTH: 'room_no_auth',
  ROOM_SERVER: 'room_server',

  USER_ONLINE_EVENT: 'user-online-event',
  USER_OFFLINE_EVENT: 'user-offline-event',

  SIGN_IN_EVENT: 'sign-in-event',
  SIGN_IN_ERROR: 'sign-in-error',
  SIGN_IN_SUCCESS: 'sign-in-success',
  CONNECT_EVENT: 'connect-event',
  SIGN_OUT_EVENT: 'sign-out-event',
  AUTH_ERROR_EVENT: 'auth-error-event',
  AUTH_SUCCESS_EVENT: 'auth-success-event',
  SIGN_IN_OTHER_DEVICE_EVENT: 'sign-in-other-device-event',
  UPDATE_DATA_EVENT: 'update-data-event',
}

//src/reducers/reducers.js

export const itemReducer = (state, action) => {
  switch (action.type) {
    case 'LIST':
      return {
        ...state,
        itemList: action.payload,
      };
    case 'VALIDATED':
      return { ...state, validated: true };
    case 'BUG':
      return { ...state, bug: action.payload };
    case 'CARD':
      return {
        ...state,
        itemCard: action.payload,
      };
    case 'ADD_ITEM':
      return {
        ...state,
        activeItem: action.payload,
      };
    case 'PHOTO':
      return {
        ...state,
        activeItem: action.payload,
      };
    case 'ADD_ITEM_ADDRESS':
      return {
        ...state,
        activeItem: { ...state.activeItem, address: action.payload },
      };
    case 'ADD_USER_ID':
      return {
        ...state,
        activeItem: { ...state.activeItem, owner: action.payload },
      };

    case 'EDIT_ITEM':
      return {
        ...state,
        image: true,
        activeItem: action.payload,
      };
    case 'CLEAR':
      return {
        ...state,
        activeItem: action.payload,
        validated: false,
      };
    case 'COUNT':
      return {
        ...state,
        count: action.payload,
      };
    case 'CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };
    case 'ADD_CURRENCIES':
      return {
        ...state,
        currencies: action.payload,
      };

    default:
      return state;
  }
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_INPUT_VALUE':
      return { ...state, activeUsers: action.payload };
    case 'VALIDATED':
      return { ...state, validated: true };
    case 'SHOW_CLOSE':
      return {
        ...state,
        show: !state.show,
      };
    case 'AUTH_CLEAR':
      return {
        ...state,
        activeItem: action.payload,
        validated: false,
      };
    case 'AUTH':
      return {
        ...state,
        token: action.payload,
        userName: action.userName,
        userId: action.userId,
      };
    case 'LOGOUT':
      return {
        ...state,
        token: undefined,
        userName: undefined,
        userId: undefined,
        pathname: '/',
      };
    case 'CHANGE_ACTIVE_LOGIN':
      return { ...state, activeLogin: action.payload };
    case 'EMPTY_LOGIN':
      return { ...state, activeLogin: action.payload };
    case 'ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'NO_ERROR':
      return {
        ...state,
        error: undefined,
      };
    case 'GET_PATH':
      return {
        ...state,
        pathname: action.payload,
      };
    case 'REMEMBER_LOGIN':
      return {
        ...state,
        activeLogin: action.payload,
      };
    case 'CHECKBOX':
      return {
        ...state,
        checkbox: !state.checkbox,
      };
    case 'STORAGE_CHECKBOX':
      return {
        ...state,
        checkbox: action.payload,
      };
    case 'REGISTRATION_ERROR':
      return {
        ...state,
        registrationError: {
          ...state.registrationError,
          ...action.payload,
        },
      };
    case 'REGISTRATION_MISTAKE':
      return {
        ...state,
        registrationMistake: true,
      };
    case 'EMPTY_REGISTRATION_ERROR':
      return {
        ...state,
        registrationMistake: false,
        registrationError: action.payload,
      };

    default:
      return state;
  }
};

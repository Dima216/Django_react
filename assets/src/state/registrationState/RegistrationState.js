import React, { useReducer } from 'react';
import axios from 'axios';
import { RegistrationContext } from './RegistrationContext';
import { authReducer } from '../../reducers/reducers';
import { AuthUrls } from '../../constants/urls';

const initialState = {
  activeUsers: {
    email: '',
    username: '',
    password1: '',
    password2: '',
    role: undefined,
  },
  activeLogin: {
    username: '',
    password: '',
  },
  validated: false,
  show: false,
  token: undefined,
  userName: undefined,
  userId: undefined,
  error: undefined,
  pathname: '/',
  checkbox: false,
};

const RegistrationState = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  // закрытие модального окна регистрации
  const handleClose = () => dispatch({ type: 'SHOW_CLOSE' });

  const {
    activeUsers,
    validated,
    show,
    token,
    userName,
    activeLogin,
    error,
    pathname,
    checkbox,
  } = state;
  //открытие модального окна регистрации
  const handleRegistrationShow = () => {
    dispatch({ type: 'SHOW_CLOSE' });
    // очистка регистрации
    const emptyActiveUsers = {
      activeUsers: {
        email: '',
        username: '',
        password1: '',
        password2: '',
        role: undefined,
      },
    };
    dispatch({
      type: 'AUTH_CLEAR',
      payload: { ...emptyActiveUsers.activeUsers },
    });
  };
  // получение значений из формы регистрации
  const handleChangeInput = (e) => {
    const inputValue = {
      ...state.activeUsers,
      [e.target.name]: e.target.value,
    };
    dispatch({
      type: 'CHANGE_INPUT_VALUE',
      payload: inputValue,
    });
  };
  // Добавление данных пользователя в LocalStorage
  const setUserStorage = (data) => {
    let token = data.key;
    let userName = data.username;
    let userId = data['user_id'];
    // место хранение токена выбирается от значения "Запомнить меня"
    if (state.checkbox) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
    localStorage.setItem('userName', userName);
    localStorage.setItem('userId', userId);

    dispatch({
      type: 'AUTH',
      payload: token,
      userName: userName,
      userId: userId,
    });
  };

  // Запомнить последний клик
  const rememberLastEvent = (e) => {
    let pathname = e.target.pathname;
    if (pathname === undefined) {
      pathname = e.target.parentElement.pathname;
      console.log(e.target.parentElement);
    }
    dispatch({ type: 'GET_PATH', payload: pathname });
  };

  // отправка данных из формы регистрации
  const handleSubmitForm = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      event.stopPropagation();
      const response = await axios.post(AuthUrls.REGISTRATION, activeUsers);
      // console.log(response);
      setUserStorage(response.data);
      dispatch({ type: 'SHOW_CLOSE' });
    }

    dispatch({ type: 'VALIDATED' });
  };
  // очистка Storage
  const logout = (history) => {
    if (state.checkbox) {
      localStorage.removeItem('token');
    } else {
      sessionStorage.removeItem('token');
    }
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    dispatch({ type: 'LOGOUT' });
    // очистка activeLogin
    const emptyActiveLogin = {
      activeLogin: {
        username: '',
        password: '',
      },
    };
    dispatch({ type: 'EMPTY_LOGIN', payload: emptyActiveLogin });
    history.push('/');
  };
  // Получение данных пользователя из LocalStorage
  const receiveUserStorage = () => {
    let token;
    if (state.checkbox) {
      token = localStorage.getItem('token');
    } else {
      token = sessionStorage.getItem('token');
    }
    let userName = localStorage.getItem('userName');
    let userId = localStorage.getItem('userId');
    dispatch({
      type: 'AUTH',
      payload: token,
      userName: userName,
      userId: userId,
    });
    return true;
  };
  //получение значений  авторизации
  const handleChangeLogin = (e) => {
    const inputValueLogin = {
      ...state.activeLogin,
      [e.target.name]: e.target.value,
    };
    //console.log(activeLogin);
    dispatch({
      type: 'CHANGE_ACTIVE_LOGIN',
      payload: inputValueLogin,
    });
  };
  //отправка логина на сервер и получение токeна
  const handleSubmitLogin = async (event, history) => {
    event.preventDefault();
    try {
      const response = await axios.post(AuthUrls.LOGIN, activeLogin);
      // console.log(response);
      setUserStorage(response.data);
      dispatch({ type: 'NO_ERROR' });
      history.push(pathname);
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ERROR', payload: e.name });
    }
  };
  // изменить checkbox в state на противоположное значение
  const handleChangeCheckbox = (e) => {
    // let checkbox = localStorage.getItem('checkbox');
    // checkbox = 'true' ? checkbox === 'false' || checkbox === null: 'true';
    // localStorage.setItem('checkbox', checkbox);

    let checkbox = state.checkbox;
    checkbox = !checkbox;
    dispatch({ type: 'CHECKBOX', checkbox: checkbox });
  };

  // открытие из логина окна регистрации и перенаправление на предыдущую страницу
  const registrationShow = (history) => {
    history.goBack();
    handleRegistrationShow();
  };

  return (
    <RegistrationContext.Provider
      value={{
        activeUsers,
        validated,
        show,
        token,
        userName,
        activeLogin,
        error,
        checkbox,
        handleChangeInput,
        handleSubmitForm,
        handleRegistrationShow,
        handleClose,
        logout,
        receiveUserStorage,
        handleChangeLogin,
        handleSubmitLogin,
        registrationShow,
        rememberLastEvent,
        handleChangeCheckbox,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export default RegistrationState;

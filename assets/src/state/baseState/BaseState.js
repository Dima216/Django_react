import React, { useReducer } from 'react';
import axios from 'axios';
import { BaseContext } from './BaseContext';
import { ModelUrls } from '../../constants/urls';
import { itemReducer } from '../../reducers/reducers';
import { receiveDataStorage } from '../../utilities/receiveDataStorage';

const initialState = {
  itemCard: {},
  itemList: [],
  validated: false,
  bug: null,
  image: false,
  activeItem: {
    owner: null,
    description: '',
    photo: undefined,
    currency: undefined,
    price: '',
    status: undefined,
    house_type: undefined,
    address: {
      country: '',
      city: '',
      street: '',
      house_number: '',
      zip_code: '',
    },
  },
  // для пагинации
  pageSize: 3,
  count: 0,
  currentPage: 1,
  //для валюты
  currencies: [],
};

const BaseState = ({ children }) => {
  const [state, dispatch] = useReducer(itemReducer, initialState);

  //запрос на сервер , получаем список домов
  const refreshList = async (url = ModelUrls.ITEMS) => {
    const response = await axios.get(url);
    // console.log(response);
    dispatch({
      type: 'LIST',
      payload: response.data.results,
    });
    // получение общего количества домов на сервере(count)
    dispatch({ type: 'COUNT', payload: response.data.count });
  };
  // постраничный запрос на сервер(через router (match.params.name), вычисляем offset и делаем запрос)
  // offset(смещение на лимит), нужен для вычисления страницы. (1 стр.offset =0, 2стр - offset=лимит,  3 стр- offset=2 лимита и т.д )
  // лимит -кол. домов на странице. offset=(номер страниц-1)*лимит

  const paginationUrl = (urlPageNumber) => {
    dispatch({ type: 'CURRENT_PAGE', payload: urlPageNumber });
    const offset = (urlPageNumber - 1) * pageSize;
    const urlPage = `${ModelUrls.ITEMS}?offset=${offset}&limit=${pageSize}`;
    refreshList(urlPage);
  };
  // очистка currenPage
  const clearCurrentPage = () => {
    dispatch({ type: 'CURRENT_PAGE', payload: 1 });
  };
  //Запрос на сервер,  при помощи id, для получения  объект дома для профайла
  const refreshCard = async (itemId) => {
    console.log(itemList);
    const response = await axios.get(ModelUrls.ITEMS + itemId);
    /* const card = {};
    for (let i = 0; i < itemList.length; i++) {
      if (itemList[i].id === +itemId) {
        for (let key in itemList[i]) {
          card[key] = itemList[i][key];
        }
        //console.log(card);
      }
    } */
    // console.log(response.data);

    dispatch({
      type: 'CARD',
      payload: { ...response.data },
    });
  };

  // Добавляем в owner userId.Функцию вызываем в AddData с помощью useEffecta(во 2-ой параметр кладём owner,это поможет нам вызвать функцию дважды,чтобы owner смог записаться в стэйт)
  const addUserId = (userId) => {
    //console.log(userId);
    dispatch({ type: 'ADD_USER_ID', payload: userId });
    //console.log(activeItem);
  };
  // получение данных из формы AddData, для создания нового объекта
  const handleChange = (e) => {
    const item = { ...state.activeItem, [e.target.name]: e.target.value };
    dispatch({
      type: 'ADD_ITEM',
      payload: item,
    });
  };
  // отдельное получение фото с помощью useRef
  const handleChangePhoto = (file) => {
    const img = { ...state.activeItem, photo: file };
    dispatch({
      type: 'PHOTO',
      payload: img,
    });
  };
  // отдельное получение адреса из-за вложенности
  const handleChangeAddress = (e) => {
    const itemAddress = {
      ...state.activeItem.address,
      [e.target.name]: e.target.value,
    };
    // console.log(itemAddress);
    dispatch({
      type: 'ADD_ITEM_ADDRESS',
      payload: itemAddress,
    });
  };

  const {
    itemList,
    itemCard,
    activeItem,
    validated,
    bug,
    image,
    count,
    pageSize,
    currentPage,
    currencies,
  } = state;

  // console.log(activeItem);

  const editItem = (item) => {
    // console.log(item);
    dispatch({
      type: 'EDIT_ITEM',
      payload: item,
    });
  };

  // отправка данных на сервер
  const handleSubmit = async (e, history) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      e.stopPropagation();
      // добавляем наш объект в new FormData при помощи append, это поможет нам отправить файл с фото на сервер
      let activeForm = new FormData();
      // а это все ради вложенного объекта address
      for (let key in activeItem) {
        if (key === 'address') {
          let address = {};
          for (let ak in activeItem.address) {
            address[ak] = activeItem.address[ak];
          }
          activeForm.append('address', JSON.stringify(address));
        } else {
          activeForm.append(key, activeItem[key]);
        }
      }
      /*  for (let pair of activeForm.entries()) {
        console.log(pair[0] + ',' + pair[1]);
      } */
      if (activeItem.id) {
        try {
          await axios.put(ModelUrls.ITEMS + activeItem.id + '/', activeForm);
          clearBug();
          refreshList();
          history.goBack();
        } catch (e) {
          dispatch({ type: 'BUG', payload: e.message });
        }
        return;
      }

      try {
        await axios.post(ModelUrls.ITEMS, activeForm);
        clearBug();
        refreshList();
        history.push('/ListCard/1');
      } catch (e) {
        dispatch({ type: 'BUG', payload: e.message });
      }
    }

    dispatch({ type: 'VALIDATED' });
  };
  const handleDelete = async (item, history) => {
    await axios.delete(ModelUrls.ITEMS + item.id);
    refreshList();
    history.push('/ListCard/1');
  };
  //очистка ошибки
  const clearBug = () => {
    dispatch({ type: 'BUG', payload: null });
  };
  //Очистка стейта
  const clearActiveItem = () => {
    const emptyActiveItem = {
      activeItem: {
        owner: null,
        description: '',
        photo: undefined,
        currency: undefined,
        price: '',
        status: undefined,
        house_type: undefined,
        address: {
          country: '',
          city: '',
          street: '',
          house_number: '',
          zip_code: '',
        },
      },
    };
    dispatch({
      type: 'CLEAR',
      payload: { ...emptyActiveItem.activeItem },
    });
  };
  //запрос для валюты
  const addCurrencies = async () => {
    let token = receiveDataStorage('token');
    try {
      const response = await axios.get(ModelUrls.CURRENCIES, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      dispatch({ type: 'ADD_CURRENCIES', payload: [...response.data.results] });
    } catch (e) {
      console.log(e);
    }
  };
  // console.log(activeItem.currency);

  return (
    <BaseContext.Provider
      value={{
        itemList,
        itemCard,
        activeItem,
        validated,
        bug,
        image,
        count,
        pageSize,
        currentPage,
        currencies,
        refreshList,
        handleChange,
        handleSubmit,
        handleDelete,
        editItem,
        refreshCard,
        handleChangeAddress,
        handleChangePhoto,
        clearActiveItem,
        addUserId,
        addCurrencies,
        clearCurrentPage,
        paginationUrl,
      }}
    >
      {children}
    </BaseContext.Provider>
  );
};

export default BaseState;

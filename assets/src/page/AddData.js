import React, { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { BaseContext } from '../state/baseState/BaseContext';

const AddData = () => {
  const history = useHistory();
  const {
    handleChange,
    activeItem,
    handleSubmit,
    handleChangeAddress,
    handleChangePhoto,
  } = useContext(BaseContext);
  const inputEl = useRef(null);
  const { description, price, address, status, house_type } = activeItem;
  const { country, city, street, house_number, zip_code } = address;
  const radioStatus = [
    { label: 'Продатся', value: 1 },
    { label: 'В продаже', value: 2 },
    { label: 'Продан', value: 3 },
  ];
  const radioType = [
    { label: 'Коттедж', value: 1 },
    { label: 'Многоэтажный дом', value: 2 },
  ];
  return (
    <Container className="p-5">
      <h2 className="text-center">Ввод данных</h2>
      <Form className="mt-5" onSubmit={(e) => handleSubmit(e, history)}>
        <Form.Group as={Row} controlId="formGroupDescription">
          <Form.Label column sm="2">
            <h5>Описание:</h5>
          </Form.Label>
          <Col sm="8">
            <Form.Control
              as="textarea"
              rows={7}
              name="description"
              value={description}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
        <hr />
        <Form.Group as={Row} controlId="formGroupPhoto">
          <Form.Label column sm="2">
            <h5>Фото:</h5>
          </Form.Label>
          <Col sm="4">
            <Form.Control
              type="file"
              name="photo"
              ref={inputEl}
              onChange={() => handleChangePhoto(inputEl.current.files[0])}
            />
          </Col>
        </Form.Group>
        <hr />
        <Form.Group as={Row} controlId="formGroupPrice">
          <Form.Label column sm="2">
            <h5>Цена:</h5>
          </Form.Label>
          <Col sm="4">
            <Form.Control
              type="number"
              name="price"
              value={price}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
        <hr />
        <Row>
          <Col>
            <Form.Group as={Row} controlId="formGroupRadio">
              <Form.Label column sm="4">
                <h5>Статус:</h5>
              </Form.Label>
              <Col sm="8" key="inline - radio">
                {radioStatus.map((radio, index) => {
                  return (
                    <Form.Check
                      key={index}
                      checked={+status === radio.value}
                      inline
                      type="radio"
                      label={radio.label}
                      name="status"
                      value={radio.value}
                      onChange={handleChange}
                    />
                  );
                })}
              </Col>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group as={Row} controlId="formGroupRadio">
              <Form.Label column sm="4">
                <h5>Тип:</h5>
              </Form.Label>
              <Col sm="8" key="inline - radio">
                {radioType.map((radio, index) => {
                  return (
                    <Form.Check
                      key={index}
                      checked={+house_type === radio.value}
                      inline
                      type="radio"
                      label={radio.label}
                      name="house_type"
                      value={radio.value}
                      onChange={handleChange}
                    />
                  );
                })}
              </Col>
            </Form.Group>
          </Col>
        </Row>
        <hr />
        <h5>Адрес:</h5>
        <Row>
          <Col>
            <Form.Group controlId="formGroupCountry">
              <Form.Label>Страна</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={country}
                onChange={handleChangeAddress}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formGroupCity">
              <Form.Label>Город</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={city}
                onChange={handleChangeAddress}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formGroupStreet">
              <Form.Label>Улица</Form.Label>
              <Form.Control
                type="text"
                name="street"
                value={street}
                onChange={handleChangeAddress}
              />
            </Form.Group>
          </Col>
          <Col sm="2">
            <Form.Group controlId="formGroupHouseNumber">
              <Form.Label>Номер дома</Form.Label>
              <Form.Control
                type="text"
                name="house_number"
                value={house_number}
                onChange={handleChangeAddress}
              />
            </Form.Group>
          </Col>
          <Col sm="2">
            <Form.Group controlId="formGroupZipCode">
              <Form.Label>Индекс</Form.Label>
              <Form.Control
                type="number"
                name="zip_сode"
                value={zip_code}
                onChange={handleChangeAddress}
              />
            </Form.Group>
          </Col>
        </Row>
        <hr />
        <Button className="float-right" variant="primary" type="submit">
          Сохранить
        </Button>
      </Form>
    </Container>
  );
};
export default AddData;

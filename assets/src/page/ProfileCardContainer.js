import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ProfileCard from '../components/profilecard/Profilecard';
import ProfileModalWallet from '../components/profilecard/ProfileModalWallet';
import { BaseContext } from '../state/baseState/BaseContext';
import { PersonalAccountContext } from '../state/personalAccountState/PersonalAccountContext';
import Transaction from '../components/profilecard/Transaction';

const ProfileCardContainer = ({ match }) => {
  const { itemCard, refreshCard, editItem, handleDelete } = useContext(
    BaseContext
  );
  const {
    wallet,
    getUser,
    chooseWallet,
    selectedWallet,
    convertetTransaction,
    calculationMoney,
    transctionSabmit,
    addDataTransaction,
    addCurrentExchange,
  } = useContext(PersonalAccountContext);
  const urlId = match.params.name;
  const history = useHistory();
  useEffect(() => {
    refreshCard(urlId);
    getUser();
    // eslint-disable-next-line
  }, []);

  // console.log(match);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const openWallet = () => {
    setShow(!show);
  };
  const closeWalet = () => {
    setShow(!show);
  };
  const showTransaction = () => {
    setOpen(!open);
  };
  const closeTransaction = () => {
    setOpen(!open);
  };

  return (
    <>
      <ProfileCard
        editItem={editItem}
        handleDelete={handleDelete}
        history={history}
        itemCard={itemCard}
        openWallet={openWallet}
      />
      <ProfileModalWallet
        closeWalet={closeWalet}
        show={show}
        wallet={wallet}
        showTransaction={showTransaction}
        chooseWallet={chooseWallet}
        itemCard={itemCard}
        convertetTransaction={convertetTransaction}
        addDataTransaction={addDataTransaction}
        addCurrentExchange={addCurrentExchange}
      />
      <Transaction
        open={open}
        closeTransaction={closeTransaction}
        selectedWallet={selectedWallet}
        itemCard={itemCard}
        calculationMoney={calculationMoney}
        transctionSabmit={transctionSabmit}
      />
    </>
  );
};

export default ProfileCardContainer;

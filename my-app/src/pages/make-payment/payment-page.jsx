/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/loader/loader';
import './make-payment.css';

const MakePayment = () => {
  const [banks, setBanks] = useState([]);
  const [bankCode, setBankCode] = useState('');
  const [isLoader, setLoader] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [payments, setPayments] = useState({});

  const getBankDetails = (detail) => {
    const data = detail.split("__");
    setBankCode(data[0]);
    setBankName(data[1]);
  }
  useEffect(() => {
    setLoader(true);
    const fetchBanks = async () => {
      try {
        const response = await axios.get('https://api.paystack.co/bank', {
          headers: {
            Authorization: 'Bearer sk_test_0880c1a9a5273248688de6d7bec39a89996d2254',
          },
        });

        setLoader(false);
        setBanks(response.data.data);
      } catch (error) {
        setLoader(false);
        console.error(error);
      }
    };
    fetchBanks();
  }, []);

  const fetchPayments = async (account) => {
    try {
      const response = await axios.get(`https://api.paystack.co/bank/resolve?account_number=${account}&bank_code=${bankCode}`, {
        headers: {
          Authorization: 'Bearer sk_test_0880c1a9a5273248688de6d7bec39a89996d2254',
        },
      });
      setLoader(false);
      setPayments(response.data.data);
    } catch (error) {
      setLoader(false);
    }
  };


  const resolveAccount = (account)=> {
    if (account.length === 10) {
      setLoader(true);
      console.log("account", account);
      setAccountNumber(account);
      fetchPayments(account);
    }
}


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true)
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));

      const response = await axios.post(`https://fintech-zukf.onrender.com/txn/create`,{
        bankCode: bankCode,
        recipientName: payments.account_name,
        accountNumber: accountNumber,
        email: userData.email,
        bankName: bankName,
        narration: narration,
        amount: amount
      }, {
        headers: {
          Authorization: 'Bearer nt',
        },
      });
      setLoader(false);
      alert(response.data.message);
      window.location = "../home";
    } catch (error) {
      setLoader(false);
      console.error(error.message);
      alert(error.message)
    }
  };

  return (
    <>
    <div className="App">     
        <form onSubmit={handleSubmit}>
        <h3>Send Money</h3>

        <label htmlFor="amount">Amount</label>
        <input type="text" id="amount" onBlur={(event) => setAmount(event.target.value)} placeholder='Ex. 1000' />
          
          <label htmlFor="bank">Select Bank</label>
          <select id="bank" onChange={(event) => getBankDetails(event.target.value)}>
            <option value="">Select a bank</option>
            {banks.map((bank) => (
              <option key={bank.code} value={bank.code + "__" + bank.name}>
                {bank.name}
              </option>
            ))}
          </select>
          
          <label htmlFor="account">Account Number</label>
          <input type="text" id="account" onChange={(event) => resolveAccount(event.target.value)} placeholder='Ex. 3105467845' />
          
          <label htmlFor="accountName">Account Name</label>
          <input type="text" id="accountName" value={payments.account_name ?? "Account Name"} readOnly placeholder='Account Name' />
          
          <label htmlFor="narration">Narration</label>
          <input type="text" id="narration"  onBlur={(event) => setNarration(event.target.value)} placeholder='Whats the money for?' />
          
          <button type="submit">Submit</button>
        </form>
    </div>
    {
      isLoader === true ? <Loader /> : ""
     }
    </>
  );
}
export default MakePayment;

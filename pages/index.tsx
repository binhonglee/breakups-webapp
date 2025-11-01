import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import People from '../components/People';
import PaymentChain from '../components/PaymentChain';
import { calculateOptimalPaymentChain } from '../lib/calculator';


interface PersonInfo {
  name: string;
  amount: string;
}

interface Payment {
  from: string;
  to: string;
  amount: number;
}

export default function Home(): React.JSX.Element {
  const [peoples, setPeoples] = useState<React.JSX.Element[]>([]);
  const [info, setInfo] = useState<PersonInfo[]>([]);
  const [paymentChain, setPaymentChain] = useState<Payment[]>([]);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    if (paymentChain.length > 0) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [paymentChain]);

  const getPaymentChain = (): void => {
    const users: { name: string; amount: number }[] = [];
    for (const key in info) {
      if (!info[key].name || !info[key].amount) {
        alert('Please fill in all fields!');
        return;
      }
      if (isNaN(Number(info[key].amount))) {
        alert('Amount must be number!');
        return;
      }
      const user = {
        name: info[key].name,
        amount: parseFloat(info[key].amount)
      };
      users.push(user);
    }

    setShowResults(true);
    setTimeout(() => {
      const optimizedPayments = calculateOptimalPaymentChain(users);
      setPaymentChain(optimizedPayments);
      setShowResults(false);
      setShowButton(false);
    }, 500);
  };

  const populatePeople = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const noOfPeople = formData.get('noOfPeople') as string;
    const newPeoples: React.JSX.Element[] = [];
    const newInfo: PersonInfo[] = [];

    if (isNaN(Number(noOfPeople)) || Number(noOfPeople) <= 2) {
      alert('Please input number larger than 2!');
    } else {
      for (let i = 0; i < Number(noOfPeople); i++) {
        newInfo.push({ name: '', amount: '' });
        newPeoples.push(<People key={i} id={i} updateInfo={updateInfo} />);
      }

      setPeoples(newPeoples);
      setInfo(newInfo);
      setShowButton(true);
    }
  };

  const updateInfo = (e: { id: number; info: PersonInfo }): void => {
    setInfo(prevInfo => {
      const newInfo = [...prevInfo];
      newInfo[e.id] = e.info;
      return newInfo;
    });
    setShowButton(true);
  };

  return (
    <div className="App">
      <Head>
        <title>Breakups</title>
        <meta name="description" content="Split bills among multiple people." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <h1>Breakups</h1>

      <div className="Forms">
        <form className="Main-form" onSubmit={populatePeople}>
          Number of people: <input type="text" name="noOfPeople" /> <input type="submit" value="Submit"/>
        </form>
        {peoples.length > 0 && <div className="Peoples">{peoples}</div>}
      </div>
      <br/>
      {showButton && (
        <input
          type="submit"
          value={showResults ? "Loading..." : "Get Payment Chain"}
          onClick={getPaymentChain}
          disabled={showResults}
        />
      )}
      {showResults ? null : <PaymentChain className="PaymentChain" paymentChain={paymentChain} />}
      <div style={{ height: '50px' }} />

      <div className="footer">
        Created by <a href="https://github.com/binhonglee" target="_blank" rel="noopener noreferrer">@binhonglee</a> | <a href="https://github.com/binhonglee/breakups-webapp" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </div>
  );
}

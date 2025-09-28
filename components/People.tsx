import React, { useState } from 'react';

interface PersonInfo {
  name: string;
  amount: string;
}

interface PeopleProps {
  id: number;
  updateInfo: (data: { id: number; info: PersonInfo }) => void;
}

export default function People({ id, updateInfo }: PeopleProps): React.JSX.Element {
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const handleChange = (field: 'name' | 'amount', value: string): void => {
    let newName = name;
    let newAmount = amount;

    if (field === 'name') {
      setName(value);
      newName = value;
    }
    if (field === 'amount') {
      setAmount(value);
      newAmount = value;
    }

    const updatedInfo: PersonInfo = {
      name: newName,
      amount: newAmount
    };

    updateInfo({ id, info: updatedInfo });
  };

  return (
    <div className="People">
      <div className="person-title">Person {id + 1}</div>
      <div className="input-group">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => handleChange('amount', e.target.value)}
        />
      </div>
    </div>
  );
}
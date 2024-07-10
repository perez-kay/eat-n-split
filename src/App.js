import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [currFriend, setCurrFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelectFriend(friend) {
    if (currFriend?.id === friend.id) {
      setCurrFriend(null);
    } else setCurrFriend(friend);
    setShowAddFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelectFriend}
          currFriend={currFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? 'Close' : 'Add Friend'}
        </Button>
      </div>
      <FormSplitBill currFriend={currFriend} />
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, currFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectFriend={onSelectFriend}
          currFriend={currFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, currFriend }) {
  return (
    <li className={currFriend?.id === friend.id ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${friend.balance * -1}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
      )}
      <Button onClick={() => onSelectFriend(friend)}>
        {currFriend?.id === friend.id ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?u=${id}`,
      balance: 0,
      id,
    };
    onAddFriend(newFriend);
    setName('');
    setImage('https://i.pravatar.cc/48');
  }

  return (
    <form action="" className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ currFriend }) {
  const [bill, setBill] = useState('');
  const [userExpense, setUserExpense] = useState('');
  const friendExpense = bill ? bill - userExpense : '';
  const [whoPays, setWhoPays] = useState('user');

  if (!currFriend) return;
  return (
    <form className="form-split-bill">
      <h2>Split a bill with {currFriend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>Your Expenses</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) => setUserExpense(Number(e.target.value))}
      />
      <label>{currFriend.name}'s Expenses</label>
      <input type="text" disabled value={friendExpense} />
      <label>Who is paying the bill?</label>
      <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{currFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

export default App;

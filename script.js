'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

function displayMovements(movements) {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function createUsername(accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
}

createUsername(accounts);

function calcDisplayBalance(account) {
  account.balance = account.movements.reduce(
    (accumulator, mov) => (accumulator += mov),
    0
  );
  labelBalance.textContent = `${account.balance}€`;
}

function calcDisplaySummary(account) {
  labelSumIn.textContent = '';
  labelSumOut.textContent = '';
  labelSumInterest.textContent = '';

  const depositSummary = account.movements
    .filter(mov => mov > 0)
    .reduce((accumulator, mov) => accumulator + mov);
  labelSumIn.textContent = `${depositSummary}€`;

  const withdrawalSummary = account.movements
    .filter(mov => mov < 0)
    .reduce((accumulator, mov) => accumulator + mov);
  labelSumOut.textContent = `${Math.abs(withdrawalSummary)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(inter => inter >= 1)
    .reduce((accumulator, mov) => accumulator + mov);
  labelSumInterest.textContent = `${interest}€`;
}

// event handlers
let currentAccount;
btnLogin.addEventListener('click', loginHandler);

function loginHandler(evt) {
  evt.preventDefault();
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('logged in');
    //display ui and message
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 100;

    updateUI(currentAccount);

    const timer = setTimeout(() => (containerApp.style.opacity = 0), 300000);
    labelTimer.textContent = timer;
  }
}

btnTransfer.addEventListener('click', transferHandler);

function transferHandler(evt) {
  evt.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );
  if (receiverAccount === currentAccount)
    alert("you can't send money to yourself");
  if (
    receiverAccount &&
    receiverAccount.username !== currentAccount.username &&
    amount &&
    amount > 0 &&
    amount <= currentAccount.balance
  ) {
    const confirmation = confirm(
      `Transfer ${amount} to ${receiverAccount.owner} ?`
    );
    if (confirmation) {
      currentAccount.movements.push(-amount);
      updateUI(currentAccount);
      receiverAccount.movements.push(amount);
      inputTransferAmount.value = inputTransferTo.value = '';
    }
  } else console.log('nope');
}

function updateUI(account) {
  //display balance
  calcDisplayBalance(account);
  //display movements
  displayMovements(account.movements);
  //display summary and interest
  calcDisplaySummary(account);
}

btnClose.addEventListener('click', closeAccountHandler);

function closeAccountHandler(evt) {
  evt.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(account => account === currentAccount);
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.blur();
    inputClosePin.blur();
    const confirmation = confirm(
      'Are you sure? Your account will permanently be deleted.'
    );
    if (confirmation) {
      accounts.splice(index, 1);
      alert('Account successfully deleted.');
      containerApp.style.opacity = 0;
    }
  }
}

btnLoan.addEventListener('click', loanHandler);

function loanHandler(evt) {
  evt.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  console.log(loanAmount);
  if (
    currentAccount &&
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    currentAccount.movements.push(loanAmount);
    updateUI(currentAccount);
    console.log('success');
  } else {
    alert(
      'Operation failed. Make sure you are logged in and meet the requirements in order for us to be able to lend you the desired amount.'
    );
  }
  inputLoanAmount.value = '';
}

btnSort.addEventListener('click', sortHandler);

let sorted = false;
function sortHandler(evt) {
  evt.preventDefault();
  const sortedMovements = currentAccount.movements
    .slice()
    .sort((a, b) => a - b);
  if (!sorted) {
    displayMovements(sortedMovements);
    sorted = true;
  } else {
    displayMovements(currentAccount.movements);
    sorted = false;
  }
}

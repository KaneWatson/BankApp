'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Ayoub Aloui',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-02-26T23:36:17.929Z',
    '2023-02-28T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2023-02-21T18:49:59.371Z',
    '2023-02-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Kane Watson',
  movements: [4000, 3200, -170, 780, -3340, -1000, 9500, -40],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2023-02-21T18:49:59.371Z',
    '2023-02-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

// Data

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

function formatMovesDates(date, locale) {
  function calcDaysPassed(date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  }
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7 && daysPassed > 1) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
}

function formatCurrency(account, amount) {
  const currencyOptions = {
    style: 'currency',
    currency: account.currency,
  };
  return new Intl.NumberFormat(account.locale, currencyOptions).format(amount);
}

function displayMovements(account, sort = false) {
  containerMovements.innerHTML = '';
  const moves = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  moves.forEach((mov, i) => {
    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovesDates(date, account.locale);
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatCurrency(account, mov)}</div>
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
  labelBalance.textContent = `${formatCurrency(account, account.balance)}`;
}

function calcDisplaySummary(account) {
  labelSumIn.textContent = '';
  labelSumOut.textContent = '';
  labelSumInterest.textContent = '';

  const depositSummary = account.movements
    .filter(mov => mov > 0)
    .reduce((accumulator, mov) => accumulator + mov);
  labelSumIn.textContent = `${formatCurrency(account, depositSummary)}`;

  const withdrawalSummary = account.movements
    .filter(mov => mov < 0)
    .reduce((accumulator, mov) => accumulator + mov);
  labelSumOut.textContent = `${formatCurrency(
    account,
    Math.abs(withdrawalSummary)
  )}`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(inter => inter >= 1)
    .reduce((accumulator, mov) => accumulator + mov);
  labelSumInterest.textContent = `${formatCurrency(account, interest)}`;
}

// event handlers
let currentAccount, timer;
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

    let now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    // const locale = navigator.language;
    // console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    if (timer) {
      clearInterval(timer);
    }
    updateUI(currentAccount);

    logoutTimer();
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
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      receiverAccount.movements.push(amount);
      receiverAccount.movementsDates.push(new Date().toISOString());
      inputTransferAmount.value = inputTransferTo.value = '';
    }
  } else console.log('nope');
  clearInterval(timer);
  logoutTimer();
}

function updateUI(account) {
  //display balance
  calcDisplayBalance(account);
  //display movements
  displayMovements(account);
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
  const loanAmount = Math.floor(Number(inputLoanAmount.value));
  if (
    currentAccount &&
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(loanAmount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      console.log('success');
    }, 3000);
  } else {
    alert(
      'Operation failed. Make sure you are logged in and meet the requirements in order for us to be able to lend you the desired amount.'
    );
  }
  inputLoanAmount.value = '';
  clearInterval(timer);
  logoutTimer();
}

btnSort.addEventListener('click', sortHandler);

let sorted = false;
function sortHandler(evt) {
  evt.preventDefault();
  if (!sorted) {
    displayMovements(currentAccount, true);
    sorted = true;
  } else {
    displayMovements(currentAccount, false);
    sorted = false;
  }
}

function logoutTimer() {
  let time = 600;
  function tick() {
    let mins = Math.floor(time / 60);
    let secs = Math.floor(time % 60);
    labelTimer.textContent = `${String(mins).padStart(2, 0)}:${String(
      secs
    ).padStart(2, 0)}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      alert('Session expired.');
    }
    time--;
  }
  tick();
  timer = setInterval(tick, 1000);
  return timer;
}

const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("income");
const moneyMinus = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("number");
const button = document.getElementById("btn");

const localStorageTransactions = JSON.parse(
    localStorage.getItem("transactions")
);

let transactions =
    localStorage.getItem("transactions") !== null
        ? localStorageTransactions
        : [];

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    item.innerHTML = `<h4>${transaction.text}</h4><span>${sign}$${Math.abs(
        transaction.amount
    )}<button class="delete-btn" onclick="removeTransaction(${
        transaction.id
    })"><i class="fa-solid fa-2x fa-trash"></i></button></span>`;
    list.appendChild(item);
}

function init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
}

function updateValues() {
    const amounts = transactions.map((transaction) => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter((item) => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (
        amounts
            .filter((item) => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);
    moneyPlus.innerHTML = `$${income}`;
    balance.innerHTML = `$${total}`;
    moneyMinus.innerHTML = `$${expense}`;
}

function addTransaction(e) {
    e.preventDefault();
    if (text.value.trim() == "" || amount.value.trim() == "")
        alert("Please Enter Text And Value");
    else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
        };
        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateLocalStorage();
        updateValues();
        text.value = "";
        amount.value = "";
    }
}

function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

init();

button.addEventListener("click", addTransaction);

function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    updateLocalStorage();
    init();
}

function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

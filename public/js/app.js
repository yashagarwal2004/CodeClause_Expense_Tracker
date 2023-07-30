// import {
//     createAuth0Client,
// } from "@auth0/auth0-spa-js";
// import { handleRedirectCallback } from "@auth0/auth0-spa-js";
// import { isAuthenticated } from "@auth0/auth0-spa-js";
// import { getTokenSilently, getUser } from "@auth0/auth0-spa-js";
// import { loginWithRedirect } from "@auth0/auth0-spa-js";
// import { logout } from "@auth0/auth0-spa-js";

let auth0Client = null;

const fetchAuthConfig = () => fetch("/auth_config.json");

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
    auth0Client = await auth0.createAuth0Client({
        domain: config.domain,
        clientId: config.clientId,
    });
};

window.onload = async () => {
    await configureClient();
    updateUI();
    const isAuthenticated = await auth0Client.isAuthenticated();
    if (isAuthenticated) {
        return;
    }
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        await auth0Client.handleRedirectCallback();
        updateUI();
        window.history.replaceState({}, document.title, "/");
    }
};

const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    document.getElementById("btn-logout").disabled = !isAuthenticated;
    document.getElementById("btn-login").disabled = isAuthenticated;
};

const login = async () => {
    await auth0Client.loginWithRedirect({
        authorizationParams: {
            redirect_uri: window.location.origin,
        },
    });
};

const logout = () => {
    auth0Client.logout({
        logoutParams: {
            returnTo: window.location.origin,
        },
    });
};

// // ----------------DOM Manipulation----------------
// const balance = document.getElementById("balance");
// const moneyPlus = document.getElementById("income");
// const moneyMinus = document.getElementById("expense");
// const list = document.getElementById("list");
// const form = document.getElementById("form");
// const text = document.getElementById("text");
// const amount = document.getElementById("number");
// const button = document.getElementById("btn");

// const localStorageTransactions = JSON.parse(
//     localStorage.getItem("transactions")
// );

// let transactions =
//     localStorage.getItem("transactions") !== null
//         ? localStorageTransactions
//         : [];

// function addTransactionDOM(transaction) {
//     const sign = transaction.amount < 0 ? "-" : "+";
//     const item = document.createElement("li");
//     item.classList.add(transaction.amount < 0 ? "minus" : "plus");
//     item.innerHTML = `<h4>${transaction.text}</h4><span>${sign}$${Math.abs(
//         transaction.amount
//     )}<button class="delete-btn" onclick="removeTransaction(${
//         transaction.id
//     })"><i class="fa-solid fa-2x fa-trash"></i></button></span>`;
//     list.appendChild(item);
// }

// function init() {
//     list.innerHTML = "";
//     transactions.forEach(addTransactionDOM);
//     updateValues();
// }

// function updateValues() {
//     const amounts = transactions.map((transaction) => transaction.amount);
//     const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
//     const income = amounts
//         .filter((item) => item > 0)
//         .reduce((acc, item) => (acc += item), 0)
//         .toFixed(2);
//     const expense = (
//         amounts
//             .filter((item) => item < 0)
//             .reduce((acc, item) => (acc += item), 0) * -1
//     ).toFixed(2);
//     moneyPlus.innerHTML = `$${income}`;
//     balance.innerHTML = `$${total}`;
//     moneyMinus.innerHTML = `$${expense}`;
// }

// function addTransaction(e) {
//     e.preventDefault();
//     if (text.value.trim() == "" || amount.value.trim() == "")
//         alert("Please Enter Text And Value");
//     else {
//         const transaction = {
//             id: generateID(),
//             text: text.value,
//             amount: +amount.value,
//         };
//         transactions.push(transaction);
//         addTransactionDOM(transaction);
//         updateLocalStorage();
//         updateValues();
//         text.value = "";
//         amount.value = "";
//     }
// }

// function generateID() {
//     return Math.floor(Math.random() * 1000000000);
// }

// init();

// button.addEventListener("click", addTransaction);

// function removeTransaction(id) {
//     transactions = transactions.filter((transaction) => transaction.id !== id);
//     updateLocalStorage();
//     init();
// }

// function updateLocalStorage() {
//     localStorage.setItem("transactions", JSON.stringify(transactions));
// }

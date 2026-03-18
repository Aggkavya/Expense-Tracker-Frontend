import { API_BASE_URL } from "./config";

const TOKEN_KEY = "finance-tracker-token";
const USER_KEY = "finance-tracker-user";
const BALANCE_KEY = "finance-tracker-balances";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const expenseCategories = [
  "FOOD",
  "STUDY",
  "TRAVEL",
  "MISCELLANEOUS",
  "SHOPPING",
  "ENTERTAINMENT",
  "HEALTH",
  "RENT",
  "BILLS",
  "OTHERS",
];

export const paymentModes = ["CASH", "ONLINE"];

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token, user = null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(BALANCE_KEY);
}

export function getStoredUser() {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function getStoredBalances() {
  const rawBalances = localStorage.getItem(BALANCE_KEY);

  if (!rawBalances) {
    return {
      cashInHand: null,
      bankBalance: null,
    };
  }

  try {
    return JSON.parse(rawBalances);
  } catch {
    return {
      cashInHand: null,
      bankBalance: null,
    };
  }
}

export function setStoredBalances(balances) {
  localStorage.setItem(BALANCE_KEY, JSON.stringify(balances));
}

function buildQuery(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

async function request(path, options = {}) {
  const { auth = true, body, headers = {}, ...restOptions } = options;
  const token = getToken();
  const finalHeaders = {
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };

  if (auth && token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...restOptions,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Unable to reach the API. If the backend is running, this is usually a CORS or API URL issue.",
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string" && payload) ||
      `Request failed with status ${response.status}.`;

    throw new ApiError(message, response.status);
  }

  return payload;
}

export function signup(payload) {
  return request("/public/signup", {
    method: "POST",
    auth: false,
    body: payload,
  });
}

export function login(payload) {
  return request("/public/login", {
    method: "POST",
    auth: false,
    body: payload,
  });
}

export function updateBalance(payload) {
  return request("/user/updateBalance", {
    method: "PUT",
    body: payload,
  });
}

export function getBalance() {
  return request("/user/getBalance");
}

export function createExpense(payload) {
  return request("/expense/newExpense", {
    method: "POST",
    body: payload,
  });
}

export function getAllExpenses() {
  return request("/expense/allExpenses");
}

export function getFilteredExpenses(filters) {
  return request(`/expense/filter${buildQuery(filters)}`);
}

export function getExpenseTotals(filters) {
  return request(`/expense/total${buildQuery(filters)}`);
}

export function deleteExpense(expenseId) {
  return request(`/expense/delete${buildQuery({ expenseId })}`, {
    method: "DELETE",
  });
}

export function createDebt(payload) {
  return request("/debt/newDebt", {
    method: "POST",
    body: payload,
  });
}

export function getAllDebts() {
  return request("/debt/allDebts");
}

export function payDebt(payload) {
  return request("/debt/pay", {
    method: "POST",
    body: payload,
  });
}

export function deleteDebt(debtId) {
  return request(`/debt/delete${buildQuery({ debtId })}`, {
    method: "DELETE",
  });
}

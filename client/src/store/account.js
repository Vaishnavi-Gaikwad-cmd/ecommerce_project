const ACCOUNTS_KEY = 'threadform_accounts';
const SESSION_KEY = 'threadform_session';

const read = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    return JSON.parse(window.localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value));
};

export const getAccounts = () => read(ACCOUNTS_KEY, []);
export const getSession = () => read(SESSION_KEY, null);
export const saveSession = (user) => write(SESSION_KEY, user);
export const clearSession = () => typeof window !== 'undefined' && window.localStorage.removeItem(SESSION_KEY);

export const findAccount = (email) => getAccounts().find((account) => account.email.toLowerCase() === email.toLowerCase());

export const saveAccount = (account) => {
  const accounts = getAccounts();
  const index = accounts.findIndex((entry) => entry.email.toLowerCase() === account.email.toLowerCase());
  if (index === -1) accounts.push(account);
  else accounts[index] = account;
  write(ACCOUNTS_KEY, accounts);
  saveSession({ role: 'customer', email: account.email, name: account.name });
};

export const updateAccount = (email, changes) => {
  const account = findAccount(email);
  if (!account) return null;
  const updated = { ...account, ...changes };
  saveAccount(updated);
  return updated;
};

export const updateAccountOrderStatus = (email, orderId, shipping) => {
  const account = findAccount(email);
  if (!account) return null;
  const orders = (account.orders || []).map((order) => order.id === orderId ? { ...order, shipping } : order);
  const updated = { ...account, orders };
  const accounts = getAccounts().map((entry) => entry.email.toLowerCase() === email.toLowerCase() ? updated : entry);
  write(ACCOUNTS_KEY, accounts);
  return updated;
};

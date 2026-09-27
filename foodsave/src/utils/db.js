import { format, differenceInDays } from 'date-fns';

const USERS_KEY = 'foodsave_users';
const CURRENT_USER_KEY = 'foodsave_current_user';
const FOODS_KEY = 'foodsave_foods';
const LEFTOVERS_KEY = 'foodsave_leftovers';
const MEALS_KEY = 'foodsave_meals';
const WASTE_KEY = 'foodsave_waste';

// --- AUTHENTICATION ---
export const registerUser = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find(u => u.email === email)) {
        throw new Error('Email already exists');
    }
    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
};

export const loginUser = (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        throw new Error('Invalid email or password');
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
};

export const logoutUser = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
};

// --- GENERIC GETTER/SETTER ---
const getItems = (key) => {
    const user = getCurrentUser();
    if (!user) return [];
    const allItems = JSON.parse(localStorage.getItem(key) || '[]');
    return allItems.filter(item => item.userId === user.id);
};

const addItem = (key, data) => {
    const user = getCurrentUser();
    if (!user) return null;
    const allItems = JSON.parse(localStorage.getItem(key) || '[]');
    const newItem = { id: Date.now().toString(), userId: user.id, ...data };
    allItems.push(newItem);
    localStorage.setItem(key, JSON.stringify(allItems));
    return newItem;
};

const updateItem = (key, id, updates) => {
    const allItems = JSON.parse(localStorage.getItem(key) || '[]');
    const index = allItems.findIndex(i => i.id === id);
    if (index > -1) {
        allItems[index] = { ...allItems[index], ...updates };
        localStorage.setItem(key, JSON.stringify(allItems));
    }
};

const deleteItem = (key, id) => {
    const allItems = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = allItems.filter(i => i.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
};

// --- FOOD INVENTORY ---
export const getFoods = () => getItems(FOODS_KEY);
export const addFood = (food) => addItem(FOODS_KEY, food);
export const removeFood = (id) => deleteItem(FOODS_KEY, id);

export const getFoodStatus = (expiryDateStr) => {
    const today = new Date();
    const expiry = new Date(expiryDateStr);
    const diff = differenceInDays(expiry, today);
    if (diff < 0) return 'Expired';
    if (diff <= 3) return 'Expiring Soon';
    return 'Safe';
};

// --- LEFTOVERS ---
export const getLeftovers = () => getItems(LEFTOVERS_KEY);
export const addLeftover = (leftover) => addItem(LEFTOVERS_KEY, { ...leftover, status: 'Available' });
export const updateLeftoverStatus = (id, status) => {
    updateItem(LEFTOVERS_KEY, id, { status });
    if (status === 'Wasted') {
        const leftovers = getItems(LEFTOVERS_KEY);
        const l = leftovers.find(x => x.id === id);
        if (l) {
            addWaste({ foodName: l.foodName, quantity: l.quantity, reason: 'Leftover wasted', date: new Date().toISOString() });
        }
    }
};
export const removeLeftover = (id) => deleteItem(LEFTOVERS_KEY, id);

// --- MEALS ---
export const getMeals = () => getItems(MEALS_KEY);
export const addMeal = (meal) => addItem(MEALS_KEY, meal);
export const removeMeal = (id) => deleteItem(MEALS_KEY, id);

// --- WASTE ---
export const getWasteRecords = () => getItems(WASTE_KEY);
export const addWaste = (waste) => addItem(WASTE_KEY, waste);

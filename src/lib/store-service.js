import { PRODUCT_CATALOG, enrichProductForUi } from "./product-ui-data";

const DB_STORAGE_KEY = "verdantcart-local-db-v1";

const createInitialDb = () => ({
  users: [],
  sessions: [],
  carts: {},
  wishlists: {},
  orders: {},
});

const getDb = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(DB_STORAGE_KEY) || "null");
    if (!parsed) {
      return createInitialDb();
    }
    return {
      users: parsed.users || [],
      sessions: parsed.sessions || [],
      carts: parsed.carts || {},
      wishlists: parsed.wishlists || {},
      orders: parsed.orders || {},
    };
  } catch {
    return createInitialDb();
  }
};

const setDb = (db) => {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
};

const makeId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
};

const createDetailError = (message) => {
  const error = new Error(message);
  error.response = { data: { detail: message } };
  return error;
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  created_at: user.created_at,
});

const getActiveToken = () => localStorage.getItem("store-auth-token");

const getUserFromToken = (db, token) => {
  if (!token) {
    throw createDetailError("Authentication required.");
  }

  const session = db.sessions.find((entry) => entry.token === token);
  if (!session) {
    throw createDetailError("Invalid or expired session.");
  }

  const user = db.users.find((entry) => entry.id === session.user_id);
  if (!user) {
    throw createDetailError("User not found.");
  }

  return user;
};

const buildCartResponse = (db, userId) => {
  const cartItems = db.carts[userId] || [];
  const productMap = new Map(PRODUCT_CATALOG.map((product) => [product.id, product]));

  let subtotal = 0;
  const items = cartItems
    .map((item) => {
      const product = productMap.get(item.product_id);
      if (!product) {
        return null;
      }

      const lineTotal = Number((product.price * item.quantity).toFixed(2));
      subtotal += lineTotal;

      return {
        product_id: product.id,
        name: product.name,
        image_url: product.image_url,
        price: product.price,
        quantity: item.quantity,
        line_total: lineTotal,
      };
    })
    .filter(Boolean);

  return {
    items,
    subtotal: Number(subtotal.toFixed(2)),
  };
};

export const listLocalProducts = async ({ search = "" } = {}) => {
  const keyword = search.trim().toLowerCase();
  if (!keyword) {
    return PRODUCT_CATALOG.map((product) => ({ ...product }));
  }

  return PRODUCT_CATALOG.filter((product) => {
    const haystack = `${product.name} ${product.description} ${product.badge}`.toLowerCase();
    return haystack.includes(keyword);
  }).map((product) => ({ ...product }));
};

export const getLocalProductById = async (productId) => {
  const product = PRODUCT_CATALOG.find((entry) => entry.id === productId);
  if (!product) {
    throw createDetailError("Product not found.");
  }
  return { ...product };
};

export const listLocalProductsByCategory = async (category) =>
  PRODUCT_CATALOG.filter((product) => product.category === category).map((product) => ({ ...product }));

export const registerLocalUser = async ({ name, email, password }) => {
  const db = getDb();
  const normalizedEmail = normalizeEmail(email);
  if (db.users.some((entry) => entry.email === normalizedEmail)) {
    throw createDetailError("Email already registered.");
  }

  const createdAt = new Date().toISOString();
  const user = {
    id: makeId(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    created_at: createdAt,
  };

  const token = makeId();
  db.users.push(user);
  db.sessions.push({ token, user_id: user.id, created_at: createdAt });
  setDb(db);

  return {
    token,
    user: toPublicUser(user),
  };
};

export const loginLocalUser = async ({ email, password }) => {
  const db = getDb();
  const normalizedEmail = normalizeEmail(email);
  const user = db.users.find((entry) => entry.email === normalizedEmail);

  if (!user || user.password !== password) {
    throw createDetailError("Invalid email or password.");
  }

  const token = makeId();
  db.sessions.push({ token, user_id: user.id, created_at: new Date().toISOString() });
  setDb(db);

  return {
    token,
    user: toPublicUser(user),
  };
};

export const logoutLocalUser = async (token) => {
  const db = getDb();
  db.sessions = db.sessions.filter((entry) => entry.token !== token);
  setDb(db);
};

export const getCurrentLocalUser = async (token) => {
  const db = getDb();
  const user = getUserFromToken(db, token);
  return toPublicUser(user);
};

export const getLocalCart = async () => {
  const db = getDb();
  const user = getUserFromToken(db, getActiveToken());
  return buildCartResponse(db, user.id);
};

export const addLocalCartItem = async ({ product_id, quantity }) => {
  const db = getDb();
  const user = getUserFromToken(db, getActiveToken());
  const product = PRODUCT_CATALOG.find((entry) => entry.id === product_id);
  if (!product) {
    throw createDetailError("Product not found.");
  }

  const userCart = db.carts[user.id] || [];
  const existing = userCart.find((entry) => entry.product_id === product_id);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, 20);
  } else {
    userCart.push({ product_id, quantity: Math.min(Math.max(quantity, 1), 20) });
  }

  db.carts[user.id] = userCart;
  setDb(db);
  return buildCartResponse(db, user.id);
};

export const updateLocalCartItemQuantity = async (productId, quantity) => {
  const db = getDb();
  const user = getUserFromToken(db, getActiveToken());
  const userCart = db.carts[user.id] || [];
  const target = userCart.find((entry) => entry.product_id === productId);
  if (!target) {
    throw createDetailError("Cart item not found.");
  }
  target.quantity = Math.min(Math.max(quantity, 1), 20);

  db.carts[user.id] = userCart;
  setDb(db);
  return buildCartResponse(db, user.id);
};

export const removeLocalCartItem = async (productId) => {
  const db = getDb();
  const user = getUserFromToken(db, getActiveToken());
  const userCart = db.carts[user.id] || [];
  db.carts[user.id] = userCart.filter((entry) => entry.product_id !== productId);
  setDb(db);
  return buildCartResponse(db, user.id);
};

export const getLocalWishlist = async () => {
  const db = getDb();
  const user = getUserFromToken(db, getActiveToken());
  const productIds = db.wishlists[user.id] || [];

  const items = productIds
    .map((productId) => PRODUCT_CATALOG.find((product) => product.id === productId))
    .filter(Boolean)
    .map((product) => ({ ...product }));

  return { items };
};

export const addLocalWishlistItem = async ({ product_id }) => {
  const db = getDb();
  const user = getUserFromToken(db, getActiveToken());
  const product = PRODUCT_CATALOG.find((entry) => entry.id === product_id);
  if (!product) {
    throw createDetailError("Product not found.");
  }

  const productIds = db.wishlists[user.id] || [];
  if (!productIds.includes(product_id)) {
    productIds.push(product_id);
  }

  db.wishlists[user.id] = productIds;
  setDb(db);

  return getLocalWishlist();
};

export const removeLocalWishlistItem = async (productId) => {
  const db = getDb();
  const user = getUserFromToken(db, getActiveToken());
  const productIds = db.wishlists[user.id] || [];
  db.wishlists[user.id] = productIds.filter((entry) => entry !== productId);
  setDb(db);
  return getLocalWishlist();
};

export const placeLocalOrder = async ({ shipping_address }) => {
  const db = getDb();
  const user = getUserFromToken(db, getActiveToken());
  const cart = buildCartResponse(db, user.id);
  if (!cart.items.length) {
    throw createDetailError("Cart is empty.");
  }

  const order = {
    id: makeId(),
    order_number: `ORD-${new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}-${makeId().slice(0, 6).toUpperCase()}`,
    items: cart.items,
    total_amount: cart.subtotal,
    status: "Placed",
    shipping_address: shipping_address.trim(),
    created_at: new Date().toISOString(),
  };

  const userOrders = db.orders[user.id] || [];
  userOrders.unshift(order);
  db.orders[user.id] = userOrders;
  db.carts[user.id] = [];
  setDb(db);

  return order;
};

export const listLocalOrders = async () => {
  const db = getDb();
  const user = getUserFromToken(db, getActiveToken());
  return (db.orders[user.id] || []).map((order) => ({ ...order }));
};

export const getLocalEnrichedProducts = async ({ search = "" } = {}) => {
  const products = await listLocalProducts({ search });
  return products.map(enrichProductForUi);
};

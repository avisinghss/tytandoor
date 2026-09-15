// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { initialCategories, initialProducts } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const hasValidCredentials = isValidUrl(supabaseUrl) && Boolean(supabaseAnonKey);

function createMockStore() {
  const storagePrefix = 'tytan_mock_db_';

  const getTableData = (table) => {
    try {
      const stored = localStorage.getItem(`${storagePrefix}${table}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore localStorage errors
    }

    if (table === 'products') return [...initialProducts];
    if (table === 'categories') return [...initialCategories];
    if (table === 'staff') {
      return [
        { id: 1, name: 'Anil Kumar', role: 'Founder & Director', phone: '+91 9876543210', email: 'anil@tytandoor.com', created_at: new Date().toISOString() },
        { id: 2, name: 'Vikram Singh', role: 'Production Head', phone: '+91 9876543211', email: 'vikram@tytandoor.com', created_at: new Date().toISOString() },
      ];
    }
    if (table === 'projects') {
      return [
        { id: 1, title: 'Luxury Villa Residency', location: 'Ballia, UP', image: '/images/products/product-1.jpg', created_at: new Date().toISOString() },
        { id: 2, title: 'Commercial Plaza Suites', location: 'Varanasi, UP', image: '/images/products/product-2.jpg', created_at: new Date().toISOString() },
      ];
    }
    if (table === 'admin_users') {
      return [
        { user_id: 'admin-user-1' },
        { user_id: 'admin-mock-id' },
      ];
    }
    return [];
  };

  const saveTableData = (table, data) => {
    try {
      localStorage.setItem(`${storagePrefix}${table}`, JSON.stringify(data));
    } catch {
      // Ignore localStorage errors
    }
  };

  class MockQueryBuilder {
    constructor(tableName) {
      this.table = tableName;
      this.filters = [];
      this.orders = [];
      this.limitCount = null;
      this.insertedRows = null;
    }

    select(_columns = '*') {
      return this;
    }

    eq(column, value) {
      this.filters.push((item) => {
        const itemVal = item[column];
        if (typeof itemVal === 'string' && typeof value === 'string') {
          return itemVal.toLowerCase() === value.toLowerCase();
        }
        return itemVal == value;
      });
      return this;
    }

    order(column, { ascending = true } = {}) {
      this.orders.push({ column, ascending });
      return this;
    }

    limit(count) {
      this.limitCount = count;
      return this;
    }

    insert(rows) {
      const current = getTableData(this.table);
      const rowArray = Array.isArray(rows) ? rows : [rows];
      const newItems = rowArray.map((r, idx) => ({
        id: r.id || Date.now() + idx,
        created_at: r.created_at || new Date().toISOString(),
        status: r.status || 'NEW',
        ...r,
      }));
      const updated = [...newItems, ...current];
      saveTableData(this.table, updated);
      this.insertedRows = newItems;
      return this;
    }

    update(values) {
      const current = getTableData(this.table);
      const updated = current.map((item) => {
        const matches = this.filters.every((fn) => fn(item));
        return matches ? { ...item, ...values } : item;
      });
      saveTableData(this.table, updated);
      return this;
    }

    delete() {
      const current = getTableData(this.table);
      const updated = current.filter((item) => !this.filters.every((fn) => fn(item)));
      saveTableData(this.table, updated);
      return this;
    }

    async then(resolve, reject) {
      try {
        if (this.insertedRows) {
          return resolve({ data: this.insertedRows, error: null });
        }

        let result = getTableData(this.table);

        for (const filterFn of this.filters) {
          result = result.filter(filterFn);
        }

        for (const ord of this.orders) {
          result.sort((a, b) => {
            const valA = a[ord.column] ?? '';
            const valB = b[ord.column] ?? '';
            if (valA < valB) return ord.ascending ? -1 : 1;
            if (valA > valB) return ord.ascending ? 1 : -1;
            return 0;
          });
        }

        if (this.limitCount !== null) {
          result = result.slice(0, this.limitCount);
        }

        return resolve({ data: result, error: null });
      } catch (err) {
        if (reject) reject(err);
        return resolve({ data: [], error: err });
      }
    }

    async single() {
      const { data, error } = await this;
      return { data: data && data.length > 0 ? data[0] : null, error };
    }

    async maybeSingle() {
      const { data, error } = await this;
      return { data: data && data.length > 0 ? data[0] : null, error };
    }
  }

  const authListeners = new Set();
  const defaultUser = {
    id: 'admin-mock-id',
    email: 'admin@tytandoor.com',
    role: 'authenticated',
  };
  const defaultSession = {
    access_token: 'mock-token',
    user: defaultUser,
  };

  const getStoredAuth = () => {
    try {
      const val = localStorage.getItem('tytan_mock_session');
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  };

  const setStoredAuth = (session) => {
    try {
      if (session) localStorage.setItem('tytan_mock_session', JSON.stringify(session));
      else localStorage.removeItem('tytan_mock_session');
    } catch {
      // Ignore localStorage errors
    }
  };

  const mockClient = {
    from(tableName) {
      return new MockQueryBuilder(tableName);
    },
    auth: {
      async getSession() {
        const session = getStoredAuth();
        return { data: { session }, error: null };
      },
      onAuthStateChange(callback) {
        authListeners.add(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => authListeners.delete(callback),
            },
          },
        };
      },
      async signInWithPassword({ email }) {
        const session = {
          access_token: 'mock-token-' + Date.now(),
          user: {
            id: 'admin-user-1',
            email: email || 'admin@tytandoor.com',
            role: 'authenticated',
          },
        };
        setStoredAuth(session);
        authListeners.forEach((cb) => cb('SIGNED_IN', session));
        return { data: { session, user: session.user }, error: null };
      },
      async signOut() {
        setStoredAuth(null);
        authListeners.forEach((cb) => cb('SIGNED_OUT', null));
        return { error: null };
      },
      async resetPasswordForEmail() {
        return { error: null };
      },
    },
    channel(channelName) {
      return {
        on(_event, _filter, _callback) {
          return this;
        },
        subscribe(callback) {
          if (callback) setTimeout(() => callback('SUBSCRIBED'), 10);
          return this;
        },
      };
    },
    removeChannel() {},
  };

  return mockClient;
}

export const supabase = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockStore();

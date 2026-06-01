import { jwtDecode } from "jwt-decode";
import { demoAccounts, buildDemoData } from "./demoData";
import { getPk } from "./schema";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

const DB_KEY = "ddpu_cloud_demo_db";
const SESSION_KEY = "ddpu_cloud_demo_session";
const DEMO_ACCOUNTS_KEY = "ddpu_cloud_demo_accounts";

const accountAvatarByRole = {
  student: "/images/avatar-student.svg",
  teacher: "/images/avatar-teacher.svg",
  admin: "/images/avatar-admin.svg",
};

function readDemoDb() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) return JSON.parse(raw);
  const db = buildDemoData();
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
}

function writeDemoDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function readDemoAccounts() {
  const raw = localStorage.getItem(DEMO_ACCOUNTS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify(demoAccounts));
  return [...demoAccounts];
}

function writeDemoAccounts(accounts) {
  localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function base64Url(value) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function createDemoJwt(profile) {
  const header = base64Url(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    sub: profile.id,
    email: profile.email,
    role: profile.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  }));
  return `${header}.${payload}.demo`;
}

function enrichSession(profile, token) {
  return {
    user: {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
    },
    token,
    claims: jwtDecode(token),
    demo: !isSupabaseConfigured,
  };
}

async function createAccountViaVercelApi(account) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error("Потрібна авторизація адміністратора.");

  const response = await fetch("/api/admin-create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(account),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Не вдалося створити обліковий запис.");
  }
  return data;
}

export const repository = {
  mode: isSupabaseConfigured ? "supabase" : "demo",

  async signIn(email, password) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      const profile = await this.getProfile(data.user.id);
      return enrichSession(profile, data.session.access_token);
    }

    const account = readDemoAccounts().find((item) => item.email === email && item.password === password);
    if (!account) throw new Error("Невірна електронна пошта або пароль.");
    const profile = readDemoDb().profiles.find((item) => item.id === account.profileId);
    const session = enrichSession(profile, createDemoJwt(profile));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async restoreSession() {
    if (isSupabaseConfigured) {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return null;
      const profile = await this.getProfile(data.session.user.id);
      return enrichSession(profile, data.session.access_token);
    }
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  async signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
      return;
    }
    localStorage.removeItem(SESSION_KEY);
  },

  async getProfile(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
      if (error) throw new Error(error.message);
      return data;
    }
    return readDemoDb().profiles.find((item) => item.id === id);
  },

  async list(resource) {
    if (isSupabaseConfigured) {
      const pk = getPk(resource);
      const { data, error } = await supabase.from(resource).select("*").order(pk, { ascending: true });
      if (error) throw new Error(error.message);
      return data || [];
    }
    return [...(readDemoDb()[resource] || [])];
  },

  async get(resource, id) {
    const pk = getPk(resource);
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from(resource).select("*").eq(pk, id).single();
      if (error) throw new Error(error.message);
      return data;
    }
    return readDemoDb()[resource]?.find((item) => String(item[pk]) === String(id)) || null;
  },

  async create(resource, values) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from(resource).insert(values).select().single();
      if (error) throw new Error(error.message);
      return data;
    }
    const db = readDemoDb();
    const pk = getPk(resource);
    const rows = db[resource] || [];
    const nextId = pk === "id" ? crypto.randomUUID() : Math.max(0, ...rows.map((item) => Number(item[pk]) || 0)) + 1;
    const row = { [pk]: nextId, ...values };
    rows.push(row);
    db[resource] = rows;
    writeDemoDb(db);
    return row;
  },

  async createWithAccount(resource, values, account) {
    if (isSupabaseConfigured) {
      const data = await createAccountViaVercelApi(account);
      if (!data?.profile?.id) throw new Error("Не вдалося створити профіль користувача.");

      const row = await this.create(resource, {
        ...values,
        profile_id: data.profile.id,
        Email: data.profile.email,
      });
      return { row, profile: data.profile };
    }

    const db = readDemoDb();
    const accounts = readDemoAccounts();
    if (accounts.some((item) => item.email.toLowerCase() === account.email.toLowerCase())) {
      throw new Error("Користувач із такою електронною поштою вже існує.");
    }

    const profile = {
      id: crypto.randomUUID(),
      full_name: account.full_name,
      email: account.email,
      role: account.role,
      phone: account.phone || null,
      avatar_url: accountAvatarByRole[account.role] || "",
    };
    db.profiles.push(profile);
    accounts.push({
      email: account.email,
      password: account.password,
      role: account.role,
      profileId: profile.id,
    });

    const pk = getPk(resource);
    const rows = db[resource] || [];
    const nextId = Math.max(0, ...rows.map((item) => Number(item[pk]) || 0)) + 1;
    const row = {
      [pk]: nextId,
      ...values,
      profile_id: profile.id,
      Email: profile.email,
    };
    rows.push(row);
    db[resource] = rows;
    writeDemoDb(db);
    writeDemoAccounts(accounts);
    return { row, profile };
  },

  async update(resource, id, values) {
    const pk = getPk(resource);
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from(resource).update(values).eq(pk, id).select().single();
      if (error) throw new Error(error.message);
      return data;
    }
    const db = readDemoDb();
    db[resource] = db[resource].map((item) => (String(item[pk]) === String(id) ? { ...item, ...values } : item));
    writeDemoDb(db);
    return db[resource].find((item) => String(item[pk]) === String(id));
  },

  async remove(resource, id) {
    const pk = getPk(resource);
    if (isSupabaseConfigured) {
      const { error } = await supabase.from(resource).delete().eq(pk, id);
      if (error) throw new Error(error.message);
      return true;
    }
    const db = readDemoDb();
    db[resource] = db[resource].filter((item) => String(item[pk]) !== String(id));
    writeDemoDb(db);
    return true;
  },
};

import { createClient } from "@supabase/supabase-js";

function response(status, body, headers = {}) {
  return { status, body, headers };
}

function envValue(env, name, fallbackName) {
  return env?.[name] || (fallbackName ? env?.[fallbackName] : undefined);
}

function bearerToken(headers = {}) {
  const authorization = headers.authorization || headers.Authorization || "";
  return String(authorization).replace(/^Bearer\s+/i, "").trim();
}

function normalizeBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

export async function createAdminUser({ method, headers, body, env }) {
  if (method === "OPTIONS") {
    return response(204, null, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    });
  }

  if (method !== "POST") {
    return response(405, { message: "Метод не підтримується." });
  }

  const supabaseUrl = envValue(env, "SUPABASE_URL", "VITE_SUPABASE_URL");
  const anonKey = envValue(env, "SUPABASE_ANON_KEY", "VITE_SUPABASE_ANON_KEY");
  const serviceRoleKey = envValue(env, "SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return response(500, { message: "Не налаштовані змінні середовища для створення акаунтів." });
  }

  const token = bearerToken(headers);
  if (!token) {
    return response(401, { message: "Потрібна авторизація адміністратора." });
  }

  const values = normalizeBody(body);
  const email = String(values.email || "").trim().toLowerCase();
  const password = String(values.password || "");
  const role = String(values.role || "");
  const fullName = String(values.full_name || "").trim();
  const phone = values.phone ? String(values.phone).trim() : null;

  if (!["student", "teacher"].includes(role)) {
    return response(400, { message: "Дозволено створювати тільки студентів або викладачів." });
  }
  if (!email || !password || !fullName) {
    return response(400, { message: "Заповніть email, пароль і ПІБ." });
  }
  if (password.length < 8) {
    return response(400, { message: "Пароль має містити не менше 8 символів." });
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: authData, error: authError } = await userClient.auth.getUser(token);
  if (authError || !authData.user) {
    return response(401, { message: "Потрібна авторизація адміністратора." });
  }

  const { data: callerProfile, error: profileError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profileError || callerProfile?.role !== "admin") {
    return response(403, { message: "Недостатньо прав для створення користувача." });
  }

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingProfile) {
    return response(409, { message: "Користувач із такою електронною поштою вже існує." });
  }

  const { data: createdUser, error: createUserError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role,
    },
  });

  if (createUserError || !createdUser.user) {
    return response(400, { message: createUserError?.message || "Не вдалося створити користувача." });
  }

  const profileValues = {
    id: createdUser.user.id,
    full_name: fullName,
    email,
    role,
    phone,
    avatar_url: role === "teacher" ? "/images/avatar-teacher.svg" : "/images/avatar-student.svg",
  };

  const { data: profile, error: insertProfileError } = await admin
    .from("profiles")
    .insert(profileValues)
    .select()
    .single();

  if (insertProfileError) {
    await admin.auth.admin.deleteUser(createdUser.user.id);
    return response(400, { message: insertProfileError.message });
  }

  return response(200, { profile });
}

import { createClient } from "@supabase/supabase-js";

function send(response, status, body) {
  response.status(status).json(body);
}

function envValue(name, fallbackName) {
  return process.env[name] || (fallbackName ? process.env[fallbackName] : undefined);
}

function bearerToken(request) {
  const authorization = request.headers.authorization || "";
  return authorization.replace(/^Bearer\s+/i, "").trim();
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return send(response, 405, { message: "Метод не підтримується." });
  }

  const supabaseUrl = envValue("SUPABASE_URL", "VITE_SUPABASE_URL");
  const anonKey = envValue("SUPABASE_ANON_KEY", "VITE_SUPABASE_ANON_KEY");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return send(response, 500, { message: "Не налаштовані змінні середовища для створення акаунтів." });
  }

  const token = bearerToken(request);
  if (!token) {
    return send(response, 401, { message: "Потрібна авторизація адміністратора." });
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: authData, error: authError } = await userClient.auth.getUser(token);
  if (authError || !authData.user) {
    return send(response, 401, { message: "Потрібна авторизація адміністратора." });
  }

  const { data: callerProfile, error: profileError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profileError || callerProfile?.role !== "admin") {
    return send(response, 403, { message: "Недостатньо прав для створення користувача." });
  }

  const email = String(request.body?.email || "").trim().toLowerCase();
  const password = String(request.body?.password || "");
  const role = String(request.body?.role || "");
  const fullName = String(request.body?.full_name || "").trim();
  const phone = request.body?.phone ? String(request.body.phone).trim() : null;

  if (!["student", "teacher"].includes(role)) {
    return send(response, 400, { message: "Дозволено створювати тільки студентів або викладачів." });
  }
  if (!email || !password || !fullName) {
    return send(response, 400, { message: "Заповніть email, пароль і ПІБ." });
  }
  if (password.length < 8) {
    return send(response, 400, { message: "Пароль має містити не менше 8 символів." });
  }

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingProfile) {
    return send(response, 409, { message: "Користувач із такою електронною поштою вже існує." });
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
    return send(response, 400, { message: createUserError?.message || "Не вдалося створити користувача." });
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
    return send(response, 400, { message: insertProfileError.message });
  }

  return send(response, 200, { profile });
}

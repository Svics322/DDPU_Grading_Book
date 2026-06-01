import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ message: "Метод не підтримується." }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ message: "Не налаштовані змінні середовища Supabase." }, 500);
  }

  const authorization = request.headers.get("Authorization") || "";
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: authData, error: authError } = await userClient.auth.getUser();
  if (authError || !authData.user) {
    return jsonResponse({ message: "Потрібна авторизація адміністратора." }, 401);
  }

  const { data: callerProfile, error: profileError } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profileError || callerProfile?.role !== "admin") {
    return jsonResponse({ message: "Недостатньо прав для створення користувача." }, 403);
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  const role = String(body?.role || "");
  const fullName = String(body?.full_name || "").trim();
  const phone = body?.phone ? String(body.phone).trim() : null;

  if (!["student", "teacher"].includes(role)) {
    return jsonResponse({ message: "Дозволено створювати тільки студентів або викладачів." }, 400);
  }
  if (!email || !password || !fullName) {
    return jsonResponse({ message: "Заповніть email, пароль і ПІБ." }, 400);
  }
  if (password.length < 8) {
    return jsonResponse({ message: "Пароль має містити не менше 8 символів." }, 400);
  }

  const { data: existingProfile } = await adminClient
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingProfile) {
    return jsonResponse({ message: "Користувач із такою електронною поштою вже існує." }, 409);
  }

  const { data: createdUser, error: createUserError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role,
    },
  });

  if (createUserError || !createdUser.user) {
    return jsonResponse({ message: createUserError?.message || "Не вдалося створити користувача." }, 400);
  }

  const profileValues = {
    id: createdUser.user.id,
    full_name: fullName,
    email,
    role,
    phone,
    avatar_url: role === "teacher" ? "/images/avatar-teacher.svg" : "/images/avatar-student.svg",
  };

  const { data: profile, error: insertProfileError } = await adminClient
    .from("profiles")
    .insert(profileValues)
    .select()
    .single();

  if (insertProfileError) {
    await adminClient.auth.admin.deleteUser(createdUser.user.id);
    return jsonResponse({ message: insertProfileError.message }, 400);
  }

  return jsonResponse({ profile });
});

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env")) {
  const lines = readFileSync(".env", "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const accounts = [
  {
    email: "admin@ddpu.edu.ua",
    password: "Admin2026!",
    role: "admin",
    full_name: "Адміністратор системи",
    phone: "+380501112233",
    avatar_url: "/images/avatar-admin.svg",
  },
  {
    email: "teacher.shevchenko@ddpu.edu.ua",
    password: "Teacher2026!",
    role: "teacher",
    full_name: "Шевченко Олена Петрівна",
    phone: "+380671112244",
    avatar_url: "/images/avatar-teacher.svg",
    teacherEmail: "teacher.shevchenko@ddpu.edu.ua",
  },
  {
    email: "teacher.kovalenko@ddpu.edu.ua",
    password: "Teacher2026!",
    role: "teacher",
    full_name: "Коваленко Андрій Ігорович",
    phone: "+380671112255",
    avatar_url: "/images/avatar-teacher.svg",
    teacherEmail: "teacher.kovalenko@ddpu.edu.ua",
  },
  {
    email: "teacher.melnyk@ddpu.edu.ua",
    password: "Teacher2026!",
    role: "teacher",
    full_name: "Мельник Ірина Василівна",
    phone: "+380671112266",
    avatar_url: "/images/avatar-teacher.svg",
    teacherEmail: "teacher.melnyk@ddpu.edu.ua",
  },
  {
    email: "student.buryk@ddpu.edu.ua",
    password: "Student2026!",
    role: "student",
    full_name: "Бурик Назар Орестович",
    phone: "+380931112277",
    avatar_url: "/images/avatar-student.svg",
    studentEmail: "student.buryk@ddpu.edu.ua",
  },
  {
    email: "student.yurkiv@ddpu.edu.ua",
    password: "Student2026!",
    role: "student",
    full_name: "Юрків Віталій Романович",
    phone: "+380931112288",
    avatar_url: "/images/avatar-student.svg",
    studentEmail: "student.yurkiv@ddpu.edu.ua",
  },
  {
    email: "student.kuchera@ddpu.edu.ua",
    password: "Student2026!",
    role: "student",
    full_name: "Кучера Ростислав Миколайович",
    phone: "+380931112299",
    avatar_url: "/images/avatar-student.svg",
    studentEmail: "student.kuchera@ddpu.edu.ua",
  },
];

async function findUserByEmail(email) {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;
  return data.users.find((user) => user.email === email);
}

async function ensureUser(account) {
  const existing = await findUserByEmail(account.email);
  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: { full_name: account.full_name, role: account.role },
    });
    if (error) throw error;
    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: { full_name: account.full_name, role: account.role },
  });
  if (error) throw error;
  return data.user;
}

for (const account of accounts) {
  const user = await ensureUser(account);
  const profile = {
    id: user.id,
    full_name: account.full_name,
    email: account.email,
    role: account.role,
    phone: account.phone,
    avatar_url: account.avatar_url,
  };

  const { error: profileError } = await supabase.from("profiles").upsert(profile, { onConflict: "id" });
  if (profileError) throw profileError;

  if (account.teacherEmail) {
    const { error } = await supabase.from("teachers").update({ profile_id: user.id }).eq("Email", account.teacherEmail);
    if (error) throw error;
  }

  if (account.studentEmail) {
    const { error } = await supabase.from("students").update({ profile_id: user.id }).eq("Email", account.studentEmail);
    if (error) throw error;
  }

  console.log(`${account.role}: ${account.email} / ${account.password}`);
}

console.log("Seed users completed.");

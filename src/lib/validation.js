import { resources } from "./schema";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-\s0-9]{7,20}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const ACCOUNT_PASSWORD_FIELD = "AccountPassword";

export function validateEntity(resource, values, options = {}) {
  const config = resources[resource];
  const errors = {};

  if (!config) {
    return { valid: false, errors: { _form: "Невідома таблиця." } };
  }

  Object.entries(config.fields).forEach(([name, rule]) => {
    const value = values?.[name];
    const empty = value === undefined || value === null || String(value).trim() === "";

    if (rule.required && empty) {
      errors[name] = rule.ref ? "Оберіть значення зі списку." : "Заповніть поле.";
      return;
    }

    if (empty) {
      return;
    }

    if (["int", "year"].includes(rule.type)) {
      const number = Number(value);
      if (!Number.isInteger(number)) {
        errors[name] = "Введіть ціле число.";
        return;
      }
      if (rule.min !== undefined && number < rule.min) errors[name] = `Значення має бути не менше ${rule.min}.`;
      if (rule.max !== undefined && number > rule.max) errors[name] = `Значення має бути не більше ${rule.max}.`;
    }

    if (rule.type === "string" || rule.type === "role") {
      const text = String(value).trim();
      if (rule.min && text.length < rule.min) errors[name] = `Поле має містити не менше ${rule.min} символів.`;
      if (rule.max && text.length > rule.max) errors[name] = `Поле має містити не більше ${rule.max} символів.`;
    }

    if (rule.type === "email" && !EMAIL_RE.test(String(value).trim())) {
      errors[name] = "Введіть коректну електронну пошту.";
    }

    if (rule.type === "phone" && !PHONE_RE.test(String(value).trim())) {
      errors[name] = "Введіть коректний номер телефону.";
    }

    if (rule.type === "date" && Number.isNaN(Date.parse(value))) {
      errors[name] = "Введіть коректну дату.";
    }

    if (rule.type === "uuid" && value && !UUID_RE.test(String(value))) {
      errors[name] = "Невірний ідентифікатор профілю.";
    }
  });

  if (options.requireAccountPassword) {
    const email = values?.Email;
    const password = values?.[ACCOUNT_PASSWORD_FIELD];
    if (email === undefined || email === null || String(email).trim() === "") {
      errors.Email = "Введіть електронну пошту для облікового запису.";
    }
    if (password === undefined || password === null || String(password).trim() === "") {
      errors[ACCOUNT_PASSWORD_FIELD] = "Введіть пароль облікового запису.";
    } else if (String(password).length < 8) {
      errors[ACCOUNT_PASSWORD_FIELD] = "Пароль має містити не менше 8 символів.";
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function finalFormValidate(resource, options = {}) {
  return (values) => validateEntity(resource, values, options).errors;
}

export function normalizeEntityValues(resource, values) {
  const config = resources[resource];
  return Object.fromEntries(
    Object.entries(values).filter(([key]) => config?.fields?.[key]).map(([key, value]) => {
      const type = config?.fields?.[key]?.type;
      if (value === "") return [key, null];
      if (["int", "year"].includes(type)) return [key, Number(value)];
      if (type === "boolean") return [key, Boolean(value)];
      return [key, value];
    }),
  );
}

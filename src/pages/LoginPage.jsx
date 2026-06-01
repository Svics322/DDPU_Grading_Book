import { FORM_ERROR } from "final-form";
import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { signIn } from "../features/auth/authSlice";
import { demoAccounts } from "../lib/demoData";
import { ROLE_LABELS } from "../lib/schema";

function loginValidate(values) {
  const errors = {};
  if (!values.email) errors.email = "Введіть електронну пошту.";
  if (!values.password) errors.password = "Введіть пароль.";
  return errors;
}

export function LoginPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  if (user) return <Navigate to={location.state?.from || "/dashboard"} replace />;

  async function handleSubmit(values) {
    try {
      await dispatch(signIn(values)).unwrap();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
    return undefined;
  }

  return (
    <div className="login-page">
      <section className="login-visual">
        <img src="/images/classroom.svg" alt="" />
        <div>
          <h1>DDPU Cloud</h1>
        </div>
      </section>
      <section className="login-panel">
        <div className="section-heading">
          <KeyRound size={24} />
          <div>
            <h2>Авторизація</h2>
          </div>
        </div>

        <Form
          onSubmit={handleSubmit}
          validate={loginValidate}
          initialValues={{ email: "admin@ddpu.edu.ua", password: "Admin2026!" }}
          render={({ handleSubmit, submitting, submitError, form }) => (
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <Field name="email">
                {({ input, meta }) => (
                  <label className="field">
                    <span>Електронна пошта</span>
                    <input {...input} type="email" />
                    {meta.touched && meta.error && <small>{meta.error}</small>}
                  </label>
                )}
              </Field>
              <Field name="password">
                {({ input, meta }) => (
                  <label className="field">
                    <span>Пароль</span>
                    <input {...input} type="password" />
                    {meta.touched && meta.error && <small>{meta.error}</small>}
                  </label>
                )}
              </Field>
              {submitError && <p className="form-error">{submitError}</p>}
              <button type="submit" className="button primary full-button" disabled={submitting}>Увійти</button>
              <div className="account-grid">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    className="account-chip"
                    onClick={() => form.change("email", account.email) || form.change("password", account.password)}
                  >
                    <span>{ROLE_LABELS[account.role]}</span>
                    {account.email}
                  </button>
                ))}
              </div>
            </form>
          )}
        />
      </section>
    </div>
  );
}

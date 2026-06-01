import { Field, Form } from "react-final-form";
import { finalFormValidate } from "../lib/validation";
import { ROLE_LABELS, resources } from "../lib/schema";
import { labelFor } from "../lib/formatters";
import { CustomSelect } from "./CustomSelect";

function renderInput({ input, meta, label, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...input} type={type} />
      {meta.touched && meta.error && <small>{meta.error}</small>}
    </label>
  );
}

function renderSelect({ input, meta, label, options, placeholder = "Оберіть значення" }) {
  return (
    <CustomSelect
      label={label}
      value={input.value}
      options={options}
      placeholder={placeholder}
      onChange={(nextValue) => input.onChange(nextValue)}
      error={meta.touched ? meta.error : ""}
    />
  );
}

function renderCheckbox({ input, label }) {
  return (
    <label className="check-field">
      <input {...input} type="checkbox" checked={Boolean(input.value)} />
      <span>{label}</span>
    </label>
  );
}

export function EntityForm({ resource, initialValues, db, onSubmit, submitLabel }) {
  const config = resources[resource];

  return (
    <Form
      initialValues={initialValues}
      validate={finalFormValidate(resource)}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, submitError }) => (
        <form className="entity-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {Object.entries(config.fields).map(([name, rule]) => {
              if (rule.ref) {
                const options = (db[rule.ref] || []).map((row) => ({
                  value: row[resources[rule.ref].pk],
                  label: labelFor(rule.ref, row, db),
                }));
                return <Field key={name} name={name} label={rule.label} options={options} component={renderSelect} />;
              }

              if (rule.type === "role") {
                const options = Object.entries(ROLE_LABELS)
                  .filter(([role]) => role !== "guest")
                  .map(([role, label]) => ({ value: role, label }));
                return <Field key={name} name={name} label={rule.label} options={options} component={renderSelect} />;
              }

              if (rule.type === "boolean") {
                return <Field key={name} name={name} label={rule.label} type="checkbox" component={renderCheckbox} />;
              }

              const inputType = rule.type === "date" ? "date" : rule.type === "email" ? "email" : rule.type === "int" || rule.type === "year" ? "number" : "text";
              return <Field key={name} name={name} label={rule.label} type={inputType} component={renderInput} />;
            })}
          </div>
          {submitError && <p className="form-error">{submitError}</p>}
          <div className="form-actions">
            <button type="submit" className="button primary" disabled={submitting}>{submitLabel}</button>
          </div>
        </form>
      )}
    />
  );
}

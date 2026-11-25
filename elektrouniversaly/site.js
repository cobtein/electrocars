"use strict";

const form = document.querySelector("#registration-form");
const submitButton = document.querySelector("#submit-registration");
const result = document.querySelector("#registration-result");
const status = document.querySelector("#registration-status");
const guestName = document.querySelector("#guest-name");
const email = document.querySelector("#guest-email");
const consent = document.querySelector("#demo-consent");
const nameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const consentError = document.querySelector("#consent-error");

function recordDemoEvent(event, details = {}) {
  window.dataLayer ??= [];
  window.dataLayer.push({ event, demo: true, ...details });
}

function showError(field, error, message) {
  error.textContent = message;
  error.hidden = !message;
  if (message) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
}

submitButton.disabled = false;
recordDemoEvent("page_view");

for (const link of document.querySelectorAll(".cta-text")) {
  link.addEventListener("click", () => {
    recordDemoEvent("registration_cta_click", { source: link.dataset.source });
    document.querySelector("#registration-title").focus({ preventScroll: true });
  });
}

form.addEventListener("focusin", () => recordDemoEvent("registration_form_start"), { once: true });

guestName.addEventListener("input", () => showError(guestName, nameError, ""));
email.addEventListener("input", () => showError(email, emailError, ""));
consent.addEventListener("change", () => showError(consent, consentError, ""));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (form.hidden) return;

  const fields = [
    [guestName, nameError, guestName.value.trim() ? "" : "Введите имя."],
    [email, emailError, email.validity.valid ? "" : "Введите e-mail в формате name@example.com."],
    [consent, consentError, consent.checked ? "" : "Подтвердите, что готовы проверить форму."]
  ];

  for (const [field, error, message] of fields) {
    showError(field, error, message);
  }
  const invalid = fields.find(([, , message]) => message);
  if (invalid) {
    recordDemoEvent("registration_form_error", { field: invalid[0].id });
    invalid[0].focus();
    return;
  }

  form.reset();
  form.hidden = true;
  result.hidden = false;
  recordDemoEvent("registration_demo_success");
  document.querySelector("#result-title").focus();
});

document.querySelector("#cancel-registration").addEventListener("click", () => {
  result.hidden = true;
  form.hidden = false;
  status.textContent = "Пробная запись отменена.";
  recordDemoEvent("registration_demo_cancel");
  guestName.focus();
});

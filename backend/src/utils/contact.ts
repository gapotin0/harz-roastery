const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  const email = value.trim();

  return email.length <= 254 && EMAIL_PATTERN.test(email);
}

export function isValidPhone(value: string): boolean {
  const phone = value.trim();

  if (phone.length < 8 || phone.length > 32) {
    return false;
  }

  if (!/^\+?[\d\s().-]+$/.test(phone)) {
    return false;
  }

  const digits = phone.replace(/\D/g, "");

  return digits.length >= 8 && digits.length <= 15;
}

export function contactError(email: string, phone: string): string | null {
  if (!isValidEmail(email)) {
    return "Enter a valid email address.";
  }

  if (!isValidPhone(phone)) {
    return "Enter a valid phone number.";
  }

  return null;
}

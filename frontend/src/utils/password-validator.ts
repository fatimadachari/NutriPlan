export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met?: boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'Mínimo de 8 caracteres',
    test: (pwd) => pwd.length >= 8,
  },
  {
    label: 'Uma letra maiúscula',
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    label: 'Uma letra minúscula',
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    label: 'Um número',
    test: (pwd) => /[0-9]/.test(pwd),
  },
  {
    label: 'Um caractere especial (!@#$%^&*)',
    test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  },
];

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  let metCount = 0;

  passwordRequirements.forEach((req) => {
    if (!req.test(password)) {
      errors.push(req.label);
    } else {
      metCount++;
    }
  });

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (metCount === passwordRequirements.length) {
    strength = 'strong';
  } else if (metCount >= 3) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return passwordRequirements.map((req) => ({
    ...req,
    met: req.test(password),
  }));
}
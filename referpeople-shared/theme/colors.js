// ReferPeople.in — Brand Colors for React Components

export const colors = {
  // Primary
  primary:      '#1A3C6E',
  primaryLight: '#2B5BA8',
  primaryDark:  '#0F2444',

  // Accent
  accent:       '#0EA5E9',
  accentLight:  '#38BDF8',
  accentDark:   '#0284C7',

  // Orange (Loans)
  orange:       '#EA580C',
  orangeLight:  '#FB923C',
  orangeDark:   '#C2410C',

  // Purple (Jobs)
  purple:       '#7C3AED',
  purpleLight:  '#A78BFA',
  purpleDark:   '#5B21B6',

  // Backgrounds
  bg:           '#FFFFFF',
  bgSecondary:  '#F0F4F8',
  bgDark:       '#0F172A',

  // Text
  text:         '#1F2937',
  textLight:    '#6B7280',
  textWhite:    '#FFFFFF',

  // Service identity
  services: {
    realestate: '#1A3C6E',
    loans:      '#EA580C',
    jobs:       '#7C3AED',
    education:  '#0EA5E9',
  },

  // Status
  success: '#16A34A',
  warning: '#D97706',
  error:   '#DC2626',
  info:    '#2563EB',
};

// Gradient presets
export const gradients = {
  primary:    `linear-gradient(135deg, #1A3C6E, #0EA5E9)`,
  orange:     `linear-gradient(135deg, #EA580C, #FB923C)`,
  purple:     `linear-gradient(135deg, #7C3AED, #A78BFA)`,
  hero:       `linear-gradient(160deg, #0F2444 0%, #1A3C6E 50%, #2B5BA8 100%)`,
  dark:       `linear-gradient(180deg, #0F172A, #1E293B)`,
};

export default colors;

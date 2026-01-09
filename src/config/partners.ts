// Partner identifier type
export type PartnerKey = 'sage';

// Partner configuration interface
export interface PartnerConfig {
  readonly name: string;
  readonly email: string;
  readonly branding: {
    readonly primary: string;
    readonly secondary?: string;
    readonly accent?: string;
  };
  readonly contact: {
    readonly phone?: string;
    readonly address?: string;
    readonly website?: string;
  };
  readonly exclusivityRegion: string;
  readonly pilot: {
    readonly startDate: string;
    readonly endDate?: string;
  };
}

// Partner configurations
export const PARTNERS: Record<PartnerKey, PartnerConfig> = {
  sage: {
    name: 'Sage Family Lawyers',
    email: 'contact@sagefamilylawyers.com.au',
    branding: {
      primary: '#2E7D32',
    },
    contact: {
      address: 'Melbourne CBD',
    },
    exclusivityRegion: 'Melbourne CBD',
    pilot: {
      startDate: '2026-01-01',
    },
  },
};

// Helper function to get partner configuration
export function getPartnerConfig(key: PartnerKey): PartnerConfig {
  return PARTNERS[key];
}

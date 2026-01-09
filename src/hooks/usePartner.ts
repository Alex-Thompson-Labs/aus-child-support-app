import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PartnerKey, PartnerConfig, PARTNERS, getPartnerConfig } from '@/src/config/partners';
import { useClientOnly } from './useClientOnly';

const STORAGE_KEY = 'csc_partner_id';

function isValidPartnerKey(key: string): key is PartnerKey {
  return key in PARTNERS;
}

function isPilotExpired(config: PartnerConfig): boolean {
  if (!config.pilot.endDate) return false;
  return new Date() > new Date(config.pilot.endDate);
}

export function usePartner(): PartnerConfig | null {
  const isClient = useClientOnly();
  const params = useLocalSearchParams();
  const [partnerConfig, setPartnerConfig] = useState<PartnerConfig | null>(null);

  useEffect(() => {
    if (!isClient) return;

    const urlPartner = typeof params.partner === 'string' ? params.partner : null;
    const storedPartner = urlPartner ?? localStorage.getItem(STORAGE_KEY);

    if (!storedPartner || !isValidPartnerKey(storedPartner)) {
      setPartnerConfig(null);
      return;
    }

    const config = getPartnerConfig(storedPartner);

    if (isPilotExpired(config)) {
      localStorage.removeItem(STORAGE_KEY);
      setPartnerConfig(null);
      return;
    }

    localStorage.setItem(STORAGE_KEY, storedPartner);
    setPartnerConfig(config);
  }, [isClient, params.partner]);

  return partnerConfig;
}

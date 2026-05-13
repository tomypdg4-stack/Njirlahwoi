'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encrypt, decrypt } from '@/lib/encryption';

interface ApiKeyState {
  _encryptedOrKey: string;
  openrouterKey: string | null;
  _encryptedNjirlahKey: string;
  njirlahKey: string | null;
  isKeyValid: boolean;
  setKey: (key: string) => Promise<void>;
  setNjirlahKey: (key: string) => Promise<void>;
  loadKey: () => Promise<void>;
  clearKey: () => void;
  clearNjirlahKey: () => void;
  hasKey: () => boolean;
  hasNjirlahKey: () => boolean;
  testConnection: () => Promise<boolean>;
  // Legacy alias kept for UI compatibility
  setOpenrouterKey: (key: string) => Promise<void>;
  isValidated: boolean;
}

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set, get) => ({
      _encryptedOrKey: '',
      openrouterKey: null,
      _encryptedNjirlahKey: '',
      njirlahKey: null,
      isKeyValid: false,
      isValidated: false,

      setKey: async (key: string) => {
        const encrypted = await encrypt(key);
        if (!encrypted) throw new Error('Enkripsi gagal');
        set({ _encryptedOrKey: encrypted, openrouterKey: key, isKeyValid: true, isValidated: true });
      },

      setOpenrouterKey: async (key: string) => {
        return get().setKey(key);
      },

      setNjirlahKey: async (key: string) => {
        const encrypted = await encrypt(key);
        if (!encrypted) throw new Error('Enkripsi gagal');
        set({ _encryptedNjirlahKey: encrypted, njirlahKey: key });
      },

      clearKey: () =>
        set({ _encryptedOrKey: '', openrouterKey: null, isKeyValid: false, isValidated: false }),
        
      clearNjirlahKey: () =>
        set({ _encryptedNjirlahKey: '', njirlahKey: null }),

      loadKey: async () => {
        const { _encryptedOrKey, _encryptedNjirlahKey } = get();
        
        if (_encryptedOrKey) {
          try {
            const decrypted = await decrypt(_encryptedOrKey);
            if (decrypted) set({ openrouterKey: decrypted, isKeyValid: true, isValidated: true });
          } catch {}
        }
        
        if (_encryptedNjirlahKey) {
          try {
            const decryptedNjirlah = await decrypt(_encryptedNjirlahKey);
            if (decryptedNjirlah) set({ njirlahKey: decryptedNjirlah });
          } catch {}
        }
      },

      hasKey: () => !!get().openrouterKey,
      hasNjirlahKey: () => !!get().njirlahKey,

      testConnection: async (): Promise<boolean> => {
        const { openrouterKey } = get();
        if (!openrouterKey) return false;
        try {
          const res = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
              Authorization: `Bearer ${openrouterKey}`,
              'Content-Type': 'application/json',
            },
          });
          const ok = res.status === 200;
          set({ isKeyValid: ok });
          return ok;
        } catch {
          set({ isKeyValid: false });
          return false;
        }
      },
    }),
    {
      name: 'njirlah-apikey-v2',
      partialize: (s) => ({ _encryptedOrKey: s._encryptedOrKey, _encryptedNjirlahKey: s._encryptedNjirlahKey }),
    }
  )
);

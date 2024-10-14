import { GapiContext } from '@/renderer/contexts/gapi';
import { useContext } from 'react';
export function useGapi() {
  return useContext(GapiContext);
}
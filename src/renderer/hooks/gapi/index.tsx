import { GapiContext } from '@/renderer/contexts/gapi';
import { useContext } from 'react';

export const useGapi = () => useContext(GapiContext)
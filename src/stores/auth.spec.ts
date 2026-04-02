import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './auth';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    // Clear mock functions if any
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('devrait initialiser le store avec des valeurs nulles si pas de token', () => {
    const store = useAuthStore();
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it('devrait assigner le token et user avec setAuth() et les stocker dans le localStorage', () => {
    const store = useAuthStore();
    const mockUser = {
      numClient: 1,
      email: 'test@example.com',
      nom: 'Dupont',
      prenom: 'Jean',
      role: 'particulier'
    };
    
    store.setAuth('fake-jwt-token', mockUser);
    
    expect(store.token).toBe('fake-jwt-token');
    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
    
    // Vérifier le localStorage
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(mockUser);
  });

  it('devrait supprimer les donnees avec logout()', () => {
    const store = useAuthStore();
    const mockUser = {
      numClient: 1,
      email: 'test@example.com',
      nom: 'Dupont',
      prenom: 'Jean',
      role: 'particulier'
    };
    
    store.setAuth('fake-jwt-token', mockUser);
    expect(store.isAuthenticated).toBe(true);
    
    store.logout();
    
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('devrait mettre a jour les donnees partielles de l utilisateur avec updateUser()', () => {
    const store = useAuthStore();
    const mockUser = {
      numClient: 1,
      email: 'test@example.com',
      nom: 'Dupont',
      prenom: 'Jean',
      role: 'particulier'
    };
    
    store.setAuth('fake-jwt-token', mockUser);
    
    store.updateUser({ prenom: 'Paul', telephone: '0600000000' });
    
    expect(store.user?.prenom).toBe('Paul');
    expect(store.user?.telephone).toBe('0600000000');
    expect(store.user?.nom).toBe('Dupont'); // Non modifie
    
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    expect(localUser.prenom).toBe('Paul');
  });
});

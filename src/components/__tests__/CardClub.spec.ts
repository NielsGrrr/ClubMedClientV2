import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardClub from '../CardClub.vue';

describe('CardClub.vue', () => {
  it('affiche les elements du club et gere les sauts de lignes/bords de description', () => {
    const mockClub = {
      idClub: 42,
      titre: 'Club Med Val Thorens',
      numPhoto: 15,
      noteMoyenne: 4.8,
      statutMiseEnLigne: 'NOUVEAU',
      description: 'Lieu parfait. '.repeat(10) // Fait plus de 100 caracteres
    };

    const wrapper = mount(CardClub, {
      props: { club: mockClub },
      global: {
        stubs: {
          'router-link': true // Empeche l'erreur du composant vue-router
        }
      }
    });

    expect(wrapper.text()).toContain('Club Med Val Thorens');
    expect(wrapper.text()).toContain('Nouveau');
    expect(wrapper.text()).toContain('4.8');
    
    // Verifie la troncature (100 caracteres max + '...')
    const descriptionElement = wrapper.find('.description');
    expect(descriptionElement.text()).toContain('...');
    expect(descriptionElement.text().length).toBeLessThanOrEqual(104);
  });
});

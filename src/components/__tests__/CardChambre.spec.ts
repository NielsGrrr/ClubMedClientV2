import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardChambre from '../CardChambre.vue';

describe('CardChambre.vue', () => {
  it('affiche les details correctement', () => {
    const mockChambre = {
      nomType: 'Chambre Superieure',
      textePresentation: 'Une belle chambre vue mer.',
      surface: 32,
      capaciteMax: 4
    };

    const wrapper = mount(CardChambre, {
      props: { chambre: mockChambre }
    });

    expect(wrapper.text()).toContain('Chambre Superieure');
    expect(wrapper.text()).toContain('Une belle chambre vue mer.');
    expect(wrapper.text()).toContain('32m²');
    expect(wrapper.text()).toContain('4 pers.');
  });
});

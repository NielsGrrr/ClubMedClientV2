import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardLocalisation from '../CardLocalisation.vue';

describe('CardLocalisation.vue', () => {
  it('affiche le nom de la localisation et comporte un router-link stubbed', () => {
    const mockLoc = {
      numLocalisation: 5,
      nomLocalisation: 'Alpes Francaises'
    };

    const wrapper = mount(CardLocalisation, {
      props: { localisation: mockLoc },
      global: {
        stubs: {
          'router-link': true
        }
      }
    });

    expect(wrapper.text()).toContain('Alpes Francaises');
    expect(wrapper.text()).toContain('Explorer');
  });
});

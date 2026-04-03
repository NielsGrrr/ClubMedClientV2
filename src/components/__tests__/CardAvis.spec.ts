import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardAvis from '../CardAvis.vue';

describe('CardAvis.vue', () => {
  it('affiche le commentaire et la bonne note', () => {
    const avis = {
      commentaire: 'Superbe sejour !',
      note: 4
    };

    const wrapper = mount(CardAvis, {
      props: { unAvis: avis }
    });

    // Verification du texte
    expect(wrapper.text()).toContain('Superbe sejour !');
    
    // Verification des etoiles : il y a 5 etoiles rendues, on verifie que 4 ont la classe 'gold'
    const etoilesDorees = wrapper.findAll('.gold');
    expect(etoilesDorees.length).toBe(4);
  });
});

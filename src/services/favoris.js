import { ref, watch } from 'vue';

const storageKey = 'clubmed_favoris';

const savedFavoris = localStorage.getItem(storageKey);
export const favoris = ref(savedFavoris ? JSON.parse(savedFavoris) : []);

watch(favoris, (newVal) => {
  localStorage.setItem(storageKey, JSON.stringify(newVal));
}, { deep: true });

export const toggleFavori = (annonce) => {
  const index = favoris.value.findIndex(f => f.id === annonce.id);
  if (index > -1) {
    favoris.value.splice(index, 1);
  } else {
    favoris.value.push(annonce);
  }
};

export const estFavori = (id) => {
  return favoris.value.some(f => f.id === id);
};

<script setup>
import { ref, onMounted, computed } from 'vue';
import annoncesService from '@/services/AnnonceService';

const props = defineProps(['id']);
const annonce = ref(null);
const loading = ref(true);
const isFavorite = ref(false);

// Clé unique pour le localStorage
const STORAGE_KEY = 'clubmed_favorites';

onMounted(async () => {
  try {
    const response = await annoncesService.getById(props.id);
    annonce.value = response.data;

    // Vérifier si cette annonce est déjà en favoris
    const savedFavs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    isFavorite.value = savedFavs.some(fav => fav.idTypeChambre === annonce.value.idTypeChambre);
  } catch (error) {
    console.error("Erreur lors de la récupération du détail", error);
  } finally {
    loading.value = false;
  }
});

const toggleFavorite = () => {
  let savedFavs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  if (isFavorite.value) {
    // Supprimer des favoris
    savedFavs = savedFavs.filter(fav => fav.idTypeChambre !== annonce.value.idTypeChambre);
  } else {
    // Ajouter aux favoris (on stocke l'objet complet pour l'afficher sur une page "Mes Favoris" plus tard)
    savedFavs.push(annonce.value);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFavs));
  isFavorite.value = !isFavorite.value;
};
</script>

<template>
  <div class="detail-container">
    <div class="header-nav">
      <router-link to="/annonces" class="btn-back">← Retour aux annonces</router-link>

      <button
        v-if="annonce"
        @click="toggleFavorite"
        class="btn-fav"
        :class="{ 'active': isFavorite }"
      >
        <span class="heart">{{ isFavorite ? '❤️' : '🤍' }}</span>
        {{ isFavorite ? 'Favori' : 'Ajouter aux favoris' }}
      </button>
    </div>

    <div v-if="loading">Chargement des détails...</div>

    <div v-else-if="annonce" class="annonce-hero">
      <div class="image-placeholder">📸 Image {{ annonce.numPhoto }}</div>

      <div class="info-section">
        <h1>{{ annonce.nomType }}</h1>
        </div>
    </div>
  </div>
</template>

<style scoped>
  .detail-container { max-width: 1000px; margin: 0 auto; padding: 20px; }
  .btn-back { display: inline-block; margin-bottom: 20px; color: #002f6c; text-decoration: none; }
  .annonce-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
  .image-placeholder { height: 400px; background: #eee; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .specs { display: flex; gap: 20px; margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 8px; }
  .btn-reserve { background: #002f6c; color: white; border: none; padding: 15px 30px; font-size: 1.1rem; border-radius: 5px; cursor: pointer; width: 100%; }
  .header-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .btn-fav {
    background: white;
    border: 2px solid #002f6c;
    color: #002f6c;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-fav.active {
    background: #f0f4f8;
    border-color: #e63946;
    color: #e63946;
  }

  .btn-fav:hover {
    transform: scale(1.05);
  }
</style>

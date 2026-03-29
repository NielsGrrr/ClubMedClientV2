<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'; // Pour lire l'ID dans l'URL
import annoncesService from '@/services/AnnonceService';

const route = useRoute();
const clubs = ref([]);
const loading = ref(true);

const chargerClubs = async () => {
  loading.value = true;
  try {
    // On regarde si on a un ID de localisation dans l'URL
    const idLocalisation = route.params.id;

    if (idLocalisation) {
      // Si oui, on filtre
      const response = await annoncesService.getClubsByLocalisation(idLocalisation);
      clubs.value = response.data;
    } else {
      // Sinon, on affiche tout (comportement de base)
      const response = await annoncesService.getAllClubs();
      clubs.value = response.data;
    }
  } catch (error) {
    console.error("Erreur lors du chargement des clubs", error);
  } finally {
    loading.value = false;
  }
};

onMounted(chargerClubs);

// On surveille si l'ID dans l'URL change (ex: passer de Paris à Lyon sans quitter la page)
watch(() => route.params.id, chargerClubs);
</script>

<template>
  <div class="annonces-container">
    <h1 v-if="route.params.id">Résultats pour cette destination</h1>
    <h1 v-else>Tous nos clubs</h1>

    <div v-if="loading">Recherche des meilleurs clubs...</div>

    <div v-else class="grid">
      <p v-if="clubs.length === 0">Aucun club trouvé pour cette destination.</p>

      <div v-for="club in clubs" :key="club.idClub" class="card">
        <div class="photo-placeholder">Photo ID: {{ club.numPhoto }}</div>
        <div class="content">
          <h3>{{ club.titre }}</h3>
          <p>{{ club.description }}</p>
          <button class="btn-info">Découvrir ce club</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}
.card:hover { transform: scale(1.02); }
.photo-placeholder { height: 200px; background: #eee; display: flex; align-items: center; justify-content: center; }
.content { padding: 15px; }
.btn-info { width: 100%; background: #002f6c; color: white; border: none; padding: 10px; cursor: pointer; }
</style>

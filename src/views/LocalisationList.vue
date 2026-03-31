<script setup>
import { ref, onMounted } from 'vue';
import localisationService from '@/services/LocalisationService';

const localisations = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await localisationService.getAllLocalisations();
    localisations.value = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="annonces-container">
    <h1>Toutes nos destinations</h1>

    <div v-if="loading">Chargement des pépites...</div>

    <div v-else class="grid">
      <div v-for="localisation in localisations" :key="localisation.numLocalisation" class="card">
        <div class="photo-placeholder"> Photo </div>

        <div class="content">
          <h3>{{ localisation.nomLocalisation }}</h3>

          <router-link :to="{ name: 'annonces-list', params: { id: localisation.numLocalisation } }" custom v-slot="{ navigate }">
            <button @click="navigate" class="btn-info">Voir la localisation</button>
          </router-link>
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

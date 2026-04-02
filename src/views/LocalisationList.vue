<script setup>
import { ref, onMounted } from 'vue';
import localisationService from '@/services/LocalisationService';
import CardLocalisation from '@/components/CardLocalisation.vue';

const localisations = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await localisationService.getAllLocalisations();
    localisations.value = response.data;
  } catch (error) {
    console.error("Erreur lors du chargement", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="destinations-page">
    <header class="header">
      <h1>Toutes nos destinations</h1>
      <p>Trouvez le cadre idéal pour vos prochaines vacances</p>
    </header>

    <div v-if="loading" class="loader">Chargement des pépites...</div>

    <div v-else class="grid">
      <CardLocalisation
        v-for="loc in localisations"
        :key="loc.numLocalisation"
        :localisation="loc"
      />
    </div>
  </div>
</template>

<style scoped>
.destinations-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

h1 { color: #002f6c; font-size: 2.5rem; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.loader { text-align: center; padding: 50px; color: #636e72; }
</style>

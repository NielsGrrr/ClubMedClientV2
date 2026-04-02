<script setup>
import { ref, onMounted } from 'vue';
import typeChambreService from '@/services/AnnonceService';

const typesChambres = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    // Appel asynchrone vers le contrôleur C#
    const response = await typeChambreService.getAll();
    typesChambres.value = response.data;
  } catch (err) {
    error.value = "Impossible de charger les types de chambres.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container">
    <h2>Nos Types de Chambres</h2>

    <div v-if="loading">Chargement en cours...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <ul v-else>
      <li v-for="type in typesChambres" :key="type.idTypeChambre">
        <strong>{{ type.nomType }}</strong>
        </li>
    </ul>
  </div>
</template>

<style scoped>
.error { color: red; }
.container { padding: 20px; }
</style>

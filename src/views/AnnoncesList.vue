<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useClubs } from '@/stores/useClubs';
import  CardClub from '../components/CardClub.vue';

const route = useRoute();
const idLocalisation = computed(() => route.params.id);

const { clubs, loading } = useClubs(idLocalisation);

const titrePage = computed(() => {
  if (!idLocalisation.value) return 'Explorer tous nos villages';
  return `Destinations : ${clubs.value[0]?.sousLocalisation?.nomSousLocalisation || 'Chargement...'}`;
});
</script>

<template>
  <div class="annonces-container">
    <header class="page-header">
      <h1>{{ titrePage }}</h1>
      <p class="subtitle">{{ clubs.length }} destinations trouvées</p>
    </header>

    <div v-if="loading" class="grid">
      <div v-for="n in 6" :key="n" class="card skeleton">...</div>
    </div>

    <div v-else class="grid">
      <div v-if="clubs.length === 0" class="empty-state">
        <p>Aucun club trouvé.</p>
        <router-link to="/annonces" class="btn-outline">Voir tout</router-link>
      </div>

      <CardClub
        v-for="club in clubs"
        :key="club.idClub"
        :club="club"
      />
    </div>
  </div>
</template>

<style scoped>
.annonces-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  margin-bottom: 40px;
  text-align: center;
}

h1 { color: #002f6c; font-size: 2.5rem; margin-bottom: 10px; }
.subtitle { color: #636e72; font-size: 1.1rem; }

/* La grille qui contient les cartes */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

/* Styles pour le chargement (Skeleton) */
.card.skeleton {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  height: 370px; /* Aligné sur la taille d'une carte normale */
}
.skeleton-img { height: 220px; background: #eee; }
.skeleton-content { height: 150px; background: #f9f9f9; }

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px;
}
</style>

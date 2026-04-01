<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import annoncesService from '@/services/AnnonceService';

const route = useRoute();
const clubs = ref([]);
const loading = ref(true);

const chargerClubs = async () => {
  loading.value = true;
  try {
    const idLocalisation = route.params.id;
    const response = idLocalisation
      ? await annoncesService.getClubsByLocalisation(idLocalisation)
      : await annoncesService.getAllClubs();

    clubs.value = response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des clubs", error);
  } finally {
    loading.value = false;
  }
};

// Fonction pour couper le texte trop long
const tronquerTexte = (texte, limite) => {
  if (!texte) return "";
  return texte.length > limite ? texte.substring(0, limite) + "..." : texte;
};

onMounted(chargerClubs);
watch(() => route.params.id, chargerClubs);
</script>

<template>
  <div class="annonces-container">
    <header class="page-header">
      <h1 v-if="route.params.id">Destinations : {{ clubs[0]?.sousLocalisation?.nomSousLocalisation || 'Chargement...' }}</h1>
      <h1 v-else>Explorer tous nos villages</h1>
      <p class="subtitle">{{ clubs.length }} destinations trouvées pour vous</p>
    </header>

    <div v-if="loading" class="grid">
      <div v-for="n in 6" :key="n" class="card skeleton">
        <div class="skeleton-img"></div>
        <div class="skeleton-content"></div>
      </div>
    </div>

    <div v-else class="grid">
      <div v-if="clubs.length === 0" class="empty-state">
        <p>Aucun club trouvé pour cette destination.</p>
        <router-link to="/annonces" class="btn-outline">Voir tous les clubs</router-link>
      </div>

      <div v-for="club in clubs" :key="club.idClub" class="card">
        <div class="photo-wrapper">
          <img
            :src="`/images/ressort/${club.numPhoto}.webp`"
            :alt="club.titre"
            class="club-img"
            loading="lazy"
          />
          <div class="rating-badge">★ {{ club.noteMoyenne }}</div>
        </div>

        <div class="content">
          <div class="card-header">
            <h3>{{ club.titre }}</h3>
            <span class="status" v-if="club.statutMiseEnLigne === 'NOUVEAU'">Nouveau</span>
          </div>

          <p class="description">{{ tronquerTexte(club.description, 100) }}</p>

          <div class="card-footer">
            <router-link
              :to="{ name: 'annonce-detail', params: { id: club.idClub } }"
              class="btn-primary"
            >
              Découvrir le village
            </router-link>
          </div>
        </div>
      </div>
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

/* Design de la Carte */
.card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px rgba(0,47,108,0.15);
}

.photo-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.club-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card:hover .club-img { transform: scale(1.1); }

.rating-badge {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: rgba(255, 255, 255, 0.9);
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  color: #002f6c;
}

.content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

h3 { color: #002f6c; margin: 0; font-size: 1.3rem; }

.status {
  background: #e1f5fe;
  color: #01579b;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.description {
  color: #636e72;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
  flex-grow: 1;
}

.btn-primary {
  display: block;
  width: 100%;
  padding: 12px;
  background: #002f6c;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: background 0.2s;
}

.btn-primary:hover { background: #001d44; }

/* Styles pour le chargement (Skeleton) */
.skeleton-img { height: 220px; background: #eee; }
.skeleton-content { height: 150px; background: #f9f9f9; }
</style>

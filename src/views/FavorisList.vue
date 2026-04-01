<script setup>
import { ref, onMounted } from 'vue';

const favoris = ref([]);
const loading = ref(true);
const STORAGE_KEY = 'clubmed_favorites';

onMounted(() => {
  const savedFavs = localStorage.getItem(STORAGE_KEY);
  if (savedFavs) {
    favoris.value = JSON.parse(savedFavs);
  }
  loading.value = false;
});

const retirerFavori = (id) => {
  favoris.value = favoris.value.filter(club => club.idClub !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favoris.value));
};
</script>

<template>
  <div class="favoris-container">
    <header class="fav-header">
      <h1>Mes coups de cœur <span class="heart-icon">❤️</span></h1>
      <p v-if="favoris.length > 0">{{ favoris.length }} village(s) sauvegardé(s)</p>
    </header>

    <div v-if="favoris.length === 0" class="empty-state">
      <div class="empty-icon">🏝️</div>
      <h2>Votre liste est vide</h2>
      <p>Explorez nos destinations et cliquez sur le cœur pour les retrouver ici.</p>
      <router-link to="/annonces" class="btn-discover">Découvrir nos clubs</router-link>
    </div>

    <div v-else class="grid">
      <div v-for="club in favoris" :key="club.idClub" class="card">
        <div class="photo-wrapper">
          <button @click="retirerFavori(club.idClub)" class="btn-remove" title="Retirer des favoris">
            <span class="trash-icon">🗑️</span>
          </button>

          <img
            :src="`/images/ressort/${club.numPhoto}.webp`"
            :alt="club.titre"
            class="club-img"
          />
          <div class="badge-note">★ {{ club.noteMoyenne }}</div>
        </div>

        <div class="content">
          <h3>{{ club.titre }}</h3>
          <p class="description">{{ club.description?.substring(0, 80) }}...</p>

          <div class="card-footer">
            <router-link
              :to="{ name: 'annonce-detail', params: { id: club.idClub } }"
              class="btn-detail"
            >
              Voir le village
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favoris-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.fav-header {
  margin-bottom: 40px;
  border-bottom: 2px solid #f1f2f6;
  padding-bottom: 20px;
}

h1 { color: #002f6c; font-size: 2.2rem; margin: 0; }
.heart-icon { font-size: 1.8rem; }

/* Grille */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

/* Carte Favori */
.card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
  position: relative;
}

.card:hover { transform: translateY(-5px); }

.photo-wrapper {
  position: relative;
  height: 200px;
}

.club-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove {
  position: absolute;
  top: 12px;
  right: 12px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 2;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #ff4757;
  transform: scale(1.1);
}

.btn-remove:hover .trash-icon { filter: brightness(0) invert(1); }

.badge-note {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 47, 108, 0.85);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.content { padding: 20px; }
h3 { color: #002f6c; margin: 0 0 10px 0; font-size: 1.25rem; }
.description { color: #636e72; font-size: 0.9rem; line-height: 1.4; margin-bottom: 20px; }

.btn-detail {
  display: block;
  text-align: center;
  background: #002f6c;
  color: white;
  text-decoration: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  transition: background 0.2s;
}

.btn-detail:hover { background: #001d44; }

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: #f8fafc;
  border-radius: 20px;
  margin-top: 20px;
}

.empty-icon { font-size: 4rem; margin-bottom: 20px; }
.btn-discover {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 30px;
  background: #002f6c;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: bold;
}
</style>

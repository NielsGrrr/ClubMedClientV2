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
  favoris.value = favoris.value.filter(f => f.idTypeChambre !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favoris.value));
};
</script>

<template>
  <div class="annonces-container">
    <h1>Mes coups de cœur ❤️</h1>

    <div v-if="favoris.length === 0" class="empty-state">
      <p>Vous n'avez pas encore de favoris.</p>
      <router-link to="/annonces" class="btn-info">Parcourir les annonces</router-link>
    </div>

    <div v-else class="grid">
      <div v-for="annonce in favoris" :key="annonce.idTypeChambre" class="card">
        <div class="photo-placeholder">
          <button @click="retirerFavori(annonce.idTypeChambre)" class="btn-remove">✕</button>
          📸 Photo ID: {{ annonce.numPhoto }}
        </div>

        <div class="content">
          <h3>{{ annonce.nomType }}</h3>
          <p class="description">{{ annonce.textePresentation }}</p>

          <div class="details">
            <span>📐 {{ annonce.surface }} m²</span>
          </div>

          <router-link :to="{ name: 'annonce-detail', params: { id: annonce.idTypeChambre } }" class="btn-info">
            Voir le détail
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-remove {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: red;
  font-weight: bold;
}
.empty-state {
  text-align: center;
  margin-top: 50px;
}
</style>

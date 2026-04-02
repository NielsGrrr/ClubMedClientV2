<script setup>
import { favoris } from '@/services/favoris';
import CardClub from '@/components/CardClub.vue';
</script>

<template>
  <div class="favoris-container">
    <header class="fav-header">
      <h1>Mes coups de cœur ❤️</h1>
      <p v-if="favoris.length > 0">{{ favoris.length }} village(s) sauvegardé(s)</p>
    </header>

    <div v-if="favoris.length === 0" class="empty-state">
      <div class="empty-icon">🏝️</div>
      <h2>Votre liste est vide</h2>
      <router-link to="/annonces" class="btn-discover">Découvrir nos clubs</router-link>
    </div>

    <div v-else class="grid">
      <CardClub
        v-for="club in favoris"
        :key="club.idClub"
        :club="club"
      />
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

h1 { color: #002f6c; font-size: 2.2rem; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: #f8fafc;
  border-radius: 20px;
}

.empty-icon { font-size: 4rem; }

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

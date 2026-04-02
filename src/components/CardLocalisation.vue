<script setup>
defineProps({
  localisation: Object
});
</script>

<template>
  <div class="card-loc">
    <div class="photo-wrapper">
      <img
        :src="`/images/locations/${localisation.numLocalisation}.webp`"
        :alt="localisation.nomLocalisation"
        class="loc-img"
        onerror="this.src='/images/placeholder-dest.webp'"
      />
      <div class="overlay">
        <span class="explore-text">Explorer</span>
      </div>
    </div>

    <div class="content">
      <h3>{{ localisation.nomLocalisation }}</h3>
      <p class="subtitle">Découvrez nos villages d'exception</p>

      <router-link
        :to="{ name: 'annonces-list', params: { id: localisation.numLocalisation } }"
        class="btn-loc"
      >
        Voir les clubs
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.btn-primary, .btn-loc, .btn-detail {
  box-sizing: border-box;
  width: 100%;
  display: block;
  padding: 12px;
}

.card-loc {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.card-loc:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px rgba(0,47,108,0.15);
}

.photo-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.loc-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-loc:hover .loc-img { transform: scale(1.1); }

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 47, 108, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.card-loc:hover .overlay { opacity: 1; }

.explore-text {
  color: white;
  font-weight: bold;
  border: 2px solid white;
  padding: 8px 20px;
  border-radius: 50px;
}

.content { padding: 20px; text-align: center; }

h3 { color: #002f6c; margin: 0 0 5px 0; font-size: 1.4rem; }
.subtitle { color: #636e72; font-size: 0.9rem; margin-bottom: 20px; }

.btn-loc {
  display: block;
  width: 100%;
  padding: 12px;
  background: #002f6c;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: background 0.2s;
}

.btn-loc:hover { background: #001d44; }
</style>

<script setup>
defineProps({
  club: Object
});

const tronquerTexte = (texte, limite) => {
  if (!texte) return "";
  return texte.length > limite ? texte.substring(0, limite) + "..." : texte;
};
</script>

<template>
  <div class="card">
    <div class="photo-wrapper">
      <img :src="`https://apiclubmeds4a22-cqf0achtbje7d6ct.francecentral-01.azurewebsites.net/api/Clubs/photos/${club.numPhoto}.webp`" @error.once="$event.target.src=`/images/ressort/${club.numPhoto}.webp`" :alt="club.titre" class="club-img" loading="lazy" />
      <div class="rating-badge">★ {{ club.noteMoyenne }}</div>
    </div>
    <div class="content">
      <div class="card-header">
        <h3>{{ club.titre }}</h3>
        <span class="status" v-if="club.statutMiseEnLigne === 'NOUVEAU'">Nouveau</span>
      </div>
      <p class="description">{{ tronquerTexte(club.description, 100) }}</p>
      <div class="card-footer">
        <router-link :to="{ name: 'annonce-detail', params: { id: club.idClub } }" class="btn-primary">
          Découvrir le village
        </router-link>
      </div>
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

.card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%; /* Pour que toutes les cartes aient la même hauteur */
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

.card:hover .club-img {
  transform: scale(1.1);
}

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

.btn-primary:hover {
  background: #001d44;
}
</style>

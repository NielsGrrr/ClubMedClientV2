<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import annoncesService from '@/services/AnnonceService';

const route = useRoute();
const club = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const id = route.params.id;
    const response = await annoncesService.getClubsById(id);
    club.value = response.data;
  } catch (err) {
    error.value = "Impossible de charger les détails du village.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="detail-container" v-if="club">
    <header class="gallery-mosaic">
      <div class="main-photo">
        <img :src="`/images/ressort/${club.numPhoto}.webp`" :alt="club.titre" />
      </div>
      <div class="secondary-photos">
        <div v-for="(photo, index) in club.photoClubs?.slice(0, 2)" :key="index" class="sub-photo">
           <img :src="`/images/ressort/${photo.numPhoto}.webp`" alt="Vue du club" />
        </div>
        <div class="more-photos" v-if="club.photoClubs?.length > 2">
          <span>+{{ club.photoClubs.length - 2 }} photos</span>
        </div>
      </div>
    </header>

    <div class="info-layout">
      <div class="main-col">
        <div class="title-section">
          <h1>{{ club.titre }}</h1>
          <div class="rating-badge">⭐ {{ club.noteMoyenne }} <span>/ 5</span></div>
        </div>

        <p class="description">{{ club.description }}</p>

        <section class="section-chambres">
          <h2 class="section-title">Nos hébergements</h2>
          <div class="chambres-list">
            <div v-for="chambre in club.typeChambres" :key="chambre.idTypeChambre" class="chambre-card">
              <div class="chambre-content">
                <h3>{{ chambre.nomType }}</h3>
                <p>{{ chambre.textePresentation }}</p>
                <div class="tags">
                  <span class="tag"><i class="icon">📐</i> {{ chambre.surface }}m²</span>
                  <span class="tag"><i class="icon">👥</i> Jusqu'à {{ chambre.capaciteMax }} pers.</span>
                </div>
              </div>
              <div class="chambre-action">
                <button class="btn-outline">Choisir</button>
              </div>
            </div>
          </div>
        </section>

        <section class="section-avis">
          <h2 class="section-title">Paroles de G.M</h2>
          <div v-if="club.avis?.length > 0" class="avis-grid">
            <div v-for="unAvis in club.avis" :key="unAvis.idAvis" class="avis-card">
              <div class="avis-header">
                <div class="stars-row">
                  <span v-for="n in 5" :key="n" :class="{ 'gold': n <= unAvis.note }">★</span>
                </div>
                <span class="date">{{ new Date(unAvis.dateAvis).toLocaleDateString() }}</span>
              </div>
              <p class="comment">"{{ unAvis.commentaire }}"</p>
            </div>
          </div>
          <div v-else class="no-avis">Soyez le premier à laisser un avis sur ce village !</div>
        </section>
      </div>

      <aside class="sidebar">
        <div class="booking-card">
          <div class="price-label">À partir de</div>
          <div class="price-value">1 250 € <span>/ pers.</span></div>
          <hr />
          <button class="btn-reserve">Réserver mon séjour</button>
          <a v-if="club.lienPdf" :href="club.lienPdf" target="_blank" class="link-pdf">
            📄 Voir la brochure technique
          </a>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  color: #2d3436;
}

/* Galerie Mosaïque */
.gallery-mosaic {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
  height: 500px;
  margin-bottom: 40px;
  border-radius: 20px;
  overflow: hidden;
}

.main-photo img, .sub-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.main-photo:hover img, .sub-photo:hover img {
  transform: scale(1.05);
}

.secondary-photos {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
}

.more-photos {
  background: #f1f2f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #002f6c;
  cursor: pointer;
}

/* Layout */
.info-layout { display: grid; grid-template-columns: 1fr 380px; gap: 60px; }

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 { font-size: 2.8rem; color: #002f6c; margin: 0; }

.rating-badge {
  background: #002f6c;
  color: white;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: bold;
}

.description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #636e72;
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 30px;
  border-bottom: 2px solid #f1f2f6;
  padding-bottom: 10px;
}

/* Chambres */
.chambre-card {
  display: flex;
  justify-content: space-between;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #e1e8ed;
  border-radius: 16px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.chambre-card:hover {
  border-color: #002f6c;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.chambre-content h3 { margin: 0 0 10px 0; color: #002f6c; }

.tag {
  display: inline-block;
  background: #f1f2f6;
  padding: 6px 12px;
  border-radius: 6px;
  margin-right: 10px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Avis */
.avis-card {
  padding: 25px;
  background: #f8fafc;
  border-radius: 16px;
  margin-bottom: 20px;
}

.stars-row { color: #dfe6e9; font-size: 1.2rem; }
.stars-row .gold { color: #fdcb6e; }

.comment { font-style: italic; color: #2d3436; margin: 15px 0; }

/* Sidebar */
.booking-card {
  position: sticky;
  top: 30px;
  padding: 35px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  border: 1px solid #f1f2f6;
}

.price-label { font-size: 0.9rem; color: #636e72; }
.price-value { font-size: 2rem; font-weight: 800; color: #002f6c; }
.price-value span { font-size: 1rem; font-weight: 400; color: #636e72; }

.btn-reserve {
  width: 100%;
  background: #002f6c;
  color: white;
  padding: 18px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-reserve:hover { background: #001d44; }

.btn-outline {
  background: transparent;
  border: 2px solid #002f6c;
  color: #002f6c;
  padding: 10px 25px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.link-pdf {
  display: block;
  text-align: center;
  margin-top: 15px;
  color: #636e72;
  text-decoration: none;
  font-size: 0.9rem;
}
</style>

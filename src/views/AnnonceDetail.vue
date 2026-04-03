<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import annoncesService from '@/services/AnnonceService';
import CardChambre from '@/components/CardChambre.vue';
import CardAvis from '@/components/CardAvis.vue';
import { toggleFavori, estFavori } from '@/services/favoris';
import { reservationState, resetReservationState } from '@/stores/reservationState';

const route = useRoute();
const router = useRouter();
const club = ref(null);
const loading = ref(true);

const isFav = computed(() => {
  return club.value ? estFavori(club.value.idClub) : false;
});

const lancerReservation = () => {
  if (club.value) {
    resetReservationState();
    reservationState.clubId = club.value.idClub;
    reservationState.clubTitre = club.value.titre;
    router.push('/reservation/step1');
  }
};

onMounted(async () => {
  try {
    const id = route.params.id;
    const response = await annoncesService.getClubsById(id);
    club.value = response.data;
  } catch (err) {
    console.error("Erreur chargement:", err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="detail-container" v-if="club">
    <header class="gallery-mosaic">
      <div class="main-photo">
        <img :src="`/images/ressort/${club.numPhoto}.webp`" @error.once="$event.target.src=`https://apiclubmeds4a22-cqf0achtbje7d6ct.francecentral-01.azurewebsites.net/api/Clubs/photos/${club.numPhoto}.webp`" :alt="club.titre" />
      </div>
      <div class="secondary-photos">
        <div v-for="(photo, index) in club.photoClubs?.slice(0, 2)" :key="index" class="sub-photo">
           <img :src="`/images/ressort/${photo.numPhoto}.webp`" @error.once="$event.target.src=`https://apiclubmeds4a22-cqf0achtbje7d6ct.francecentral-01.azurewebsites.net/api/Clubs/photos/${photo.numPhoto}.webp`" alt="Vue du club" />
        </div>
        <div class="more-photos" v-if="club.photoClubs?.length > 2">
          <span>+{{ club.photoClubs.length - 2 }} photos</span>
        </div>
      </div>
    </header>

    <div class="info-layout">
      <div class="main-col">
        <div class="title-section">
          <div class="title-with-fav">
            <h1>{{ club.titre }}</h1>
            <button @click="toggleFavori(club)" class="btn-fav" :class="{ 'is-active': isFav }">
              {{ isFav ? '❤️' : '🤍' }}
            </button>
          </div>
          <div class="rating-badge">⭐ {{ club.noteMoyenne }} <span>/ 5</span></div>
        </div>

        <p class="description">{{ club.description }}</p>

        <div class="features-grid">
          <div class="feature-item" v-if="club.localisation">
            <span class="icon">📍</span>
            <span>{{ club.localisation }}</span>
          </div>
          <div class="feature-item" v-if="club.typeSejour">
            <span class="icon">🏖️</span>
            <span>{{ club.typeSejour }}</span>
          </div>
          <div class="feature-item" v-if="club.capacitePersonnes">
            <span class="icon">👥</span>
            <span>{{ club.capacitePersonnes }} personnes</span>
          </div>
          <div class="feature-item" v-if="club.tailleM2">
            <span class="icon">📏</span>
            <span>{{ club.tailleM2 }} m²</span>
          </div>
        </div>

        <section class="section-chambres">
          <h2 class="section-title">Nos hébergements</h2>
          <div class="chambres-list">
            <CardChambre
              v-for="chambre in club.typeChambres"
              :key="chambre.idTypeChambre"
              :chambre="chambre"
            />
          </div>
        </section>

        <section class="section-avis">
          <h2 class="section-title">Paroles de G.M</h2>
          <div v-if="club.avis?.length > 0" class="avis-grid">
            <CardAvis
              v-for="unAvis in club.avis"
              :key="unAvis.idAvis"
              :un-avis="unAvis"
            />
          </div>
          <div v-else class="no-avis">Soyez le premier à laisser un avis !</div>
        </section>
      </div>

      <aside class="sidebar">
        <div class="booking-card">
          <div class="price-label">À partir de</div>
          <div class="price-value">{{ club.prixBase || '... ' }} € <span>/ pers.</span></div>
          <hr />
          <button @click="lancerReservation" class="btn-reserve">Réserver mon séjour</button>
          <a v-if="club.lienPdf" :href="club.lienPdf" target="_blank" class="link-pdf">
            📄 Voir la brochure technique
          </a>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* CSS UNIQUE AU PARENT (LAYOUT GLOBAL) */
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.gallery-mosaic {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
  height: 500px;
  margin-bottom: 40px;
  border-radius: 20px;
  overflow: hidden;
}

.main-photo img, .sub-photo img { width: 100%; height: 100%; object-fit: cover; }
.secondary-photos { display: grid; grid-template-rows: repeat(2, 1fr); gap: 12px; }
.more-photos { background: #f1f2f6; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #002f6c; }

.info-layout { display: grid; grid-template-columns: 1fr 380px; gap: 60px; }

.title-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.title-with-fav { display: flex; align-items: center; gap: 15px; }
h1 { font-size: 2.8rem; color: #002f6c; margin: 0; }

.rating-badge { background: #002f6c; color: white; padding: 8px 16px; border-radius: 50px; font-weight: bold; }
.description { font-size: 1.1rem; line-height: 1.7; color: #636e72; margin-bottom: 30px; }

.features-grid {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f2f6;
  padding: 6px 12px;
  border-radius: 6px;
  color: #333;
  font-size: 0.85rem;
}

.feature-item .icon { font-size: 1rem; color: #666; }
.section-title { font-size: 1.8rem; margin-bottom: 30px; border-bottom: 2px solid #f1f2f6; padding-bottom: 10px; color: #002f6c; }

.btn-fav {
  background: white; border: 1px solid #ddd; font-size: 1.5rem; cursor: pointer;
  border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center;
}
.btn-fav.is-active { background-color: #fff1f2; border-color: #e63946; }

.booking-card { position: sticky; top: 30px; padding: 35px; background: white; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); border: 1px solid #f1f2f6; }
.price-value { font-size: 2rem; font-weight: 800; color: #002f6c; }
.btn-reserve { width: 100%; background: #002f6c; color: white; padding: 18px; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; margin-top: 20px; }
.link-pdf { display: block; text-align: center; margin-top: 15px; color: #636e72; text-decoration: none; font-size: 0.9rem; }
.no-avis { padding: 30px; background: #f8fafc; border-radius: 16px; text-align: center; color: #636e72; }
</style>

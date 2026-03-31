<template>
  <div class="page-wrapper">
    
    <div class="carousel-container">
      <div class="carousel-slider" :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }">
        <div 
          class="carousel-slide placeholder-img" 
          v-for="(slide, index) in carouselSlides" 
          :key="index"
        >
          <!-- C'est ici que tu mettras ta vraie balise <img :src="slide.url" /> plus tard -->
          <span>{{ slide.label }}</span>
        </div>
      </div>
      
      <!-- Contrôles du carrousel -->
      <button class="carousel-btn prev-btn" @click="prevSlide" v-if="carouselSlides.length > 1">❮</button>
      <button class="carousel-btn next-btn" @click="nextSlide" v-if="carouselSlides.length > 1">❯</button>
      
      <!-- Indicateurs (points) -->
      <div class="carousel-indicators">
        <span 
          v-for="(_, index) in carouselSlides" 
          :key="index" 
          :class="['dot', { active: currentImageIndex === index }]"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>

    <div class="main-content">
      <h1 class="resort-title">{{ reservationState.clubTitre }}</h1>
      <p class="resort-location">📍 Andalousie, Espagne • Tout compris</p>

      <div class="booking-bar">
        
        <div class="booking-field border-right">
          <label>Arrivée</label>
          <input type="date" v-model="reservationState.dateDebut" :min="minDate" :max="maxDate" />
        </div>
        
        <div class="booking-field border-right">
          <label>Départ</label>
          <input type="date" v-model="reservationState.dateFin" :min="minDateForFin" :max="maxDate" />
        </div>
        
        <div class="booking-field border-right">
          <label>Transport</label>
          <select v-model="reservationState.transportId" @change="updateTransportInfo">
            <option value="" disabled>Sélectionner...</option>
            <option v-for="t in transports" :key="t.transportId" :value="t.transportId">
              {{ t.transportLieuDepart }} (+{{ t.transportPrix }}€)
            </option>
          </select>
        </div>

        <div class="booking-field">
          <label>Voyageurs</label>
          <div class="traveler-counter">
            <button type="button" class="counter-btn" @click="removeVoyageur" :disabled="reservationState.nbPersonnes <= 1">−</button>
            <span class="counter-val">{{ reservationState.nbPersonnes }}</span>
            <button type="button" class="counter-btn" @click="addVoyageur" :disabled="reservationState.nbPersonnes >= 10">+</button>
          </div>
        </div>

      </div>

      <div class="travelers-section" v-if="reservationState.nbPersonnes > 0">
        <h2 class="section-title">Détails des participants</h2>
        <p class="section-subtitle">Veuillez renseigner les informations pour chaque personne.</p>

        <div class="traveler-card" v-for="(voyageur, index) in reservationState.voyageurs" :key="index">
          <div class="traveler-header">
            <span>Participant {{ index + 1 }}</span>
            <button class="btn-remove-person" v-if="reservationState.nbPersonnes > 1" @click="removeSpecificVoyageur(index)" title="Retirer ce participant">
              ✕ Retirer
            </button>
          </div>
          
          <div class="traveler-form-row">
            <div class="t-field">
              <label>Prénom</label>
              <input type="text" v-model="voyageur.prenom" placeholder="Ex: Jean" required />
            </div>
            
            <div class="t-field">
              <label>Nom</label>
              <input type="text" v-model="voyageur.nom" placeholder="Ex: Dupont" required />
            </div>

            <div class="t-field">
              <label>Date de Naissance</label>
              <input type="date" v-model="voyageur.dateNaissance" :max="minDate" required />
            </div>
          </div>
        </div>
        
        <div class="bottom-actions">
          <button class="btn-submit-large" @click="goToStep2" :disabled="!isFormValid">
            Continuer vers le récapitulatif ➔
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import reservationService from '../services/reservationService';
import { reservationState } from '../stores/reservationState';

const router = useRouter();
const transports = ref<any[]>([]);

// --- CARROUSEL ---
const currentImageIndex = ref(0);
const carouselSlides = ref([
  { id: 1, label: 'Image Principale (ex: Vue du Resort)' },
  { id: 2, label: 'Image 2 (ex: Chambre Spacieuse)' },
  { id: 3, label: 'Image 3 (ex: Piscine Club Med)' },
  { id: 4, label: 'Image 4 (ex: Activités Sportives)' }
]);

const nextSlide = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % carouselSlides.value.length;
};
const prevSlide = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + carouselSlides.value.length) % carouselSlides.value.length;
};
const goToSlide = (index: number) => {
  currentImageIndex.value = index;
};
// -----------------

// Limites de dates
const today = new Date();
const nextYear = new Date();
nextYear.setFullYear(today.getFullYear() + 1);
const minDate = ref(today.toISOString().split('T')[0]);
const maxDate = ref(nextYear.toISOString().split('T')[0]);

const minDateForFin = computed(() => {
  return reservationState.dateDebut ? reservationState.dateDebut : minDate.value;
});

onMounted(async () => {
  try {
    transports.value = await reservationService.getTransports();
  } catch (error) {
    console.error("Erreur API :", error);
  }
});

const updateTransportInfo = () => {
  const t = transports.value.find(t => t.transportId === reservationState.transportId);
  if (t) {
    reservationState.transportInfo = t.transportLieuDepart;
    reservationState.transportPrix = t.transportPrix;
  }
};

// --- GESTION DYNAMIQUE DES VOYAGEURS ---
const addVoyageur = () => {
  if (reservationState.nbPersonnes < 10) {
    reservationState.nbPersonnes++;
    reservationState.voyageurs.push({ nom: '', prenom: '', dateNaissance: '' });
  }
};

const removeVoyageur = () => {
  if (reservationState.nbPersonnes > 1) {
    reservationState.nbPersonnes--;
    reservationState.voyageurs.pop();
  }
};

const removeSpecificVoyageur = (index: number) => {
  if (reservationState.nbPersonnes > 1) {
    reservationState.nbPersonnes--;
    reservationState.voyageurs.splice(index, 1);
  }
};

// Validation du formulaire entier
const isFormValid = computed(() => {
  if (!reservationState.dateDebut || !reservationState.dateFin || !reservationState.transportId) return false;
  // Vérifie que chaque voyageur a bien toutes ses infos remplies
  for (let v of reservationState.voyageurs) {
    if (!v.nom || !v.prenom || !v.dateNaissance) return false;
  }
  return true;
});

const goToStep2 = () => {
  const d1 = new Date(reservationState.dateDebut).getTime();
  const d2 = new Date(reservationState.dateFin).getTime();
  const jours = Math.ceil((d2 - d1) / (1000 * 3600 * 24));
  
  reservationState.prixEstime = (jours > 0 ? jours : 1) * 100 * reservationState.nbPersonnes + reservationState.transportPrix;
  router.push('/reservation/step2');
};
</script>

<style scoped>
/* VARIABLES CLUB MED */
:root {
  --text-color: #002654; /* Bleu marin Club Med */
  --border-color: #E2E2E2;
  --primary-btn: #0071CE; /* Bleu ciel action */
  --primary-btn-hover: #005A9C;
  --bg-color: #F9F9F9;
}

.page-wrapper {
  color: var(--text-color);
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  padding-bottom: 80px;
}
.page-wrapper * { color: #002654; } 

/* BANNERS / IMAGES PLACEHOLDERS */
.placeholder-img {
  background-color: #EAEAEA;
  border: 2px dashed #B0B0B0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #707070 !important;
  font-weight: bold;
  font-size: 14px;
}
.placeholder-img span { color: #707070 !important; }

/* NOUVEAU CARROUSEL */
.carousel-container {
  width: 100%;
  padding: 20px 0;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
}
.carousel-slider {
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 500px;
}
.carousel-slide {
  min-width: 100%;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 16px;
}

/* BOUTONS CARROUSEL */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  font-size: 24px;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 50%;
  color: #002654;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: background-color 0.3s;
  z-index: 10;
}
.carousel-btn:hover { background-color: white; }
.prev-btn { left: 20px; }
.next-btn { right: 20px; }

/* INDICATEURS CARROUSEL */
.carousel-indicators {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  border: 1px solid rgba(0, 38, 84, 0.2);
  transition: background-color 0.3s;
}
.dot.active, .dot:hover { background-color: #0071CE; border-color: white; }

/* CONTENU PRINCIPAL */
.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}
.resort-title { font-size: 32px; font-weight: 700; margin: 20px 0 5px 0; }
.resort-location { font-size: 16px; font-weight: 500; text-decoration: underline; margin-bottom: 30px; }

/* BARRE DE RÉSERVATION */
.booking-bar {
  display: flex;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 40px;
  padding: 10px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  align-items: center;
  position: sticky;
  top: 20px;
  z-index: 100;
}
.booking-field {
  flex: 1;
  padding: 5px 20px;
  display: flex;
  flex-direction: column;
}
.border-right { border-right: 1px solid var(--border-color); }

.booking-field label { font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px; }
.booking-field input, .booking-field select {
  border: none;
  font-size: 15px;
  font-weight: 500;
  padding: 0;
  outline: none;
  background: transparent;
  cursor: pointer;
}

/* Compteur Voyageurs */
.traveler-counter {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 2px;
}
.counter-btn {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: #fff;
  font-size: 16px; font-weight: bold;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.counter-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.counter-val { font-size: 16px; font-weight: 600; }

/* SECTION VOYAGEURS (Détails) */
.travelers-section { margin-top: 50px; padding-top: 30px; border-top: 1px solid var(--border-color); }
.section-title { font-size: 24px; font-weight: 700; margin-bottom: 5px; }
.section-subtitle { font-size: 15px; margin-bottom: 25px; }

.traveler-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 20px;
  background: #FFFFFF;
}
.traveler-header { 
  font-size: 18px; 
  font-weight: 700; 
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #EAEAEA;
  padding-bottom: 10px;
}
.traveler-form-row { display: flex; gap: 20px; }
.t-field { flex: 1; display: flex; flex-direction: column; }
.t-field label { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.t-field input {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  outline: none;
}
.t-field input:focus { border-color: #000; }

/* NOUVEAU BOUTON EN BAS */
.bottom-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
.btn-submit-large {
  background-color: var(--primary-btn);
  color: #FFFFFF !important;
  border: none;
  border-radius: 6px;
  padding: 16px 40px;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(0, 113, 206, 0.3);
}
.btn-submit-large:hover:not(:disabled) {
  background-color: var(--primary-btn-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 113, 206, 0.5);
}
.btn-submit-large:disabled {
  background-color: #E0E0E0;
  color: #888888 !important;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* BOUTON SUPPRIMER */
.btn-remove-person {
  background: none;
  border: none;
  color: #D32F2F !important;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
}
.btn-remove-person:hover { background: #FFEBEE; }

@media (max-width: 900px) {
  .booking-bar { flex-direction: column; border-radius: 20px; align-items: stretch; }
  .booking-field { padding: 15px; border-right: none; border-bottom: 1px solid var(--border-color); }
  .booking-field:last-child { border-bottom: none; }
  .traveler-form-row { flex-direction: column; }
  .carousel-img.main-img { width: 80%; }
  .carousel-img:not(.main-img) { width: 80%; }
  .bottom-actions { justify-content: center; }
  .btn-submit-large { width: 100%; text-align: center; }
}
</style>
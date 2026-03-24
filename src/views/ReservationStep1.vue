<template>
  <div class="page-wrapper">
    
    <div class="carousel-container">
      <div class="carousel-scroll">
        <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80" alt="Resort 1" class="carousel-img main-img" />
        <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80" alt="Resort 2" class="carousel-img" />
        <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80" alt="Resort 3" class="carousel-img" />
        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" alt="Resort 4" class="carousel-img" />
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
          <div class="traveler-header">Participant {{ index + 1 }}</div>
          
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
/* VARIABLES */
:root {
  --text-color: #000000;
  --border-color: #DDDDDD;
  --primary-btn: #FFC72C; /* Jaune Soleil Club Med */
  --primary-btn-hover: #f0b91d;
  --bg-color: #FFFFFF;
}

.page-wrapper {
  color: var(--text-color);
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  padding-bottom: 80px;
}
.page-wrapper * { color: #000000; } /* Écriture forcée en noir */

/* CARROUSEL SCROLLABLE */
.carousel-container {
  width: 100%;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.carousel-scroll {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  border-radius: 16px;
  scroll-snap-type: x mandatory;
}
.carousel-scroll::-webkit-scrollbar { display: none; }
.carousel-img {
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  scroll-snap-align: start;
  flex: 0 0 auto;
}
.main-img { width: 50%; }
.carousel-img:not(.main-img) { width: 25%; }

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
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  background: #FAFAFA;
}
.traveler-header { font-size: 16px; font-weight: 700; margin-bottom: 15px; }
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
  color: #000000 !important;
  border: none;
  border-radius: 30px;
  padding: 16px 40px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(255, 199, 44, 0.3);
}
.btn-submit-large:hover:not(:disabled) {
  background-color: var(--primary-btn-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 199, 44, 0.5);
}
.btn-submit-large:disabled {
  background-color: #E0E0E0;
  color: #888888 !important;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

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
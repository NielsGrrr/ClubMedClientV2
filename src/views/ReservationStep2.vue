<template>
  <div class="page-wrapper flex-center">
    <div class="reservation-container horizontal-layout">

      <div class="card">
        <h1 class="page-title">Un dernier coup d'œil</h1>
        <p class="page-subtitle">Vérifiez vos choix avant de finaliser la demande.</p>

        <div class="recap-grid">
          <div class="recap-item demarcated-field">
            <div class="item-label">Destination</div>
            <div class="item-value text-bold text-large">{{ reservationState.clubTitre }}</div>
          </div>

          <div class="recap-item demarcated-field">
            <div class="item-label">Séjour</div>
            <div class="item-value text-bold">Du {{ formatDate(reservationState.dateDebut) }}<br>au {{ formatDate(reservationState.dateFin) }}</div>
          </div>

          <div class="recap-item demarcated-field">
            <div class="item-label">Transport</div>
            <div class="item-value text-bold">{{ reservationState.transportInfo }}</div>
          </div>

          <div class="recap-item demarcated-field">
            <div class="item-label">Participants ({{ reservationState.nbPersonnes }})</div>
            <div class="item-value text-bold">
              <span v-for="(v, index) in reservationState.voyageurs" :key="index" class="traveler-name">
                • {{ v.prenom }} {{ v.nom }}
              </span>
            </div>
          </div>
        </div>

        <div class="price-highlight-box">
          <div class="price-content">
            <span class="price-label">Prix Total Estimé (TTC)</span>
            <span class="price-value">{{ reservationState.prixEstime }} €</span>
          </div>
        </div>

        <div class="actions-row mt-4">
          <button @click="router.push('/reservation/step1')" class="btn btn-secondary">
            Modifier mes choix
          </button>
          <button @click="validerReservation" class="btn btn-primary">
            Confirmer et Ajouter au Panier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { reservationState, resetReservationState } from '../stores/reservationState';
import reservationService from '../services/reservationService';

const router = useRouter();
const currentClientId = 1; 

const validerReservation = async () => {
  // Formatage du payload incluant le tableau C# `AutresVoyageurs` généré par le créateur
  const payload = {
    clubId: parseInt(reservationState.clubId as string, 10),
    transportId: parseInt(reservationState.transportId as string, 10),
    clientNum: currentClientId, 
    resaDateDebut: new Date(reservationState.dateDebut).toISOString(),
    resaDateFin: new Date(reservationState.dateFin).toISOString(),
    resaNbPersonnes: parseInt(reservationState.nbPersonnes as string, 10),
    resaPrix: parseFloat(reservationState.prixEstime as string),
    resaStatut: "EN_ATTENTE",
    
    // Le nom de la propriété doit correspondre à ton modèle C# (camelCase géré par le JSON parser)
    autresVoyageurs: reservationState.voyageurs.map(v => ({
      voyNom: v.nom,
      voyPrenom: v.prenom,
      voyDateNaissance: new Date(v.dateNaissance).toISOString()
    }))
  };

  try {
    await reservationService.createReservation(payload);
    resetReservationState();
    router.push('/panier'); 
  } catch (error: any) {
    alert("Erreur technique. L'API a rejeté la demande.");
    console.error(error);
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR');
};
</script>

<style scoped>
.page-wrapper {
  color: #000000;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  padding-bottom: 60px;
}
.page-wrapper * { color: #000000; }

.flex-center { display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
.horizontal-layout { width: 100%; max-width: 1000px; }

.card { border: 1px solid #DDDDDD; border-radius: 16px; padding: 40px; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }

.page-title { font-size: 32px; font-weight: 800; text-align: center; margin-bottom: 5px; margin-top: 0;}
.page-subtitle { color: #555 !important; text-align: center; margin-bottom: 40px; font-size: 16px; margin-top: 0;}

.recap-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 35px;
}

.demarcated-field {
  border: 1px solid #DDDDDD;
  padding: 25px 20px;
  border-radius: 12px;
  background-color: #FAFAFA;
}

.item-label { font-size: 13px; font-weight: 700; color: #555 !important; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;}
.item-value { line-height: 1.5; font-size: 15px;}
.text-bold { font-weight: 700; }
.text-large { font-size: 18px; }
.traveler-name { display: block; margin-top: 4px; font-weight: 500;}

.price-highlight-box {
  background-color: #F3F3F3;
  border-radius: 12px;
  padding: 25px 40px;
  margin-bottom: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.price-content { display: flex; align-items: center; gap: 20px; }
.price-label { font-size: 16px; font-weight: 700; text-transform: uppercase; color: #555 !important;}
.price-value { font-size: 36px; font-weight: 800; letter-spacing: 1px; }

.actions-row { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-top: 30px;}
.btn {
  padding: 16px 30px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  flex: 1;
}

.btn-primary { background-color: #000; color: #fff !important; }
.btn-primary:hover { background-color: #333; }

.btn-secondary { background-color: transparent; border: 1px solid #000; color: #000 !important; }
.btn-secondary:hover { background-color: #f5f5f5; }

@media (max-width: 768px) {
  .recap-grid { grid-template-columns: 1fr; }
  .actions-row { flex-direction: column-reverse; }
  .btn { width: 100%; }
}
</style>
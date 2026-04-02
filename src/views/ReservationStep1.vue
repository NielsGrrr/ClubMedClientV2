<template>
  <div>
    <!-- STEPPER -->
    <nav class="cm-stepper">
      <div class="cm-step active">
        <div class="cm-step-bubble">1</div>
        <span class="cm-step-label">Séjour</span>
      </div>
      <div class="cm-step-line"></div>
      <div class="cm-step">
        <div class="cm-step-bubble">2</div>
        <span class="cm-step-label">Activités</span>
      </div>
      <div class="cm-step-line"></div>
      <div class="cm-step">
        <div class="cm-step-bubble">3</div>
        <span class="cm-step-label">Transport</span>
      </div>
      <div class="cm-step-line"></div>
      <div class="cm-step">
        <div class="cm-step-bubble">4</div>
        <span class="cm-step-label">Récapitulatif</span>
      </div>
    </nav>

    <div class="cm-page">
      <div class="cm-page-header">
        <h1>{{ reservationState.clubTitre }}</h1>
        <p>Sélectionnez votre séjour, vos dates et vos participants</p>
      </div>

      <!-- ALERTE MINEUR SEUL -->
      <div v-if="alerteMineurSeul" class="cm-alert cm-alert-danger cm-mb-4">
        ⚠️ Un mineur ne peut pas voyager seul. Veuillez ajouter au moins un accompagnateur adulte.
      </div>

      <div class="cm-page-inner">
        <!-- ═══ COLONNE GAUCHE ═══ -->
        <div>

          <!-- SECTION : Type de chambre -->
          <div class="cm-section">
            <div class="cm-section-title">Type de chambre</div>
            <div v-if="loadingChambres" class="cm-loading">
              <div class="cm-spinner"></div> Chargement des chambres...
            </div>
            <div v-else class="cm-cards-grid">
              <div
                v-for="tc in typesChambres"
                :key="tc.idTypeChambre"
                class="cm-card-select"
                :class="{ selected: reservationState.typeChambreId === tc.idTypeChambre, disabled: tc.indisponible }"
                @click="!tc.indisponible && selectTypeChambre(tc)"
              >
                <div class="cm-card-label">{{ tc.nomType }}</div>
                <div class="cm-card-sub">{{ tc.surface }} m² · max {{ tc.capaciteMax }} pers.</div>
                <div v-if="tc.textePresentation" class="cm-card-sub" style="margin-top:4px;font-style:italic;">{{ tc.textePresentation }}</div>
                <div class="cm-card-price">{{ getPrixChambreDefaut(tc.nomType) }} € <span style="font-size:11px;font-weight:500;color:var(--cm-text-light)">/nuit/pers.</span></div>
                <div v-if="tc.indisponible" class="cm-card-badge" style="background:#FEE2E2;color:#991B1B;">Indisponible</div>
              </div>
            </div>

            <!-- COMPTEUR DE CHAMBRES (affiché seulement quand un type est sélectionné) -->
            <div v-if="reservationState.typeChambreId" class="chambres-counter-row">
              <div>
                <div style="font-weight:700;font-size:14px;color:var(--cm-bleu);">
                  Nombre de chambres <em style="font-weight:400;font-style:normal;">{{ reservationState.typeChambreNom }}</em>
                </div>
                <div style="font-size:12px;color:var(--cm-text-light);margin-top:2px;">
                  Chaque chambre peut accueillir jusqu'à {{ reservationState.typeChambreCapaciteMax }} personne(s)
                </div>
              </div>
              <div class="cm-counter">
                <button class="cm-counter-btn" @click="removeChambres" :disabled="reservationState.nbChambres <= 1">−</button>
                <span class="cm-counter-val">{{ reservationState.nbChambres }}</span>
                <button class="cm-counter-btn" @click="addChambres" :disabled="reservationState.nbChambres >= 10">+</button>
              </div>
            </div>

            <div v-if="!loadingChambres && !reservationState.typeChambreId" class="cm-alert cm-alert-info cm-mt-4" style="margin-bottom:0">
              ℹ️ Veuillez sélectionner un type de chambre pour continuer.
            </div>
          </div>

          <!-- SECTION : Dates -->
          <div class="cm-section">
            <div class="cm-section-title">Dates de séjour</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div class="cm-field">
                <label class="cm-label">Date d'arrivée</label>
                <input
                  type="date"
                  class="cm-input"
                  v-model="reservationState.dateDebut"
                  :min="minDate"
                  :max="maxDate"
                  @change="onDateDebutChange"
                />
              </div>
              <div class="cm-field">
                <label class="cm-label">Date de départ</label>
                <input
                  type="date"
                  class="cm-input"
                  v-model="reservationState.dateFin"
                  :min="minDateFin"
                  :max="maxDate"
                  @change="calculerPrixStore"
                />
              </div>
            </div>
            <div v-if="nbNuits > 0" class="cm-alert cm-alert-info" style="margin-top:14px;margin-bottom:0">
              📅 Durée du séjour : <strong>{{ nbNuits }} nuit{{ nbNuits > 1 ? 's' : '' }}</strong>
            </div>
          </div>

          <!-- SECTION : Participants -->
          <div class="cm-section">
            <div class="cm-section-title">Participants</div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
              <span style="font-size:14px;color:var(--cm-text-light);">Nombre de participants</span>
              <div class="cm-counter">
                <button class="cm-counter-btn" @click="removeVoyageur" :disabled="reservationState.nbPersonnes <= 1">−</button>
                <span class="cm-counter-val">{{ reservationState.nbPersonnes }}</span>
                <button class="cm-counter-btn" @click="addVoyageur" :disabled="reservationState.nbPersonnes >= maxCapacite">+</button>
              </div>
            </div>

            <div
              v-for="(voyageur, index) in reservationState.voyageurs"
              :key="index"
              class="cm-traveler-card"
            >
              <div class="cm-traveler-header">
                <div class="cm-traveler-header-left">
                  <span>Participant {{ Number(index) + 1 }}</span>
                  <span v-if="voyageur.dateNaissance" :class="voyageur.type === 'adulte' ? 'cm-badge-adulte' : 'cm-badge-enfant'">
                    {{ voyageur.type === 'adulte' ? '🧑 Adulte' : `👧 Enfant ${getAge(voyageur.dateNaissance)} ans` }}
                  </span>
                </div>
                <button
                  v-if="reservationState.nbPersonnes > 1"
                  class="cm-btn-remove"
                  @click="removeSpecificVoyageur(Number(index))"
                >✕ Retirer</button>
              </div>
              <div class="cm-traveler-body">
                <div class="cm-field">
                  <label class="cm-label">Prénom</label>
                  <input type="text" class="cm-input" v-model="voyageur.prenom" placeholder="Jean" />
                </div>
                <div class="cm-field">
                  <label class="cm-label">Nom</label>
                  <input type="text" class="cm-input" v-model="voyageur.nom" placeholder="Dupont" />
                </div>
                <div class="cm-field">
                  <label class="cm-label">Date de naissance</label>
                  <input
                    type="date"
                    class="cm-input"
                    v-model="voyageur.dateNaissance"
                    :max="today"
                    @change="onDateNaissanceChange(voyageur)"
                  />
                </div>
              </div>
            </div>

            <!-- Résumé adultes/enfants -->
            <div v-if="hasAnyBirthdate" style="margin-top:12px;">
              <div class="cm-alert cm-alert-info" style="margin-bottom:0">
                👥 {{ nbAdultes }} adulte{{ nbAdultes > 1 ? 's' : '' }}
                <span v-if="nbEnfants > 0"> · {{ nbEnfants }} enfant{{ nbEnfants > 1 ? 's' : '' }}</span>
              </div>
            </div>
          </div>

          <!-- ACTIONS -->
          <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:8px;">
            <button v-if="reservationState.editMode" class="cm-btn cm-btn-secondary" @click="annulerModification">
              Annuler
            </button>
            <button class="cm-btn cm-btn-primary" @click="goToStep2" :disabled="!isFormValid || alerteMineurSeul">
              {{ reservationState.editMode ? 'Continuer la modification →' : 'Continuer vers les Activités →' }}
            </button>
          </div>
        </div>

        <!-- ═══ SIDEBAR PRIX ═══ -->
        <aside class="cm-price-sidebar">
          <div class="cm-price-sidebar-title">Récapitulatif</div>

          <div v-if="!reservationState.typeChambreId" style="color:rgba(255,255,255,0.5);font-size:13px;text-align:center;padding:20px 0;">
            Sélectionnez une chambre pour voir le prix estimé.
          </div>

          <template v-else>
            <div class="cm-price-line">
              <span class="cm-price-line-label">{{ reservationState.clubTitre }}</span>
            </div>
            <div class="cm-price-line">
              <span class="cm-price-line-label">Chambre</span>
              <span class="cm-price-line-value">{{ reservationState.typeChambreNom }}</span>
            </div>
            <div class="cm-price-line">
              <span class="cm-price-line-label">× {{ reservationState.nbChambres }} chambre{{ reservationState.nbChambres > 1 ? 's' : '' }}</span>
            </div>
            <div class="cm-price-line">
              <span class="cm-price-line-label">{{ nbNuits }} nuit{{ nbNuits > 1 ? 's' : '' }} × {{ reservationState.nbPersonnes }} pers.</span>
              <span class="cm-price-line-value">{{ prixChambreTotal }} €</span>
            </div>
            <hr class="cm-price-divider" />
            <div class="cm-price-total">
              <span class="cm-price-total-label">Total HT</span>
              <span class="cm-price-total-ht">{{ reservationState.prixHT }} €</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;">
              <span class="cm-price-ttc-label">Total TTC (TVA 10%)</span>
            </div>
            <div class="cm-price-ttc-value">{{ reservationState.prixTTC }} €</div>
            <p class="cm-price-tva">* Prix indicatif, activités et transport non inclus</p>
          </template>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/clubmed.css';
import {
  reservationState,
  getPrixChambreDefaut,
  calculerAge,
  updateVoyageurType,
  getNbNuits,
  calculerPrix,
  resetReservationState,
  type Voyageur,
} from '../stores/reservationState';
import reservationService from '../services/reservationService';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const loadingChambres = ref(true);
const typesChambres = ref<any[]>([]);

const today = new Date().toISOString().split('T')[0];
const nextYear = new Date();
nextYear.setFullYear(nextYear.getFullYear() + 1);
const minDate = today;
const maxDate = nextYear.toISOString().split('T')[0];

const minDateFin = computed(() =>
  reservationState.dateDebut ? reservationState.dateDebut : minDate
);

const nbNuits = computed(() => getNbNuits());
const maxCapacite = computed(() => (reservationState.typeChambreCapaciteMax || 10) * reservationState.nbChambres);

const nbAdultes = computed(() => reservationState.voyageurs.filter((v: Voyageur) => v.type === 'adulte').length);
const nbEnfants = computed(() => reservationState.voyageurs.filter((v: Voyageur) => v.type === 'enfant').length);
const hasAnyBirthdate = computed(() => reservationState.voyageurs.some((v: Voyageur) => v.dateNaissance));

const alerteMineurSeul = computed(() => {
  const allHaveDate = reservationState.voyageurs.every((v: Voyageur) => v.dateNaissance);
  if (!allHaveDate) return false;
  return nbAdultes.value === 0 && nbEnfants.value > 0;
});

const prixChambreTotal = computed(() => {
  if (!reservationState.typeChambreId || nbNuits.value === 0) return 0;
  return nbNuits.value * reservationState.typeChambrePrixNuit * reservationState.nbPersonnes * reservationState.nbChambres;
});

const getAge = (dateNaissance: string) => calculerAge(dateNaissance);

onMounted(async () => {
    const authStore = useAuthStore();
    if (authStore.user && reservationState.voyageurs.length > 0 && !reservationState.voyageurs[0].nom) {
      reservationState.voyageurs[0].nom = authStore.user.nom || '';
      reservationState.voyageurs[0].prenom = authStore.user.prenom || '';
      if (authStore.user.dateNaissance) {
        reservationState.voyageurs[0].dateNaissance = authStore.user.dateNaissance.split('T')[0];
        updateVoyageurType(reservationState.voyageurs[0]);
      }
    }
  try {
    const all = await reservationService.getTypeChambresByClub(reservationState.clubId);
    typesChambres.value = all.length > 0 ? all : await reservationService.getTypeChambres();
  } catch {
    try { typesChambres.value = await reservationService.getTypeChambres(); } catch { /* silent */ }
  } finally {
    loadingChambres.value = false;
  }
});

const selectTypeChambre = (tc: any) => {
  if (tc.indisponible) return;
  reservationState.typeChambreId = tc.idTypeChambre;
  reservationState.typeChambreNom = tc.nomType;
  reservationState.typeChambrePrixNuit = getPrixChambreDefaut(tc.nomType);
  reservationState.typeChambreCapaciteMax = tc.capaciteMax;
  calculerPrix();
};

const addChambres = () => {
  if (reservationState.nbChambres < 10) {
    reservationState.nbChambres++;
    calculerPrix();
  }
};

const removeChambres = () => {
  if (reservationState.nbChambres > 1) {
    reservationState.nbChambres--;
    // Réduire nb personnes si > capacité totale
    const capaciteTotale = reservationState.typeChambreCapaciteMax * reservationState.nbChambres;
    if (reservationState.nbPersonnes > capaciteTotale) {
      const diff = reservationState.nbPersonnes - capaciteTotale;
      reservationState.nbPersonnes -= diff;
      reservationState.voyageurs.splice(capaciteTotale);
    }
    calculerPrix();
  }
};

const onDateDebutChange = () => {
  if (reservationState.dateFin && reservationState.dateFin <= reservationState.dateDebut) {
    reservationState.dateFin = '';
  }
  calculerPrix();
};

const calculerPrixStore = () => calculerPrix();

const onDateNaissanceChange = (voyageur: Voyageur) => {
  updateVoyageurType(voyageur);
};

const addVoyageur = () => {
  if (reservationState.nbPersonnes < maxCapacite.value) {
    reservationState.nbPersonnes++;
    reservationState.voyageurs.push({
      nom: '', prenom: '', dateNaissance: '', type: 'adulte', activitesSelectionnees: []
    });
    calculerPrix();
  }
};

const removeVoyageur = () => {
  if (reservationState.nbPersonnes > 1) {
    reservationState.nbPersonnes--;
    reservationState.voyageurs.pop();
    calculerPrix();
  }
};

const removeSpecificVoyageur = (index: number) => {
  if (reservationState.nbPersonnes > 1) {
    reservationState.nbPersonnes--;
    reservationState.voyageurs.splice(index, 1);
    calculerPrix();
  }
};

const isFormValid = computed(() => {
  if (!reservationState.typeChambreId) return false;
  if (!reservationState.dateDebut || !reservationState.dateFin) return false;
  for (const v of reservationState.voyageurs) {
    if (!v.nom || !v.prenom || !v.dateNaissance) return false;
  }
  return true;
});

const annulerModification = () => {
  resetReservationState();
  router.push('/panier');
};

const goToStep2 = () => {
  calculerPrix();
  router.push('/reservation/step2');
};
</script>

<style scoped>
.cm-card-select.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.chambres-counter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px 20px;
  background: var(--cm-sable);
  border-radius: var(--cm-radius-md);
  border: 1.5px solid var(--cm-border);
  gap: 20px;
}
</style>

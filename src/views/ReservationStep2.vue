<template>
  <div>
    <!-- STEPPER -->
    <nav class="cm-stepper">
      <div class="cm-step done">
        <div class="cm-step-bubble">✓</div>
        <span class="cm-step-label">Séjour</span>
      </div>
      <div class="cm-step-line done"></div>
      <div class="cm-step active">
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
        <h1>Choisissez vos activités</h1>
        <p>Chaque participant peut choisir ses propres activités</p>
      </div>

      <div class="cm-page-inner">
        <!-- ═══ COLONNE GAUCHE ═══ -->
        <div>
          <!-- ONGLETS PAR VOYAGEUR -->
          <div class="cm-tabs">
            <div
              v-for="(voyageur, index) in reservationState.voyageurs"
              :key="index"
              class="cm-tab"
              :class="{ active: activeVoyageurIndex === Number(index) }"
              @click="activeVoyageurIndex = Number(index)"
            >
              {{ voyageur.prenom || `Participant ${Number(index) + 1}` }}
              <span :class="voyageur.type === 'adulte' ? 'cm-badge-adulte' : 'cm-badge-enfant'" style="margin-left:6px;">
                {{ voyageur.type === 'adulte' ? '🧑' : '👧' }}
              </span>
            </div>
          </div>

          <!-- ACTIVITÉS pour le voyageur sélectionné -->
          <div class="cm-section" v-if="activeVoyageur">
            <div class="cm-section-title">
              Activités pour {{ activeVoyageur.prenom || `Participant ${activeVoyageurIndex + 1}` }}
              <span v-if="activeVoyageur.activitesSelectionnees.length > 0" style="margin-left:auto;font-size:12px;color:var(--cm-vert);font-weight:600;">
                {{ activeVoyageur.activitesSelectionnees.length }} activité{{ activeVoyageur.activitesSelectionnees.length > 1 ? 's' : '' }} sélectionnée{{ activeVoyageur.activitesSelectionnees.length > 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Blocage enfant < 8 ans -->
            <div v-if="activeVoyageurEstTropJeune" class="cm-alert cm-alert-danger" style="margin-bottom:12px;">
              ⛔ {{ activeVoyageur.prenom || `Participant ${activeVoyageurIndex + 1}` }} a moins de 8 ans et ne peut pas participer aux activités adultes.
            </div>

            <div v-if="loadingActivites" class="cm-loading">
              <div class="cm-spinner"></div> Chargement des activités...
            </div>

            <div v-else-if="activites.length === 0" class="cm-alert cm-alert-info">
              Aucune activité disponible pour ce resort.
            </div>

            <div v-else style="display:flex;flex-direction:column;gap:12px;">
              <div
                v-for="activite in activites"
                :key="activite.actiAdulteId"
                class="cm-activity-card"
                :class="{
                  checked: isActiviteSelected(activeVoyageurIndex, activite.actiAdulteId),
                  'cm-activity-disabled': activeVoyageurEstTropJeune
                }"
                @click="!activeVoyageurEstTropJeune && toggleActivite(activeVoyageurIndex, activite.actiAdulteId)"
              >
                <div class="cm-activity-checkbox">
                  <span v-if="isActiviteSelected(activeVoyageurIndex, activite.actiAdulteId)">✓</span>
                </div>
                <div style="flex:1;">
                  <div style="font-weight:700;color:var(--cm-bleu);font-size:14px;margin-bottom:4px;">
                    {{ activite.actiAdulteTitre }}
                  </div>
                  <div style="font-size:12px;color:var(--cm-text-light);margin-bottom:8px;">
                    {{ activite.actiAdulteDescription }}
                  </div>
                  <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <span class="cm-card-badge">
                      Fréquence : {{ activite.actiAdulteFrequence }}
                    </span>
                    <span class="cm-card-badge" style="background:var(--cm-vert);color:white;">
                      {{ activite.actiAdulteDuree }} h
                    </span>
                    <span v-if="activite.actiAdulteAgeMin > 0" class="cm-card-badge" style="background:#f59e0b;color:white;">
                      {{ activite.actiAdulteAgeMin }}+ ans
                    </span>
                  </div>
                </div>
                <!-- VRAI PRIX DE LA BASE DE DONNEES -->
                <div style="text-align:right;flex-shrink:0;">
                  <div class="cm-card-price">{{ activite.actiAdultePrixMin }} €</div>
                  <div style="font-size:11px;color:var(--cm-text-muted);">/ pers.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- NAVIGATION -->
          <div style="display:flex;justify-content:space-between;margin-top:8px;">
            <button class="cm-btn cm-btn-secondary" @click="router.push('/reservation/step1')">
              ← Retour
            </button>
            <button class="cm-btn cm-btn-primary" @click="goToStep3">
              Continuer vers le Transport →
            </button>
          </div>
        </div>

        <!-- ═══ SIDEBAR PRIX ═══ -->
        <aside class="cm-price-sidebar">
          <div class="cm-price-sidebar-title">Récapitulatif</div>

          <div class="cm-price-line">
            <span class="cm-price-line-label">Séjour</span>
            <span class="cm-price-line-value">{{ prixSejour }} €</span>
          </div>
          <div class="cm-price-line" v-if="reservationState.typeChambreNom">
            <span class="cm-price-line-label">{{ reservationState.typeChambreNom }}</span>
          </div>
          <div class="cm-price-line">
            <span class="cm-price-line-label">{{ nbNuits }} nuit{{ nbNuits > 1 ? 's' : '' }} · {{ reservationState.nbPersonnes }} pers.</span>
          </div>

          <hr class="cm-price-divider" />

          <div class="cm-price-line">
            <span class="cm-price-line-label">Activités</span>
            <span class="cm-price-line-value">{{ prixActivitesTotal }} €</span>
          </div>

          <!-- Détail activités par personne -->
          <div
            v-for="(voyageur, index) in reservationState.voyageurs"
            :key="index"
            style="margin-bottom:6px;"
          >
            <div class="cm-price-line" v-if="voyageur.activitesSelectionnees.length > 0">
              <span class="cm-price-line-label" style="font-size:11px;">
                  {{ voyageur.prenom || `Pers. ${Number(index) + 1}` }} ({{ voyageur.activitesSelectionnees.length }} act.)
              </span>
              <span class="cm-price-line-value" style="font-size:11px;">
                {{ getPrixActivitesVoyageur(voyageur) }} €
              </span>
            </div>
          </div>

          <hr class="cm-price-divider" />

          <div class="cm-price-total">
            <span class="cm-price-total-label">Total HT</span>
            <span class="cm-price-total-ht">{{ reservationState.prixHT }} €</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <span class="cm-price-ttc-label">Total TTC</span>
          </div>
          <div class="cm-price-ttc-value">{{ reservationState.prixTTC }} €</div>
          <p class="cm-price-tva">* Transport non inclus</p>
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
  getNbNuits,
  calculerPrix,
  calculerAge,
  type Voyageur,
} from '../stores/reservationState';
import reservationService from '../services/reservationService';

const router = useRouter();
const loadingActivites = ref(true);
const activites = ref<any[]>([]);
const activeVoyageurIndex = ref(0);

const activeVoyageur = computed(() => reservationState.voyageurs[activeVoyageurIndex.value]);
const nbNuits = computed(() => getNbNuits());

// Vérifie si le voyageur actif a moins de 8 ans (bloqué des activités adultes)
const activeVoyageurEstTropJeune = computed(() => {
  const v = activeVoyageur.value;
  if (!v || !v.dateNaissance) return false;
  return calculerAge(v.dateNaissance) < 8;
});

const prixSejour = computed(() => {
  return nbNuits.value * reservationState.typeChambrePrixNuit * reservationState.nbPersonnes;
});

const getPrixActivitesVoyageur = (voyageur: Voyageur) => {
  return voyageur.activitesSelectionnees.reduce((total, id) => {
    const act = activites.value.find(a => a.actiAdulteId === id);
    return total + (act ? act.actiAdultePrixMin : 0);
  }, 0);
};

const prixActivitesTotal = computed(() => {
  return reservationState.voyageurs.reduce((total: number, v: Voyageur) => {
    return total + getPrixActivitesVoyageur(v);
  }, 0);
});

onMounted(async () => {
  try {
    activites.value = await reservationService.getActivitesAdultes();
    reservationState.prixActivites = prixActivitesTotal.value;
  } catch {
    /* silent */
  } finally {
    loadingActivites.value = false;
  }
  calculerPrix();
});

const isActiviteSelected = (voyageurIndex: number, activiteId: number): boolean => {
  return reservationState.voyageurs[voyageurIndex]?.activitesSelectionnees.includes(activiteId) ?? false;
};

const toggleActivite = (voyageurIndex: number, activiteId: number) => {
  const voyageur = reservationState.voyageurs[voyageurIndex];
  if (!voyageur) return;
  const idx = voyageur.activitesSelectionnees.indexOf(activiteId);
  if (idx === -1) {
    voyageur.activitesSelectionnees.push(activiteId);
  } else {
    voyageur.activitesSelectionnees.splice(idx, 1);
  }
  reservationState.prixActivites = prixActivitesTotal.value;
  calculerPrix();
};

const goToStep3 = () => {
  reservationState.prixActivites = prixActivitesTotal.value;
  calculerPrix();
  router.push('/reservation/step3');
};
</script>

<template>
  <div>
    <!-- STEPPER -->
    <nav class="cm-stepper">
      <div class="cm-step done">
        <div class="cm-step-bubble">✓</div>
        <span class="cm-step-label">Séjour</span>
      </div>
      <div class="cm-step-line done"></div>
      <div class="cm-step done">
        <div class="cm-step-bubble">✓</div>
        <span class="cm-step-label">Activités</span>
      </div>
      <div class="cm-step-line done"></div>
      <div class="cm-step active">
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
        <h1>Choisissez le transport</h1>
        <p>Sélectionnez un moyen de transport pour chaque participant</p>
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
              :class="{ active: activeIndex === index }"
              @click="activeIndex = index"
            >
              {{ voyageur.prenom || `Participant ${index + 1}` }}
              <span :class="voyageur.type === 'adulte' ? 'cm-badge-adulte' : 'cm-badge-enfant'" style="margin-left:6px;">
                {{ voyageur.type === 'adulte' ? '🧑' : '👧' }}
              </span>
            </div>
          </div>

          <div class="cm-section" v-if="activeVoyageur">
            <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div class="cm-section-title" style="margin-bottom:0;">Moyen de transport pour {{ activeVoyageur.prenom || 'ce participant' }}</div>
                <button class="cm-btn cm-btn-secondary" style="font-size:12px; padding: 6px 12px;" @click="appliquerATous">
                    🚀 Appliquer à tous
                </button>
            </div>

            <div v-if="loadingTransports" class="cm-loading">
              <div class="cm-spinner"></div> Chargement des transports...
            </div>

            <div v-else style="display:flex;flex-direction:column;gap:12px;">
              <!-- Option SANS transport -->
              <div
                class="cm-transport-card"
                :class="{ selected: activeVoyageur.transportId === null }"
                @click="selectTransportForCurrent(null)"
                style="border-style:dashed;opacity:0.85;"
              >
                <div class="cm-transport-icon">🚶</div>
                <div class="cm-transport-info">
                  <div class="cm-transport-name">Transport autonome</div>
                  <div class="cm-transport-sub">Je m'occupe de mon propre transport</div>
                </div>
                <div class="cm-transport-price" style="color:var(--cm-text-muted);">0 €</div>
              </div>

              <!-- Options depuis l'API -->
              <div
                v-for="transport in transports"
                :key="transport.transportId"
                class="cm-transport-card"
                :class="{ selected: activeVoyageur.transportId === transport.transportId }"
                @click="selectTransportForCurrent(transport)"
              >
                <div class="cm-transport-icon">{{ getTransportIcon(transport.transportLieuDepart) }}</div>
                <div class="cm-transport-info">
                  <div class="cm-transport-name">{{ transport.transportLieuDepart }}</div>
                  <div class="cm-transport-sub">{{ getTransportType(transport.transportLieuDepart) }}</div>
                </div>
                <div class="cm-transport-price">{{ transport.transportPrix }} €</div>
              </div>
            </div>
          </div>

          <!-- NAVIGATION -->
          <div style="display:flex;justify-content:space-between;margin-top:24px;">
            <button class="cm-btn cm-btn-secondary" @click="router.push('/reservation/step2')">
              ← Retour
            </button>
            <button class="cm-btn cm-btn-primary" @click="goToStep4">
              Récapitulatif →
            </button>
          </div>
        </div>

        <!-- ═══ SIDEBAR PRIX ═══ -->
        <aside class="cm-price-sidebar">
          <div class="cm-price-sidebar-title">Détail des coûts</div>

          <div class="cm-price-line">
            <span class="cm-price-line-label">Séjour</span>
            <span class="cm-price-line-value">{{ prixSejour }} €</span>
          </div>
          <div class="cm-price-line">
            <span class="cm-price-line-label">Activités</span>
            <span class="cm-price-line-value">{{ reservationState.prixActivites }} €</span>
          </div>
          <div class="cm-price-line">
            <span class="cm-price-line-label">Total Transports</span>
            <span class="cm-price-line-value">{{ totalTransportPrix }} €</span>
          </div>

          <hr class="cm-price-divider" />

          <div class="cm-price-total">
            <span class="cm-price-total-label">Total HT</span>
            <span class="cm-price-total-ht">{{ reservationState.prixHT }} €</span>
          </div>
          <div class="cm-price-ttc-value">{{ reservationState.prixTTC }} €</div>
          <p class="cm-price-tva">Taxes incluses (10%)</p>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/clubmed.css';
import { reservationState, getNbNuits, calculerPrix } from '../stores/reservationState';
import reservationService from '../services/reservationService';

const router = useRouter();
const loadingTransports = ref(true);
const transports = ref<any[]>([]);
const activeIndex = ref(0);

const activeVoyageur = computed(() => reservationState.voyageurs[activeIndex.value]);
const nbNuits = computed(() => getNbNuits());

const prixSejour = computed(() =>
  nbNuits.value * reservationState.typeChambrePrixNuit * reservationState.nbPersonnes
);

const totalTransportPrix = computed(() =>
  reservationState.voyageurs.reduce((s, v) => s + (v.transportPrix || 0), 0)
);

onMounted(async () => {
  try {
    transports.value = await reservationService.getTransports();
  } catch { /* silent */ }
  finally { loadingTransports.value = false; }
  calculerPrix();
});

const selectTransportForCurrent = (transport: any) => {
  if (!activeVoyageur.value) return;
  activeVoyageur.value.transportId = transport ? transport.transportId : null;
  activeVoyageur.value.transportNom = transport ? transport.transportLieuDepart : 'Transport autonome';
  activeVoyageur.value.transportPrix = transport ? transport.transportPrix : 0;
  calculerPrix();
};

const appliquerATous = () => {
    const current = activeVoyageur.value;
    if (!current) return;
    reservationState.voyageurs.forEach(v => {
        v.transportId = current.transportId;
        v.transportNom = current.transportNom;
        v.transportPrix = current.transportPrix;
    });
    calculerPrix();
};

const getTransportIcon = (lieu: string): string => {
  const l = lieu.toLowerCase();
  if (l.includes('vol') || l.includes('aéroport')) return '✈️';
  if (l.includes('gare') || l.includes('train')) return '🚄';
  return '🚗';
};

const getTransportType = (lieu: string): string => {
  const l = lieu.toLowerCase();
  if (l.includes('vol') || l.includes('aéroport')) return 'Aéroport';
  if (l.includes('gare') || l.includes('train')) return 'Gare';
  return 'Transfert';
};

const goToStep4 = () => {
  calculerPrix();
  router.push('/reservation/step4');
};
</script>
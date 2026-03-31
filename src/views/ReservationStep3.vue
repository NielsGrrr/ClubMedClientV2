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
        <h1>Choisissez votre transport</h1>
        <p>Sélectionnez un moyen de transport commun pour votre groupe · <strong>optionnel</strong></p>
      </div>

      <div class="cm-page-inner">
        <!-- ═══ COLONNE GAUCHE ═══ -->
        <div>
          <div class="cm-section">
            <div class="cm-section-title">Moyen de transport</div>

            <div v-if="loadingTransports" class="cm-loading">
              <div class="cm-spinner"></div> Chargement des transports...
            </div>

            <div v-else style="display:flex;flex-direction:column;gap:12px;">
              <!-- Option SANS transport (sélectionnable) -->
              <div
                class="cm-transport-card"
                :class="{ selected: reservationState.transportId === null }"
                @click="selectSansTransport"
                style="border-style:dashed;opacity:0.85;"
              >
                <div class="cm-transport-icon">🚶</div>
                <div class="cm-transport-info">
                  <div class="cm-transport-name">Sans transport organisé</div>
                  <div class="cm-transport-sub">Je m'occupe de mon propre transport</div>
                </div>
                <div class="cm-transport-price" style="color:var(--cm-text-muted);">0 €</div>
              </div>

              <!-- Options de transport depuis l'API -->
              <div
                v-for="transport in transports"
                :key="transport.transportId"
                class="cm-transport-card"
                :class="{ selected: reservationState.transportId === transport.transportId }"
                @click="selectTransport(transport)"
              >
                <div class="cm-transport-icon">{{ getTransportIcon(transport.transportLieuDepart) }}</div>
                <div class="cm-transport-info">
                  <div class="cm-transport-name">{{ transport.transportLieuDepart }}</div>
                  <div class="cm-transport-sub">{{ getTransportType(transport.transportLieuDepart) }}</div>
                </div>
                <div class="cm-transport-price">{{ transport.transportPrix }} €</div>
              </div>
            </div>

            <!-- Info récapitulatif du choix -->
            <div class="cm-alert cm-alert-info" style="margin-top:16px;margin-bottom:0;">
              <span v-if="reservationState.transportId">
                ✅ Transport sélectionné pour {{ reservationState.nbPersonnes }} personne{{ reservationState.nbPersonnes > 1 ? 's' : '' }}
              </span>
              <span v-else>
                ℹ️ Aucun transport sélectionné — vous pouvez continuer sans transport.
              </span>
            </div>
          </div>

          <!-- NAVIGATION -->
          <div style="display:flex;justify-content:space-between;margin-top:8px;">
            <button class="cm-btn cm-btn-secondary" @click="router.push('/reservation/step2')">
              ← Retour
            </button>
            <button class="cm-btn cm-btn-primary" @click="goToStep4">
              Voir le récapitulatif →
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

          <div class="cm-price-line">
            <span class="cm-price-line-label">Activités</span>
            <span class="cm-price-line-value">{{ prixActivites }} €</span>
          </div>

          <div class="cm-price-line">
            <span class="cm-price-line-label">
              Transport
              <span v-if="reservationState.transportNom" style="display:block;font-size:11px;margin-top:2px;">
                {{ reservationState.transportNom }}
              </span>
              <span v-else style="display:block;font-size:11px;margin-top:2px;opacity:0.6;">Non sélectionné</span>
            </span>
            <span class="cm-price-line-value">{{ reservationState.transportPrix }} €</span>
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
          <p class="cm-price-tva">Taxes incluses</p>
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

const nbNuits = computed(() => getNbNuits());

const prixSejour = computed(() =>
  nbNuits.value * reservationState.typeChambrePrixNuit * reservationState.nbPersonnes
);

const prixActivites = computed(() =>
  reservationState.voyageurs.reduce((total, v) => total + (v.activitesSelectionnees?.length ?? 0) * 15, 0)
);

onMounted(async () => {
  try {
    transports.value = await reservationService.getTransports();
  } catch { /* silent */ }
  finally { loadingTransports.value = false; }
  calculerPrix();
});

const selectTransport = (transport: any) => {
  reservationState.transportId = transport.transportId;
  reservationState.transportNom = transport.transportLieuDepart;
  reservationState.transportPrix = transport.transportPrix;
  calculerPrix();
};

// Option : voyage sans transport organisé
const selectSansTransport = () => {
  reservationState.transportId = null;
  reservationState.transportNom = '';
  reservationState.transportPrix = 0;
  calculerPrix();
};

const getTransportIcon = (lieu: string): string => {
  const l = lieu.toLowerCase();
  if (l.includes('vol') || l.includes('aéroport') || l.includes('cdg') || l.includes('aeroport')) return '✈️';
  if (l.includes('gare') || l.includes('train')) return '🚄';
  if (l.includes('bus') || l.includes('car')) return '🚌';
  if (l.includes('ferry') || l.includes('bateau')) return '⛴️';
  return '🚗';
};

const getTransportType = (lieu: string): string => {
  const l = lieu.toLowerCase();
  if (l.includes('vol') || l.includes('aéroport') || l.includes('cdg')) return 'Transport aérien';
  if (l.includes('gare') || l.includes('train')) return 'Transport ferroviaire';
  if (l.includes('bus') || l.includes('car')) return 'Transport en car';
  return 'Transport terrestre';
};

const goToStep4 = () => {
  calculerPrix();
  router.push('/reservation/step4');
};
</script>
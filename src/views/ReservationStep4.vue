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
      <div class="cm-step done">
        <div class="cm-step-bubble">✓</div>
        <span class="cm-step-label">Transport</span>
      </div>
      <div class="cm-step-line done"></div>
      <div class="cm-step active">
        <div class="cm-step-bubble">4</div>
        <span class="cm-step-label">Récapitulatif</span>
      </div>
    </nav>

    <div class="cm-page">
      <div class="cm-page-header">
        <h1>Récapitulatif de votre séjour</h1>
        <p>Vérifiez vos choix avant d'ajouter au panier</p>
      </div>

      <!-- ERREUR API -->
      <div v-if="erreur" class="cm-alert cm-alert-danger cm-mb-4">
        ⚠️ {{ erreur }}
      </div>

      <div class="cm-page-inner">
        <!-- ═══ COLONNE GAUCHE ═══ -->
        <div>

          <!-- BLOC : DESTINATION & DATES -->
          <div class="cm-section">
            <div class="cm-section-title">Destination & Séjour</div>
            <div class="cm-recap-grid">
              <div class="cm-recap-item">
                <div class="cm-recap-item-label">Destination</div>
                <div class="cm-recap-item-value" style="font-size:18px;font-weight:800;">
                  {{ reservationState.clubTitre }}
                </div>
              </div>
              <div class="cm-recap-item">
                <div class="cm-recap-item-label">Type de chambre</div>
                <div class="cm-recap-item-value">{{ reservationState.typeChambreNom }}</div>
                <div style="font-size:12px;color:var(--cm-text-light);margin-top:4px;">
                  {{ reservationState.typeChambrePrixNuit }} €/nuit/pers.
                </div>
              </div>
              <div class="cm-recap-item">
                <div class="cm-recap-item-label">Arrivée</div>
                <div class="cm-recap-item-value">{{ formatDate(reservationState.dateDebut) }}</div>
              </div>
              <div class="cm-recap-item">
                <div class="cm-recap-item-label">Départ</div>
                <div class="cm-recap-item-value">{{ formatDate(reservationState.dateFin) }}</div>
              </div>
            </div>
            <div class="cm-alert cm-alert-info" style="margin-bottom:0">
              📅 Durée : <strong>{{ nbNuits }} nuit{{ nbNuits > 1 ? 's' : '' }}</strong>
            </div>
          </div>

          <!-- BLOC : PARTICIPANTS -->
          <div class="cm-section">
            <div class="cm-section-title">Participants ({{ reservationState.nbPersonnes }})</div>
            <div
              v-for="(voyageur, index) in reservationState.voyageurs"
              :key="index"
              style="border:1px solid var(--cm-border);border-radius:var(--cm-radius-md);margin-bottom:12px;overflow:hidden;"
            >
              <div style="background:var(--cm-bleu);padding:12px 16px;display:flex;align-items:center;gap:10px;color:white;">
                <span style="font-weight:700;font-size:14px;">{{ voyageur.prenom }} {{ voyageur.nom }}</span>
                <span :class="voyageur.type === 'adulte' ? 'cm-badge-adulte' : 'cm-badge-enfant'">
                  {{ voyageur.type === 'adulte' ? '🧑 Adulte' : `👧 Enfant` }}
                </span>
                <span v-if="voyageur.dateNaissance" style="font-size:12px;color:rgba(255,255,255,0.55);margin-left:auto;">
                  Né(e) le {{ formatDate(voyageur.dateNaissance) }}
                </span>
              </div>
              <div style="padding:14px 16px;background:var(--cm-blanc);">
                <div v-if="!(voyageur.activitesSelectionnees?.length)" style="font-size:13px;color:var(--cm-text-muted);">
                  Aucune activité sélectionnée
                </div>
                <div v-else>
                  <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--cm-text-light);margin-bottom:8px;">
                    Activités choisies
                  </div>
                  <div style="display:flex;flex-wrap:wrap;gap:8px;">
                    <span
                      v-for="activiteId in voyageur.activitesSelectionnees"
                      :key="activiteId"
                      class="cm-card-badge"
                      style="background:var(--cm-vert);color:white;"
                    >
                      {{ getActiviteNom(activiteId) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- BLOC : TRANSPORT -->
          <div class="cm-section">
            <div class="cm-section-title">Transport</div>
            <div class="cm-transport-card" style="cursor:default;pointer-events:none;border-color:var(--cm-bleu);">
              <div class="cm-transport-icon">{{ getTransportIcon(reservationState.transportNom) }}</div>
              <div class="cm-transport-info">
                <div class="cm-transport-name">{{ reservationState.transportNom }}</div>
                <div class="cm-transport-sub">Transport commun pour le groupe</div>
              </div>
              <div class="cm-transport-price">{{ reservationState.transportPrix }} €</div>
            </div>
          </div>

          <!-- NAVIGATION -->
          <div style="display:flex;justify-content:space-between;gap:16px;margin-top:8px;">
            <button class="cm-btn cm-btn-secondary" @click="router.push('/reservation/step3')">
              ← Modifier le transport
            </button>
            <button
              class="cm-btn cm-btn-accent"
              style="flex:1;"
              @click="ajouterAuPanier"
              :disabled="loading"
            >
              <span v-if="loading"><span class="cm-spinner" style="width:18px;height:18px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px;"></span> En cours...</span>
              <span v-else>🛒 Ajouter au panier</span>
            </button>
          </div>
        </div>

        <!-- ═══ SIDEBAR PRIX TOTAL ═══ -->
        <aside class="cm-price-sidebar">
          <div class="cm-price-sidebar-title">Détail du prix</div>

          <!-- Séjour -->
          <div class="cm-price-line">
            <span class="cm-price-line-label">Séjour ({{ nbNuits }} nuits × {{ reservationState.nbPersonnes }} pers.)</span>
            <span class="cm-price-line-value">{{ prixSejour }} €</span>
          </div>
          <div class="cm-price-line">
            <span class="cm-price-line-label" style="font-size:11px;padding-left:10px;">
              {{ reservationState.typeChambrePrixNuit }} €/nuit × {{ nbNuits }} nuits × {{ reservationState.nbPersonnes }} pers.
            </span>
          </div>

          <hr class="cm-price-divider" />

          <!-- Activités -->
          <div class="cm-price-line">
            <span class="cm-price-line-label">Activités</span>
            <span class="cm-price-line-value">{{ prixActivites }} €</span>
          </div>
          <template v-for="(voyageur, index) in reservationState.voyageurs" :key="index">
            <div v-if="(voyageur.activitesSelectionnees?.length ?? 0) > 0" class="cm-price-line">
              <span class="cm-price-line-label" style="font-size:11px;padding-left:10px;">
                {{ voyageur.prenom || `Pers.${index+1}` }} ({{ voyageur.activitesSelectionnees?.length ?? 0 }} act.)
              </span>
              <span class="cm-price-line-value" style="font-size:11px;">
                {{ (voyageur.activitesSelectionnees?.length ?? 0) * 15 }} €
              </span>
            </div>
          </template>

          <hr class="cm-price-divider" />

          <!-- Transport -->
          <div class="cm-price-line">
            <span class="cm-price-line-label">Transport</span>
            <span class="cm-price-line-value">{{ reservationState.transportPrix }} €</span>
          </div>

          <hr class="cm-price-divider" />

          <!-- TOTAUX -->
          <div class="cm-price-total">
            <span class="cm-price-total-label">Total HT</span>
            <span class="cm-price-total-ht">{{ reservationState.prixHT }} €</span>
          </div>
          <div class="cm-price-line">
            <span class="cm-price-line-label">TVA (10%)</span>
            <span class="cm-price-line-value">{{ tvaAmount }} €</span>
          </div>
          <hr class="cm-price-divider" />
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <span class="cm-price-ttc-label">Total TTC</span>
          </div>
          <div class="cm-price-ttc-value">{{ reservationState.prixTTC }} €</div>
          <p class="cm-price-tva">Toutes taxes comprises</p>

          <button
            class="cm-btn cm-btn-accent cm-btn-full"
            style="margin-top:24px;"
            @click="ajouterAuPanier"
            :disabled="loading"
          >
            🛒 Ajouter au panier
          </button>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/clubmed.css';
import { reservationState, getNbNuits, calculerPrix, resetReservationState } from '../stores/reservationState';
import reservationService from '../services/reservationService';

const router = useRouter();
const loading = ref(false);
const erreur = ref('');
const activitesRef = ref<any[]>([]);

// ⚠️ clientNum hardcodé à 1 — voir probleme.md
const CLIENT_NUM = 1;

const nbNuits = computed(() => getNbNuits());

const prixSejour = computed(() =>
  nbNuits.value * reservationState.typeChambrePrixNuit * reservationState.nbPersonnes
);

const prixActivites = computed(() =>
  reservationState.voyageurs.reduce((t, v) => t + (v.activitesSelectionnees?.length ?? 0) * 15, 0)
);

const tvaAmount = computed(() =>
  Math.round(reservationState.prixHT * 0.10 * 100) / 100
);

onMounted(async () => {
  calculerPrix();
  try {
    activitesRef.value = await reservationService.getTypeActivites();
  } catch { /* silent */ }
});

const getActiviteNom = (id: number): string => {
  const act = activitesRef.value.find(a => a.typeActiviteNum === id);
  return act?.typeActiviteTitre ?? `Activité #${id}`;
};

const getTransportIcon = (lieu: string): string => {
  if (!lieu) return '🚗';
  const l = lieu.toLowerCase();
  if (l.includes('vol') || l.includes('aéroport') || l.includes('cdg')) return '✈️';
  if (l.includes('gare') || l.includes('train')) return '🚄';
  if (l.includes('bus') || l.includes('car')) return '🚌';
  return '🚗';
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

const ajouterAuPanier = async () => {
  loading.value = true;
  erreur.value = '';
  try {
    // Le backend C# impose `TransportId` (int non-nullable) en base de données. 
    // Si aucun n'est sélectionné, on passe 1 par défaut, mais avec le nom "Transport autonome" 
    // et un prix de 0€ pour que tout soit correct visuellement.
    const transportIdValue = reservationState.transportId ?? 1;

    const payload: any = {
      clubId: Number(reservationState.clubId),
      transportId: transportIdValue,
      clientNum: CLIENT_NUM,
      resaDateDebut: new Date(reservationState.dateDebut).toISOString(),
      resaDateFin: new Date(reservationState.dateFin).toISOString(),
      resaNbPersonnes: Number(reservationState.nbPersonnes),
      resaLieuDepart: reservationState.transportNom || 'Transport autonome',
      resaPrix: Number(reservationState.prixTTC),
      resaStatut: 'EN_ATTENTE',
    };

    if (reservationState.editMode && reservationState.editResaNum) {
      payload.resaNum = reservationState.editResaNum;
      await reservationService.updateReservation(reservationState.editResaNum, payload);
    } else {
      await reservationService.createReservation(payload);
    }

    resetReservationState();
    router.push('/panier');
  } catch (e: any) {
    const httpStatus = e?.response?.status;
    const detail = e?.response?.data;
    let msg = `Erreur lors de l'enregistrement`;
    if (httpStatus) msg += ` (HTTP ${httpStatus})`;
    if (detail) msg += ` : ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`;
    else if (!httpStatus) msg += ` — vérifiez que l'API C# est bien démarrée.`;
    erreur.value = msg;
    console.error('Erreur API:', e?.response?.status, e?.response?.data, e);
  } finally {
    loading.value = false;
  }
};
</script>

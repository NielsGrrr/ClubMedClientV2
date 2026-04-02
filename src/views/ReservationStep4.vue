<template>
  <div>
    <!-- STEPPER -->
    <nav class="cm-stepper">
      <div class="cm-step done"><div class="cm-step-bubble">✓</div><span class="cm-step-label">Séjour</span></div>
      <div class="cm-step-line done"></div>
      <div class="cm-step done"><div class="cm-step-bubble">✓</div><span class="cm-step-label">Activités</span></div>
      <div class="cm-step-line done"></div>
      <div class="cm-step done"><div class="cm-step-bubble">✓</div><span class="cm-step-label">Transport</span></div>
      <div class="cm-step-line done"></div>
      <div class="cm-step active"><div class="cm-step-bubble">4</div><span class="cm-step-label">Récapitulatif</span></div>
    </nav>

    <div class="cm-page">
      <div class="cm-page-header">
        <h1>Récapitulatif détaillé</h1>
        <p>Vérifiez les choix de chaque participant avant de valider</p>
      </div>

      <div v-if="erreur" class="cm-alert cm-alert-danger cm-mb-4">⚠️ {{ erreur }}</div>

      <div class="cm-page-inner">
        <!-- ═══ COLONNE GAUCHE ═══ -->
        <div style="flex: 1;">
          <!-- RECAP PAR VOYAGEUR -->
          <div class="cm-section">
            <div class="cm-section-title">Participants ({{ reservationState.voyageurs.length }})</div>
            
            <div v-for="(v, index) in reservationState.voyageurs" :key="index" class="cm-recap-participant-card">
              <div class="cm-recap-participant-header">
                <span class="cm-participant-tag">#{{ index + 1 }}</span>
                <span class="cm-participant-name">{{ v.prenom }} {{ v.nom }}</span>
                <span :class="v.type === 'adulte' ? 'cm-badge-adulte' : 'cm-badge-enfant'">
                  {{ v.type === 'adulte' ? 'Adulte' : 'Enfant' }}
                </span>
                <span style="margin-left:auto; font-size:11px; opacity:0.7;">Client ID: #{{ 100 + index }} (Fictif)</span>
              </div>
              
              <div class="cm-recap-participant-body">
                <div class="cm-recap-detail-line">
                  <span class="cm-detail-label">Transport</span>
                  <span class="cm-detail-value">{{ v.transportNom }} — {{ v.transportPrix }} €</span>
                </div>
                
                <div class="cm-recap-detail-line">
                  <span class="cm-detail-label">Activités ({{ v.activitesSelectionnees.length }})</span>
                  <div class="cm-detail-list">
                    <span v-for="id in v.activitesSelectionnees" :key="id" class="cm-mini-badge">
                      {{ getActiviteNom(id) }}
                    </span>
                    <span v-if="v.activitesSelectionnees.length === 0" style="font-style:italic;color:var(--cm-text-muted);">Aucune activité</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- DÉTAILS SÉJOUR GLOBAUX -->
          <div class="cm-section mt-4">
            <div class="cm-section-title">Informations du séjour</div>
            <div class="cm-recap-grid">
                <div class="cm-recap-item">
                    <div class="cm-recap-item-label">Resort</div>
                    <div class="cm-recap-item-value">{{ reservationState.clubTitre }}</div>
                </div>
                <div class="cm-recap-item">
                    <div class="cm-recap-item-label">Dates</div>
                    <div class="cm-recap-item-value">{{ formatDate(reservationState.dateDebut) }} au {{ formatDate(reservationState.dateFin) }}</div>
                </div>
                <div class="cm-recap-item">
                    <div class="cm-recap-item-label">Chambre</div>
                    <div class="cm-recap-item-value">{{ reservationState.typeChambreNom }}</div>
                </div>
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;margin-top:24px;">
            <button class="cm-btn cm-btn-secondary" @click="router.push('/reservation/step3')">← Modifier le transport</button>
            <button class="cm-btn cm-btn-accent" style="flex:1; margin-left:15px;" @click="valider" :disabled="loading">
              <span v-if="loading" class="cm-spinner" style="width:16px;height:16px;border-width:2px;"></span>
              {{ loading ? 'Enregistrement...' : '🛒 Confirmer & Ajouter au panier' }}
            </button>
          </div>
        </div>

        <!-- ═══ SIDEBAR PRIX ═══ -->
        <aside class="cm-price-sidebar">
          <div class="cm-price-sidebar-title">Récapitulatif financier</div>
          <div class="cm-price-line"><span>Séjour</span><span>{{ prixSejour }} €</span></div>
          <div class="cm-price-line"><span>Activités</span><span>{{ reservationState.prixActivites }} €</span></div>
          <div class="cm-price-line"><span>Transports</span><span>{{ totalTransport }} €</span></div>
          <hr class="cm-price-divider" />
          <div class="cm-price-total"><span>Total HT</span><span>{{ reservationState.prixHT }} €</span></div>
          <div class="cm-price-line"><span>TVA (10%)</span><span>{{ tvaAmount }} €</span></div>
          <div class="cm-price-ttc-value">{{ reservationState.prixTTC }} €</div>
          <p class="cm-price-tva">Toutes taxes comprises</p>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/clubmed.css';
import { reservationState, getNbNuits, resetReservationState } from '../stores/reservationState';
import reservationService from '../services/reservationService';

const router = useRouter();
const loading = ref(false);
const erreur = ref('');
const activitesRef = ref<any[]>([]);

const nbNuits = computed(() => getNbNuits());
const prixSejour = computed(() => nbNuits.value * reservationState.typeChambrePrixNuit * reservationState.nbPersonnes);
const totalTransport = computed(() => reservationState.voyageurs.reduce((s, v) => s + (v.transportPrix || 0), 0));
const tvaAmount = computed(() => Math.round(reservationState.prixHT * 0.1));

onMounted(async () => {
    try { activitesRef.value = await reservationService.getActivitesAdultes(); } catch {}
});

const getActiviteNom = (id: number) => activitesRef.value.find(a => a.actiAdulteId === id)?.actiAdulteTitre || `Activité #${id}`;
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

const valider = async () => {
  if (reservationState.voyageurs.length === 0) {
    erreur.value = "Aucun voyageur défini.";
    return;
  }
  loading.value = true;
  erreur.value = '';
  try {
    // 0. SEEDING FRONT : S'assurer que le client #1 et le transport #1 existent sur Azure
    try {
        const c1 = await reservationService.getClient(1);
        if (!c1) {
            await reservationService.createClient({ numClient: 1, nom: "Client", prenom: "Systeme", email: "system@clubmed.com", telephone: "0102030405" });
        }
        const t1 = await reservationService.getTransport(1);
        if (!t1) {
            await reservationService.createTransport({ transportId: 1, transportLieuDepart: "Aéroport (Défaut)", transportPrix: 50 });
        }
    } catch (e) {
        console.warn("Erreur auto-seeding front (non critique):", e);
    }

    // 1. Sauvegarde/Mise à jour de la réservation principale
    const resaPayload = {
      resaNum: reservationState.editResaNum || 0,
      clubId: reservationState.clubId,
      transportId: reservationState.voyageurs[0]?.transportId || 1,
      clientNum: 1, // Payeur principal
      resaDateDebut: reservationState.dateDebut ? new Date(reservationState.dateDebut).toISOString() : null,
      resaDateFin: reservationState.dateFin ? new Date(reservationState.dateFin).toISOString() : null,
      resaNbPersonnes: reservationState.nbPersonnes,
      resaLieuDepart: 'Multi-destinations',
      resaPrix: reservationState.prixTTC,
      resaStatut: 'EN_ATTENTE'
    };

    let resaNum = 0;
    if (reservationState.editMode && reservationState.editResaNum) {
      await reservationService.updateReservation(reservationState.editResaNum, resaPayload);
      resaNum = reservationState.editResaNum;
      // Note: On pourrait purger les anciennes sous-réservations ici si nécessaire
    } else {
      const mainResa = await reservationService.createReservation(resaPayload);
      resaNum = mainResa.resaNum;
    }

    // 2. Boucle pour créer chaque SOUS-RÉSERVATION (ID Client 1 pour TOUS)
    for (let i = 0; i < reservationState.voyageurs.length; i++) {
        const v = reservationState.voyageurs[i];
        if (!v) continue;
        
        const subResaPayload = {
            resaNum: resaNum,
            clientNum: 1, // TOUS sur le même client
            transportId: v.transportId || 1,
            sousReservationNom: v.nom || '',
            sousReservationPrenom: v.prenom || '',
            sousReservationDateNaissance: v.dateNaissance ? new Date(v.dateNaissance).toISOString() : null,
            sousReservationType: v.type || 'adulte'
        };

        const subResa = await reservationService.createSousReservation(subResaPayload);
        const subResaId = subResa.sousReservationId;

        // 3. Boucle pour lier les activités
        for (const actId of v.activitesSelectionnees) {
            await reservationService.createSousReservationActivite({
                sousReservationId: subResaId,
                activiteId: actId
            });
        }
    }

    resetReservationState();
    router.push('/panier');
  } catch (e: any) {
    const errorMsg = e.response?.data?.detail || e.response?.data?.title || e.message;
    erreur.value = `Erreur lors de l'enregistrement : ${errorMsg}`;
    console.error("Détails erreur sauvegarde:", e.response?.data || e);
  } finally { loading.value = false; }
};
</script>

<style scoped>
.cm-recap-participant-card { background: var(--cm-blanc); margin-bottom: 20px; border: 1px solid var(--cm-border); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transition: transform 0.2s; }
.cm-recap-participant-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
.cm-recap-participant-header { background: var(--cm-bleu); color: white; padding: 12px 16px; display: flex; align-items: center; gap: 12px; }
.cm-participant-tag { background: rgba(255,255,255,0.2); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 12px; font-weight: bold; }
.cm-participant-name { font-weight: 700; font-size: 15px; }
.cm-recap-participant-body { padding: 16px; }
.cm-recap-detail-line { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dashed var(--cm-border); padding-bottom: 8px; }
.cm-recap-detail-line:last-child { border: none; margin-bottom: 0; }
.cm-detail-label { font-weight: 600; color: var(--cm-text-light); font-size: 13px; }
.cm-detail-value { font-weight: 700; color: var(--cm-bleu); font-size: 13px; }
.cm-detail-list { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; max-width: 60%; }
.cm-mini-badge { background: var(--cm-vert); color: white; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
</style>

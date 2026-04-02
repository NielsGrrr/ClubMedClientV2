<template>
  <div>
    <!-- HERO PANIER -->
    <div class="panier-hero">
      <div class="panier-hero-inner">
        <h1>🛒 Mes Achats</h1>
        <p>Gérez vos réservations et effectuez vos paiements</p>
      </div>
    </div>

    <!-- ONGLETS -->
    <div class="panier-tabs-bar">
      <div class="panier-tabs-inner">
        <button
          class="panier-tab"
          :class="{ active: activeTab === 'panier' }"
          @click="activeTab = 'panier'"
        >
          🛒 Mon Panier
          <span v-if="cartItems.length > 0" class="panier-badge">{{ cartItems.length }}</span>
        </button>
        <button
          class="panier-tab"
          :class="{ active: activeTab === 'reservations' }"
          @click="activeTab = 'reservations'; fetchReservations()"
        >
          ✅ Mes Réservations
          <span v-if="confirmedItems.length > 0" class="panier-badge" style="background:var(--cm-vert);">{{ confirmedItems.length }}</span>
        </button>
      </div>
    </div>

    <!-- ═══ ONGLET PANIER ═══ -->
    <div v-if="activeTab === 'panier'" class="panier-page">
      <div v-if="loading" class="cm-loading">
        <div class="cm-spinner"></div> Chargement de votre panier...
      </div>

      <div v-else-if="cartItems.length === 0" class="panier-empty">
        <div class="panier-empty-icon">🏖️</div>
        <h2>Votre panier est vide</h2>
        <p>Découvrez nos destinations et commencez à planifier votre séjour de rêve.</p>
        <router-link to="/annonces" class="cm-btn cm-btn-primary" style="display:inline-flex;margin-top:20px;">
          Réserver un séjour
        </router-link>
      </div>

      <div v-else class="panier-layout">
        <!-- LISTE DES ITEMS -->
        <div class="panier-items">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 class="panier-subtitle">{{ cartItems.length }} séjour{{ cartItems.length > 1 ? 's' : '' }} dans votre panier</h2>
            <div v-if="cartItems.length > 1" style="display:flex;align-items:center;gap:8px;">
              <input type="checkbox" id="select-all" :checked="selectedAll" @change="toggleSelectAll" style="width:16px;height:16px;cursor:pointer;" />
              <label for="select-all" style="font-size:13px;color:var(--cm-text-light);cursor:pointer;">Tout sélectionner</label>
            </div>
          </div>

          <div
            v-for="item in cartItems"
            :key="item.resaNum"
            class="panier-item"
            :class="{ 'panier-item-selected': selectedItems.includes(item.resaNum) }"
          >
            <div class="panier-item-header">
              <div style="display:flex;align-items:center;gap:12px;">
                <!-- Checkbox sélection -->
                <input
                  type="checkbox"
                  :id="`check-${item.resaNum}`"
                  :checked="selectedItems.includes(item.resaNum)"
                  @change="toggleSelect(item.resaNum)"
                  style="width:18px;height:18px;cursor:pointer;accent-color:var(--cm-jaune);"
                />
                <div>
                  <div class="panier-item-ref">Réservation #{{ item.resaNum }}</div>
                  <div class="panier-item-club">{{ getClubNom(item.clubId) }}</div>
                </div>
              </div>
              <div style="display:flex;gap:8px;">
                <button class="panier-btn-modifier" @click="modifierReservation(item)" title="Modifier">
                  ✏️ Modifier
                </button>
                <button class="panier-item-delete" @click="supprimer(item.resaNum)" title="Retirer du panier">
                  ✕ Retirer
                </button>
              </div>
            </div>

            <div class="panier-item-body">
              <div class="panier-item-info">
                <div class="panier-info-row">
                  <span class="panier-info-label">📍 Destination</span>
                  <span class="panier-info-value">{{ getClubNom(item.clubId) }}</span>
                </div>
                <div class="panier-info-row">
                  <span class="panier-info-label">📅 Période</span>
                  <span class="panier-info-value">
                    Du {{ formatDate(item.resaDateDebut) }} au {{ formatDate(item.resaDateFin) }}
                  </span>
                </div>
                <div class="panier-info-row">
                  <span class="panier-info-label">👥 Participants</span>
                  <span class="panier-info-value">{{ item.resaNbPersonnes }} personne{{ item.resaNbPersonnes > 1 ? 's' : '' }}</span>
                </div>
                <div class="panier-info-row" v-if="item.resaLieuDepart">
                  <span class="panier-info-label">✈️ Transport</span>
                  <span class="panier-info-value">{{ item.resaLieuDepart }}</span>
                </div>
              </div>
              <div class="panier-item-price">
                <div class="panier-price-value">{{ item.resaPrix?.toFixed(2) }} €</div>
                <div class="panier-price-label">TTC</div>
              </div>
            </div>
          </div>

          <router-link to="/annonces" class="panier-add-link">
            + Ajouter un autre séjour
          </router-link>
        </div>

        <!-- SIDEBAR -->
        <aside class="panier-sidebar">
          <div class="panier-sidebar-title">Récapitulatif</div>

          <!-- Résumé sélection -->
          <div v-if="selectedItems.length > 0" style="margin-bottom:16px;">
            <div style="font-size:12px;color:var(--cm-text-light);margin-bottom:8px;">
              {{ selectedItems.length }} réservation{{ selectedItems.length > 1 ? 's' : '' }} sélectionnée{{ selectedItems.length > 1 ? 's' : '' }}
            </div>
            <div
              v-for="item in cartItems.filter(i => selectedItems.includes(i.resaNum))"
              :key="item.resaNum"
              style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid var(--cm-border);"
            >
              <span style="color:var(--cm-text-light);">{{ getClubNom(item.clubId) }}</span>
              <span style="font-weight:600;color:var(--cm-bleu);">{{ item.resaPrix?.toFixed(2) }} €</span>
            </div>
          </div>
          <div v-else style="font-size:13px;color:var(--cm-text-muted);text-align:center;padding:12px 0;margin-bottom:12px;">
            Sélectionnez des réservations à payer
          </div>

          <hr style="border:none;border-top:1px solid var(--cm-border);margin:12px 0;" />

          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
            <span style="font-size:14px;color:var(--cm-text-light);">Total sélectionné</span>
          </div>
          <div style="font-size:36px;font-weight:800;color:var(--cm-bleu);margin-bottom:4px;">
            {{ totalSelectionne.toFixed(2) }} €
          </div>
          <div style="font-size:12px;color:var(--cm-text-muted);margin-bottom:24px;">
            Toutes taxes comprises
          </div>

          <button
            @click="ouvrirStripe"
            class="cm-btn cm-btn-accent cm-btn-full"
            :disabled="selectedItems.length === 0 || paymentLoading"
          >
            <span v-if="paymentLoading">⏳ Traitement en cours...</span>
            <span v-else>💳 Payer {{ selectedItems.length > 0 ? totalSelectionne.toFixed(2) + ' €' : '' }}</span>
          </button>

          <p style="font-size:11px;color:var(--cm-text-muted);text-align:center;margin-top:12px;">
            🔒 Paiement sécurisé Stripe · Mode sandbox
          </p>
        </aside>
      </div>
    </div>

    <!-- ═══ ONGLET MES RÉSERVATIONS ═══ -->
    <div v-if="activeTab === 'reservations'" class="panier-page">
      <div v-if="loadingReservations" class="cm-loading">
        <div class="cm-spinner"></div> Chargement de vos réservations...
      </div>

      <div v-else-if="confirmedItems.length === 0" class="panier-empty">
        <div class="panier-empty-icon">📋</div>
        <h2>Aucune réservation confirmée</h2>
        <p>Vos réservations payées apparaîtront ici.</p>
        <button class="cm-btn cm-btn-secondary" style="margin-top:20px;" @click="activeTab = 'panier'">
          Voir mon panier
        </button>
      </div>

      <div v-else class="reservations-list">
        <h2 class="panier-subtitle">{{ confirmedItems.length }} réservation{{ confirmedItems.length > 1 ? 's' : '' }} confirmée{{ confirmedItems.length > 1 ? 's' : '' }}</h2>
        <div
          v-for="item in confirmedItems"
          :key="item.resaNum"
          class="reservation-confirmed-card"
        >
          <div class="reservation-confirmed-header">
            <div>
              <div class="panier-item-ref" style="color:white;">Réservation #{{ item.resaNum }}</div>
              <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:2px;">{{ getClubNom(item.clubId) }}</div>
            </div>
            <span class="statut-confirmee-badge">✅ Confirmée</span>
          </div>
          <div class="panier-item-body">
            <div class="panier-item-info">
              <div class="panier-info-row">
                <span class="panier-info-label">📍 Destination</span>
                <span class="panier-info-value">{{ getClubNom(item.clubId) }}</span>
              </div>
              <div class="panier-info-row">
                <span class="panier-info-label">📅 Période</span>
                <span class="panier-info-value">
                  Du {{ formatDate(item.resaDateDebut) }} au {{ formatDate(item.resaDateFin) }}
                </span>
              </div>
              <div class="panier-info-row">
                <span class="panier-info-label">👥 Participants</span>
                <span class="panier-info-value">{{ item.resaNbPersonnes }} personne{{ item.resaNbPersonnes > 1 ? 's' : '' }}</span>
              </div>
              <div class="panier-info-row" v-if="item.resaLieuDepart">
                <span class="panier-info-label">✈️ Transport</span>
                <span class="panier-info-value">{{ item.resaLieuDepart }}</span>
              </div>
            </div>
            <div class="panier-item-price">
              <div class="panier-price-value">{{ item.resaPrix?.toFixed(2) }} €</div>
              <div class="panier-price-label">TTC</div>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- MODAL SUCCÈS PAIEMENT -->
    <Teleport to="body">
      <div v-if="showSuccessModal" class="stripe-overlay">
        <div class="success-modal">
          <div class="success-icon">✅</div>
          <h2>Paiement réussi !</h2>
          <p>Vos {{ paidCount }} réservation{{ paidCount > 1 ? 's' : '' }} {{ paidCount > 1 ? 'ont été confirmées' : 'a été confirmée' }}.</p>
          <p style="font-size:13px;color:#6b7280;margin-top:8px;">Un email de confirmation vous sera envoyé.</p>
          <button class="cm-btn cm-btn-primary" style="margin-top:24px;width:100%;" @click="apresSucces">
            Voir mes réservations
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/clubmed.css';
import panierService from '../services/panierService';
import reservationService from '../services/reservationService';
import { reservationState, resetReservationState } from '../stores/reservationState';

const router = useRouter();

// ─── ÉTAT GÉNÉRAL ──────────────────────────────────
const activeTab = ref<'panier' | 'reservations'>('panier');
const loading = ref(true);
const loadingReservations = ref(false);
const paymentLoading = ref(false);

const cartItems = ref<any[]>([]);
const confirmedItems = ref<any[]>([]);
const clubs = ref<any[]>([]);
const selectedItems = ref<number[]>([]);

// ⚠️ clientNum hardcodé à 1 — voir probleme.md
const CLIENT_ID = 1;

// ─── STRIPE ────────────────────────────────────────
const showStripeModal = ref(false);
const showSuccessModal = ref(false);
const stripeProcessing = ref(false);
const stripeError = ref('');
const paidCount = ref(0);

onMounted(async () => {
  // --- STRIPE REDIRECT CHECK ---
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    const savedIdsStr = localStorage.getItem('stripe_resa_nums');
    if (savedIdsStr) {
      try {
        const resaNums = JSON.parse(savedIdsStr);
        await panierService.validateSelected(resaNums);
        localStorage.removeItem('stripe_resa_nums');
        
        // Rafraîchir les données immédiatement pour voir les changements
        await Promise.all([fetchCart(), fetchReservations()]);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        paidCount.value = resaNums.length;
        showSuccessModal.value = true;
      } catch (err) {
        console.error("Erreur post-stripe", err);
      }
    }
  } else if (urlParams.get('canceled') === 'true') {
    alert('Le paiement a été annulé.');
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  // -----------------------------

  await Promise.all([fetchCart(), fetchReservations(), fetchClubs()]);
});

const fetchCart = async () => {
  loading.value = true;
  try {
    cartItems.value = await panierService.getCart(CLIENT_ID);
    // Auto-sélectionner tous les items au chargement
    selectedItems.value = cartItems.value.map((i: any) => i.resaNum);
  } catch {
    console.error('Erreur chargement panier');
  } finally {
    loading.value = false;
  }
};

const fetchReservations = async () => {
  loadingReservations.value = true;
  try {
    confirmedItems.value = await panierService.getMesReservations(CLIENT_ID);
  } catch {
    console.error('Erreur chargement réservations');
  } finally {
    loadingReservations.value = false;
  }
};

const fetchClubs = async () => {
  try {
    clubs.value = await panierService.getClubs();
  } catch { /* silent */ }
};

const getClubNom = (clubId: number): string => {
  const club = clubs.value.find((c: any) => c.idClub === clubId);
  return club?.titre ?? `Club #${clubId}`;
};

// ─── SÉLECTION ─────────────────────────────────────
const selectedAll = computed(() =>
  cartItems.value.length > 0 && selectedItems.value.length === cartItems.value.length
);

const toggleSelect = (resaNum: number) => {
  const idx = selectedItems.value.indexOf(resaNum);
  if (idx === -1) selectedItems.value.push(resaNum);
  else selectedItems.value.splice(idx, 1);
};

const toggleSelectAll = () => {
  if (selectedAll.value) selectedItems.value = [];
  else selectedItems.value = cartItems.value.map((i: any) => i.resaNum);
};

const totalSelectionne = computed(() => {
  return cartItems.value
    .filter((i: any) => selectedItems.value.includes(i.resaNum))
    .reduce((t: number, i: any) => t + (i.resaPrix || 0), 0);
});

// ─── ACTIONS PANIER ────────────────────────────────
const supprimer = async (resaNum: number) => {
  if (confirm('Retirer ce séjour du panier ?')) {
    try {
      await panierService.removeFromCart(resaNum);
      selectedItems.value = selectedItems.value.filter(id => id !== resaNum);
      await fetchCart();
    } catch (e: any) {
      const status = e?.response?.status;
      const detail = e?.response?.data;
      let msg = 'Erreur lors de la suppression';
      if (status) msg += ` (HTTP ${status})`;
      if (detail) msg += ` : ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`;
      alert(msg);
    }
  }
};

const modifierReservation = async (item: any) => {
  loading.value = true;
  try {
    // 1. Récupérer la réservation COMPLÈTE (avec tous les participants et activités)
    const fullResa = await reservationService.getReservationFull(item.resaNum);
    
    resetReservationState();
    reservationState.editMode = true;
    reservationState.editResaNum = item.resaNum;
    reservationState.clubId = fullResa.clubId;
    reservationState.clubTitre = getClubNom(fullResa.clubId);

    if (fullResa.resaDateDebut) reservationState.dateDebut = fullResa.resaDateDebut.split('T')[0];
    if (fullResa.resaDateFin) reservationState.dateFin = fullResa.resaDateFin.split('T')[0];

    reservationState.nbPersonnes = fullResa.resaNbPersonnes || 1;
    reservationState.nbChambres = Math.ceil(reservationState.nbPersonnes / 2) || 1;

    // 2. Reconstruire la liste des VOYAGEURS avec leurs détails spécifiques
    // Support de la casse PascalCase (Backend .NET) et camelCase (Vite/Vue)
    // Ajout d'autres variantes potentielles (participants, etc.) pour garantir le rendu correct
    const rawSousResas = fullResa.sousReservations || fullResa.SousReservations || fullResa.participants || fullResa.Participants || [];
    
    if (rawSousResas.length > 0) {
      reservationState.voyageurs = rawSousResas.map((sr: any) => {
        console.log("Mapping participant (Azure):", sr);
        
        return {
          nom: sr.sousReservationNom || sr.SousReservationNom || sr.nom || sr.Nom || '',
          prenom: sr.sousReservationPrenom || sr.SousReservationPrenom || sr.prenom || sr.Prenom || '',
          dateNaissance: (sr.sousReservationDateNaissance || sr.SousReservationDateNaissance || sr.dateNaissance || sr.DateNaissance)?.split('T')[0] || '',
          type: (sr.sousReservationType || sr.SousReservationType || sr.type || sr.Type || 'adulte').toLowerCase(),
          transportId: sr.transportId || sr.TransportId || null,
          transportNom: sr.transportNom || sr.TransportNom || '', 
          transportPrix: sr.transportPrix || sr.TransportPrix || 0,
          activitesSelectionnees: (sr.sousReservationActivites || sr.SousReservationActivites || sr.activites || sr.Activites || [])?.map((sra: any) => sra.activiteId || sra.ActiviteId || sra.id || sra.Id) || []
        };
      });
    } else {
      // Fallback si pas de sous-réservations trouvées
      reservationState.voyageurs = Array.from({ length: reservationState.nbPersonnes }, () => ({
        nom: '', 
        prenom: '', 
        dateNaissance: '', 
        type: 'adulte' as const, 
        activitesSelectionnees: [],
        transportId: null,
        transportNom: '',
        transportPrix: 0
      }));
    }

    router.push('/reservation/step1');
  } catch (err) {
    console.error("Erreur lors du rechargement de la réservation", err);
    alert("Impossible de charger les détails de la réservation.");
  } finally {
    loading.value = false;
  }
};

// ─── STRIPE ────────────────────────────────────────
const ouvrirStripe = async () => {
  if (selectedItems.value.length === 0) return;
  stripeError.value = '';
  stripeProcessing.value = true;
  
  try {
    // 1. Sauvegarder les ID sélectionnés
    localStorage.setItem('stripe_resa_nums', JSON.stringify(selectedItems.value));
    
    // 2. Appel au backend pour Stripe
    const data = await panierService.createStripeCheckoutSession(
      totalSelectionne.value, 
      `Réservation ClubMed (${selectedItems.value.length} séjour${selectedItems.value.length > 1 ? 's' : ''})`
    );
    
    // 3. Redirection !
    if (data && data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur critique: Stripe n'a pas renvoyé d'URL.");
      stripeProcessing.value = false;
    }
  } catch (err) {
    console.error(err);
    alert('Erreur réseau lors de la communication avec Stripe.');
    stripeProcessing.value = false;
  }
};


const apresSucces = () => {
  showSuccessModal.value = false;
  activeTab.value = 'reservations';
  fetchReservations();
};

// ─── FORMATAGE ─────────────────────────────────────
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};
</script>

<style scoped>
/* ── HERO ───────────────────────────────────── */
.panier-hero {
  background: var(--cm-bleu);
  padding: 48px 24px 40px;
}
.panier-hero-inner { max-width: 1200px; margin: 0 auto; }
.panier-hero h1 { font-family: 'Playfair Display', serif; font-size: 40px; color: white; margin-bottom: 8px; }
.panier-hero p { color: rgba(255,255,255,0.6); font-size: 15px; }

/* ── ONGLETS ─────────────────────────────────── */
.panier-tabs-bar {
  background: white;
  border-bottom: 2px solid var(--cm-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--cm-shadow-sm);
}
.panier-tabs-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 4px;
}
.panier-tab {
  padding: 16px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 14px;
  font-weight: 600;
  color: var(--cm-text-light);
  cursor: pointer;
  transition: var(--cm-transition);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: -2px;
}
.panier-tab:hover { color: var(--cm-bleu); }
.panier-tab.active {
  color: var(--cm-bleu);
  border-bottom-color: var(--cm-jaune);
}
.panier-badge {
  background: var(--cm-jaune);
  color: var(--cm-bleu);
  font-size: 11px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 12px;
}

/* ── PAGE LAYOUT ─────────────────────────────── */
.panier-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

/* ── EMPTY ───────────────────────────────────── */
.panier-empty { text-align: center; padding: 80px 20px; }
.panier-empty-icon { font-size: 64px; margin-bottom: 20px; }
.panier-empty h2 { font-family: 'Playfair Display', serif; font-size: 28px; color: var(--cm-bleu); margin-bottom: 8px; }
.panier-empty p { color: var(--cm-text-light); font-size: 15px; }

/* ── LAYOUT ──────────────────────────────────── */
.panier-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
}
@media (max-width: 960px) { .panier-layout { grid-template-columns: 1fr; } }

.panier-subtitle { font-size: 18px; font-weight: 700; color: var(--cm-bleu); }

/* ── PANIER ITEM ─────────────────────────────── */
.panier-item {
  background: white;
  border: 1.5px solid var(--cm-border);
  border-radius: var(--cm-radius-md);
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: var(--cm-shadow-sm);
  transition: var(--cm-transition);
}
.panier-item:hover { box-shadow: var(--cm-shadow-md); transform: translateY(-2px); }
.panier-item-selected { border-color: var(--cm-jaune); box-shadow: 0 0 0 2px rgba(242,169,0,0.2); }

.panier-item-header {
  background: var(--cm-bleu);
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.panier-item-ref { font-weight: 700; font-size: 14px; color: white; }
.panier-item-club { color: rgba(255,255,255,0.65); font-size: 13px; margin-top: 2px; }

.panier-btn-modifier {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.85);
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--cm-transition);
}
.panier-btn-modifier:hover { background: rgba(255,255,255,0.25); color: white; }

.panier-item-delete {
  background: none;
  border: 1px solid rgba(255,80,80,0.4);
  color: rgba(255,150,150,0.9);
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--cm-transition);
}
.panier-item-delete:hover { background: rgba(255,0,0,0.15); border-color: #FF8A8A; color: #FF8A8A; }

.panier-item-body {
  padding: 20px;
  display: flex;
  gap: 20px;
  justify-content: space-between;
}
.panier-item-info { flex: 1; }
.panier-info-row { display: flex; gap: 12px; margin-bottom: 8px; font-size: 13px; }
.panier-info-label { color: var(--cm-text-light); min-width: 90px; }
.panier-info-value { color: var(--cm-bleu); font-weight: 600; }
.panier-item-price { text-align: right; flex-shrink: 0; }
.panier-price-value { font-size: 28px; font-weight: 800; color: var(--cm-terre); }
.panier-price-label { font-size: 12px; color: var(--cm-text-muted); }

.panier-add-link {
  display: block;
  text-align: center;
  padding: 14px;
  border: 2px dashed var(--cm-border);
  border-radius: var(--cm-radius-md);
  color: var(--cm-text-light);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--cm-transition);
  text-decoration: none;
  margin-top: 8px;
}
.panier-add-link:hover { border-color: var(--cm-bleu); color: var(--cm-bleu); background: var(--cm-sable); }

/* ── SIDEBAR ─────────────────────────────────── */
.panier-sidebar {
  background: white;
  border: 1px solid var(--cm-border);
  border-radius: var(--cm-radius-md);
  padding: 28px;
  position: sticky;
  top: 80px;
  box-shadow: var(--cm-shadow-md);
}
.panier-sidebar-title {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  color: var(--cm-bleu);
  border-bottom: 1px solid var(--cm-border);
  padding-bottom: 16px;
  margin-bottom: 20px;
}

/* ── MES RÉSERVATIONS ────────────────────────── */
.reservations-list { max-width: 900px; }
.reservation-confirmed-card {
  background: white;
  border: 1.5px solid var(--cm-vert);
  border-radius: var(--cm-radius-md);
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: var(--cm-shadow-sm);
}
.reservation-confirmed-header {
  background: #27AE60;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.statut-confirmee-badge {
  background: rgba(255,255,255,0.2);
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
}

/* ── MODAL SUCCÈS ────────────────────────────── */
.success-modal {
  background: white;
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
  max-width: 380px;
  width: 100%;
  animation: slideUp 0.3s ease;
}
.success-icon { font-size: 56px; margin-bottom: 16px; }
.success-modal h2 { font-family: 'Playfair Display', serif; font-size: 28px; color: var(--cm-bleu); margin-bottom: 12px; }
.success-modal p { color: var(--cm-text-light); font-size: 15px; }
</style>


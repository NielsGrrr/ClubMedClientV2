<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <h1 class="text-3xl font-bold text-blue-800 mb-6">Mon Panier</h1>

    <div v-if="loading" class="text-center py-10">Chargement...</div>
    
    <div v-else-if="cartItems.length === 0" class="bg-white p-6 shadow rounded text-center">
      <p class="text-xl mb-4 text-gray-600">Votre panier est vide.</p>
      <router-link to="/reservation/step1" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
        Découvrir nos séjours
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div v-for="item in cartItems" :key="item.resaNum" class="bg-white p-5 shadow rounded-lg border-l-4 border-blue-500 flex justify-between items-center">
        <div>
          <h3 class="font-bold text-lg">Réservation #{{ item.resaNum }}</h3>
          <p class="text-sm text-gray-600">Club ID: {{ item.clubId }} | {{ item.resaNbPersonnes }} personne(s)</p>
          <p class="text-sm text-gray-500">Du {{ formatDate(item.resaDateDebut) }} au {{ formatDate(item.resaDateFin) }}</p>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold text-blue-800">{{ item.resaPrix }} €</p>
          <button @click="supprimer(item.resaNum)" class="text-red-500 hover:text-red-700 font-semibold mt-1">
            Retirer
          </button>
        </div>
      </div>

      <div class="bg-gray-100 p-6 rounded-lg mt-6 shadow">
        <div class="flex justify-between items-center mb-6">
          <span class="text-xl font-bold">Total à payer :</span>
          <span class="text-3xl font-bold text-green-600">{{ cartTotal }} €</span>
        </div>
        
        <button @click="validerPanier" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded text-lg">
          Valider la commande
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import panierService from '../services/panierService';

const cartItems = ref<any[]>([]);
const loading = ref(true);
const currentClientId = 1;

onMounted(async () => {
  await fetchCart();
});

const fetchCart = async () => {
  loading.value = true;
  try {
    cartItems.value = await panierService.getCart(currentClientId);
  } catch (error) {
    console.error("Erreur de connexion API:", error);
  } finally {
    loading.value = false;
  }
};

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.resaPrix || 0), 0);
});

const supprimer = async (resaNum: number) => {
  if (confirm("Retirer ce séjour du panier ?")) {
    try {
      await panierService.removeFromCart(resaNum);
      await fetchCart(); // Met à jour la liste depuis la BDD
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  }
};

const validerPanier = async () => {
  try {
    await panierService.validateCart(currentClientId);
    alert("Commande validée ! Vos réservations sont confirmées.");
    await fetchCart(); // Le panier sera vidé car les statuts sont passés à "CONFIRMEE"
  } catch (error) {
    alert("Erreur lors de la validation.");
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR');
};
</script>
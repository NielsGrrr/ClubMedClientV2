<template>
  <div class="annonces-container">
    <h1>Mes Favoris</h1>
    <div v-if="favoris.length === 0">Vous n'avez pas encore de favoris.</div>
    <div v-else class="grid">
      <div v-for="annonce in favoris" :key="annonce.idTypeChambre" class="card">
         </div>
    </div>
  </div>
</template>

<script setup>
import { favoris } from '@/stores/favoris';
</script>

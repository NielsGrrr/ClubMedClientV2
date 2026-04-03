<script setup>
import { ref, onMounted } from 'vue';
import localisationService from '@/services/LocalisationService';
import CardLocalisation from '@/components/CardLocalisation.vue';
import '@/assets/clubmed.css';

const localisations = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await localisationService.getAllLocalisations();
    localisations.value = response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des destinations:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="destinations-view">
    <!-- HERO SECTION -->
    <section class="destinations-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Nos Destinations d'Exception</h1>
        <p>Parcourez le monde et découvrez l'esprit Club Med dans nos plus beaux villages.</p>
      </div>
    </section>

    <div class="cm-page">
      <div v-if="loading" class="cm-loading" style="padding: 100px 0;">
        <div class="cm-spinner"></div>
        <span>Préparation de votre voyage...</span>
      </div>

      <div v-else class="destinations-container">
        <div class="section-info">
            <h2>{{ localisations.length }} Zones à découvrir</h2>
            <div class="section-line"></div>
        </div>

        <div class="destinations-grid">
          <CardLocalisation
            v-for="loc in localisations"
            :key="loc.numLocalisation"
            :localisation="loc"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.destinations-view {
  background-color: var(--cm-bg, #F5F0EA);
  min-height: 100vh;
}

.destinations-hero {
  height: 45vh;
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1544333346-64e4fe1f9bb0?q=80&w=2070&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(27,42,107,0.4), rgba(27,42,107,0.7));
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 0 20px;
}

.hero-content h1 {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.hero-content p {
  font-size: 1.25rem;
  opacity: 0.9;
  font-weight: 300;
}

.destinations-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
}

.section-info {
    margin-bottom: 40px;
    text-align: center;
}

.section-info h2 {
    color: var(--cm-bleu);
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    margin-bottom: 10px;
}

.section-line {
    width: 60px;
    height: 3px;
    background: var(--cm-jaune);
    margin: 0 auto;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 40px;
}

@media (max-width: 768px) {
  .hero-content h1 { font-size: 2.2rem; }
  .destinations-grid { grid-template-columns: 1fr; }
}
</style>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import '@/assets/clubmed.css';
</script>

<template>
  <div class="home-view">
    <!-- HERO SECTION -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-subtitle">L'EXCELLENCE CLUB MED</span>
        <h1>Des Moments Inoubliables vous Attendent</h1>
        <p>Découvrez nos villages d'exception et vivez une expérience tout compris unique au monde.</p>
        <div class="hero-actions">
          <RouterLink to="/localisations" class="cm-btn cm-btn-primary hero-btn">
            Explorer les Destinations
          </RouterLink>
          <RouterLink to="/annonces" class="cm-btn cm-btn-secondary hero-btn">
            Voir tous nos Clubs
          </RouterLink>
        </div>
      </div>
      <div class="hero-scroll-indicator">
        <span>Scrollez pour découvrir</span>
        <div class="mouse"></div>
      </div>
    </section>

    <!-- FEATURES SECTION -->
    <section class="cm-page">
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon"></div>
          <h3>Tout Compris Premium</h3>
          <p>Gastronomie, sports, et encadrement enfants inclus dans votre séjour.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"></div>
          <h3>Destinations Rares</h3>
          <p>Des sites préservés dans les plus beaux endroits de la planète.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"></div>
          <h3>Esprit Club Med</h3>
          <p>Une ambiance unique portée par nos G.O® passionnés.</p>
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="home-cta">
        <div class="cta-inner">
            <h2>Prêt pour l'aventure ?</h2>
            <p>Rejoignez-nous et créez des souvenirs qui dureront toute une vie.</p>
            <RouterLink to="/register" class="cm-btn cm-btn-accent">Devenir Membre</RouterLink>
        </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  margin-top: -24px; /* Compense le padding du main dans App.vue */
  margin-left: -24px;
  margin-right: -24px;
}

.hero {
  height: 90vh;
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(27,42,107,0.3), rgba(27,42,107,0.6));
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  padding: 0 24px;
}

.hero-subtitle {
  display: block;
  font-weight: 700;
  letter-spacing: 4px;
  color: var(--cm-jaune);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.hero-content h1 {
  font-family: 'Playfair Display', serif;
  font-size: 4.5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 15px rgba(0,0,0,0.4);
}

.hero-content p {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  font-weight: 300;
  opacity: 0.95;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.hero-btn {
  padding: 16px 32px;
  font-size: 1rem;
  border-radius: 50px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  padding: 80px 0;
}

.feature-card {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(27,42,107,0.05);
  transition: transform 0.3s ease;
}

.feature-card:hover { transform: translateY(-10px); }

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  color: var(--cm-bleu);
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.home-cta {
    background: var(--cm-bleu);
    color: white;
    padding: 100px 0;
    text-align: center;
}

.cta-inner h2 {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    margin-bottom: 1rem;
}

.cta-inner p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.8;
}

.hero-scroll-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    opacity: 0.7;
}

.hero-scroll-indicator span { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; }

.mouse {
    width: 25px;
    height: 40px;
    border: 2px solid white;
    border-radius: 20px;
    position: relative;
}

.mouse::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    width: 2px;
    height: 6px;
    background: white;
    transform: translateX(-50%);
    animation: scroll 2s infinite;
}

@keyframes scroll {
    0% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(15px); }
}

@media (max-width: 768px) {
  .hero-content h1 { font-size: 2.5rem; }
  .hero-actions { flex-direction: column; }
  .features-grid { grid-template-columns: 1fr; }
}
</style>
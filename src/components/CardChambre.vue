<script setup>
defineProps({ chambre: Object });
</script>

<template>
  <div class="chambre-card">
    <div class="chambre-content">
      <h3>{{ chambre.nomType }}</h3>
      <p>{{ chambre.textePresentation }}</p>
      <div class="tags">
        <span class="tag">📐 {{ chambre.surface }}m²</span>
        <span class="tag">👥 {{ chambre.capaciteMax }} pers.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chambre-card {
  display: flex; justify-content: space-between; align-items: center;
  padding: 30px; background: white; border: 1px solid #e1e8ed;
  border-radius: 16px; margin-bottom: 20px; box-sizing: border-box;
}
.chambre-content h3 { color: #002f6c; margin: 0 0 10px 0; }
.tag { background: #f1f2f6; padding: 6px 12px; border-radius: 6px; margin-right: 10px; font-size: 0.85rem; }
.btn-outline { border: 2px solid #002f6c; color: #002f6c; padding: 10px 25px; border-radius: 8px; font-weight: bold; background: none; cursor: pointer; }
</style>

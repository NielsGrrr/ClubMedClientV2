<script setup>
defineProps({
  unAvis: Object
});
</script>

<template>
  <div class="avis-card">
    <div class="avis-header">
      <div class="stars-row">
        <span v-for="n in 5" :key="n" :class="{ 'gold': n <= unAvis.note }">★</span>
      </div>
      <span class="date">{{ new Date(unAvis.dateAvis).toLocaleDateString() }}</span>
    </div>
    <p class="comment">"{{ unAvis.commentaire }}"</p>
  </div>
</template>

<style scoped>
.avis-card {
  padding: 25px;
  background: #f8fafc;
  border-radius: 16px;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.avis-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.stars-row { color: #dfe6e9; font-size: 1.2rem; }
.stars-row .gold { color: #fdcb6e; }

.comment { font-style: italic; color: #2d3436; margin: 15px 0; line-height: 1.5; }
.date { color: #636e72; font-size: 0.85rem; }
</style>

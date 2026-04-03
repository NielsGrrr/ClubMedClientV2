<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminResortStore } from '@/stores/adminResorts'

// Utilisation du store Pinia dédié
const resortStore = useAdminResortStore()
const { resorts, isLoading, error } = storeToRefs(resortStore)

onMounted(() => {
  resortStore.fetchResorts()
})

const handleDelete = async (idClub) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer définitivement ce séjour ?')) {
    try {
      await resortStore.deleteResort(idClub)
      alert('Séjour supprimé avec succès.')
    } catch (err) {
      alert(`Impossible de supprimer : ${err.message}`)
    }
  }
}

const handleToggle = async (resort) => {
  await resortStore.toggleVisibility(resort)
}
</script>

<template>
  <div class="dashboard-resorts">
    <header class="dashboard-header">
      <h1>Back-Office : Gestion des Séjours / Resorts</h1>
      <RouterLink :to="{ name: 'admin-resorts-create' }" class="btn btn-primary">+ Nouveau Séjour</RouterLink>
    </header>

    <div v-if="isLoading" class="state-message">
      <p>Chargement des données en cours...</p>
    </div>

    <div v-else-if="error" class="state-message error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="table-container">
      <table v-if="resorts.length > 0" class="resorts-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Statut</th>
            <th>Note Moyenne</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resort in resorts" :key="resort.idClub" :style="resort.statutMiseEnLigne === 'MASQUE' ? 'opacity: 0.5' : ''">
            <td>{{ resort.idClub }}</td>
            <td><strong>{{ resort.titre }}</strong></td>
            <td>
              <span class="badge" :class="{'badge-active': resort.statutMiseEnLigne === 'EN_LIGNE', 'badge-hidden': resort.statutMiseEnLigne === 'MASQUE'}">
                {{ resort.statutMiseEnLigne === 'MASQUE' ? '🔒 Masqué' : resort.statutMiseEnLigne }}
              </span>
            </td>
            <td>{{ resort.noteMoyenne || 'N/A' }} / 5</td>
            <td class="actions">
              <button @click="handleToggle(resort)" class="btn btn-sm" :class="resort.statutMiseEnLigne === 'MASQUE' ? 'btn-success' : 'btn-warning'">
                {{ resort.statutMiseEnLigne === 'MASQUE' ? '👁️ Afficher' : '🙈 Masquer' }}
              </button>
              <RouterLink :to="{ name: 'admin-resorts-edit', params: { id: resort.idClub } }" class="btn btn-secondary btn-sm">Modifier</RouterLink>
              <button @click="handleDelete(resort.idClub)" class="btn btn-danger btn-sm">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="state-message">
        <p>Aucun séjour / resort trouvé dans la base.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-resorts {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 1.8rem;
  color: #333;
}

.state-message {
  padding: 1rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.state-message.error {
  color: #d32f2f;
  background-color: #ffebee;
}

.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.resorts-table {
  width: 100%;
  border-collapse: collapse;
}

.resorts-table th, .resorts-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.resorts-table th {
  background-color: #f4f6f8;
  color: #555;
  font-weight: 600;
}

.badge {
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  background-color: #e0e0e0;
  color: #333;
}

.badge-active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.btn:hover:not(:disabled) {
  opacity: 0.8;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary { background-color: #1976d2; color: white; }
.btn-secondary { background-color: #9e9e9e; color: white; }
.btn-danger { background-color: #d32f2f; color: white; }
.btn-warning { background-color: #f57c00; color: white; }
.btn-success { background-color: #388e3c; color: white; }
.btn-sm { padding: 0.3rem 0.6rem; font-size: 0.85rem; }

.badge-hidden {
  background-color: #fff3e0;
  color: #e65100;
}</style>

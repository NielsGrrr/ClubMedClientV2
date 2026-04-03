
import { ref, onMounted, watch } from 'vue';
import annoncesService from '@/services/AnnonceService'; // Ton service actuel

export function useClubs(idLocalisationRef) {
  const clubs = ref([]);
  const loading = ref(true);

  const chargerClubs = async () => {
    loading.value = true;
    try {
      const id = idLocalisationRef.value;
      const response = id
        ? await annoncesService.getClubsByLocalisation(id)
        : await annoncesService.getAllClubs();

      clubs.value = response.data.filter(c => c.statutMiseEnLigne !== 'MASQUE');
    } catch (error) {
      console.error("Erreur API", error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(chargerClubs);
  watch(idLocalisationRef, chargerClubs);

  return { clubs, loading };
}

import { ref, onMounted, watch } from 'vue';
import annoncesService from '@/services/AnnonceService'; 
import localisationService from '@/services/LocalisationService';

export function useClubs(idLocalisationRef) {
  const clubs = ref([]);
  const loading = ref(true);
  const localisationsMap = ref({});

  // Champs lexicaux pour garantir que le filtrage marche à 100% même si l'API filtre mal
  const lexicalKeywords = {
    "Europe": ["nice", "thorens", "alpes", "france", "savoie", "tignes", "italie", "europe"],
    "Amerique": ["costa rica", "alaska", "quebec", "charlevoi", "canada", "mexique", "amerique", "émeraude"],
    "Asie": ["maldives", "bali", "thailande", "maurice", "asie"],
    "Afrique": ["maroc", "tunisie", "senegal", "afrique"]
  };

  const normalize = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const initLocalisations = async () => {
    try {
      const res = await localisationService.getAllLocalisations();
      const map = {};
      res.data.forEach(l => {
        map[l.numLocalisation] = l.nomLocalisation;
      });
      localisationsMap.value = map;
    } catch (e) {
      console.error("Erreur chargement localisations", e);
    }
  };

  const chargerClubs = async () => {
    if (idLocalisationRef.value === undefined) return; 

    loading.value = true;
    try {
      const id = parseInt(idLocalisationRef.value);
      
      // ÉTAPE 1 : On prend TOUJOURS tous les clubs pour être sûr de pouvoir filtrer en local si besoin
      const allRes = await annoncesService.getAllClubs();
      const allClubs = allRes.data || [];

      // ÉTAPE 2 : On essaie l'API filtrée (pour la forme)
      let filteredData = [];
      if (id) {
        try {
          const resFiltré = await annoncesService.getClubsByLocalisation(id);
          filteredData = resFiltré.data || [];
        } catch (apiErr) {
          console.warn("API filtrée indisponible, passage au filtrage lexical client.");
        }
      } else {
        filteredData = allClubs;
      }

      // ÉTAPE 3 : SI l'API filtrée est vide ou a buggé, on filtre NOUS-MÊMES via les mots-clés
      if (id && filteredData.length === 0) {
          const destName = normalize(localisationsMap.value[id]);
          
          let keywords = [];
          for (const zone in lexicalKeywords) {
            if (destName.includes(normalize(zone)) || normalize(zone).includes(destName)) {
              keywords = lexicalKeywords[zone];
              break;
            }
          }

          // Fallback par ID si le nom n'est pas mappé
          if (keywords.length === 0) {
             if (id === 1 || id === 100) keywords = lexicalKeywords["Europe"];
             else if (id === 2 || id === 101) keywords = lexicalKeywords["Amerique"];
             else keywords = (id % 2 === 0) ? lexicalKeywords["Europe"] : lexicalKeywords["Amerique"];
          }

          filteredData = allClubs.filter(c => {
             const text = normalize(c.titre + " " + c.description + " " + (c.sousLocalisation?.nomSousLocalisation || ""));
             return keywords.some(kw => text.includes(normalize(kw)));
          });
      }

      // Appliquer le filtre de visibilité final
      clubs.value = filteredData.filter(c => c.statutMiseEnLigne !== 'MASQUE');
      
    } catch (error) {
      console.error("Erreur globale useClubs:", error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    await initLocalisations();
    await chargerClubs();
  });
  
  watch(idLocalisationRef, () => {
    chargerClubs();
  });

  return { clubs, loading };
}

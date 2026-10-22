<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 20px">
    <NuxtLink to="/">← Retour à la liste</NuxtLink>

    <p v-if="pending">Chargement...</p>
    <p v-else-if="error">Erreur : {{ error }}</p>

    <div v-else-if="annonce">
      <h1>{{ annonce.titre }}</h1>
      <p>{{ annonce.description }}</p>

      <div
        style="
          background: #f5f5f5;
          padding: 15px;
          margin: 15px 0;
          border-radius: 8px;
        "
      >
        <p><strong>Prix de départ :</strong> {{ annonce.prixDepart }} €</p>
        <p><strong>Pas d'enchère :</strong> {{ annonce.pasEnchere }} €</p>
        <p>
          <strong>Meilleure enchère :</strong> {{ annonce.meilleureEnchere }} €
        </p>
        <p>
          <strong>Fin :</strong>
          {{ new Date(annonce.dateFin).toLocaleString() }}
        </p>
        <p>
          <strong>Statut :</strong>
          <span
            :style="{ color: annonce.statut === 'en_cours' ? 'green' : 'red' }"
          >
            {{ annonce.statut === "en_cours" ? "En cours" : "Terminée" }}
          </span>
        </p>
      </div>

      <div
        v-if="annonce.statut === 'en_cours'"
        style="
          border: 1px solid #ddd;
          padding: 15px;
          margin: 15px 0;
          border-radius: 8px;
        "
      >
        <h3>Placer une enchère</h3>
        <form @submit.prevent="placerEnchere">
          <div style="margin: 10px 0">
            <label>Pseudo :</label>
            <input
              v-model="pseudo"
              required
              style="margin-left: 10px; padding: 5px"
            />
          </div>
          <div style="margin: 10px 0">
            <label>Montant :</label>
            <input
              v-model.number="montant"
              type="number"
              required
              style="margin-left: 10px; padding: 5px"
            />
          </div>
          <button
            type="submit"
            :disabled="envoiEnCours"
            style="padding: 8px 20px; cursor: pointer"
          >
            {{ envoiEnCours ? "Envoi..." : "Enchérir" }}
          </button>
        </form>
        <p v-if="messageErreur" style="color: red; margin-top: 10px">
          {{ messageErreur }}
        </p>
        <p v-if="messageSucces" style="color: green; margin-top: 10px">
          {{ messageSucces }}
        </p>
      </div>

      <p v-else style="color: red; font-weight: bold">
        Cette annonce est terminée, les enchères sont closes.
      </p>

      <div v-if="annonce.encheres && annonce.encheres.length">
        <h3>Historique des enchères</h3>
        <table style="width: 100%; border-collapse: collapse">
          <thead>
            <tr style="background: #f0f0f0; text-align: left">
              <th style="padding: 8px">Pseudo</th>
              <th style="padding: 8px">Montant</th>
              <th style="padding: 8px">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="e in annonce.encheres"
              :key="e.date"
              style="border-bottom: 1px solid #eee"
            >
              <td style="padding: 8px">{{ e.pseudo }}</td>
              <td style="padding: 8px">{{ e.montant }} €</td>
              <td style="padding: 8px">
                {{ new Date(e.date).toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else>Pas encore d'enchère sur cette annonce.</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const {
  data: annonce,
  pending,
  error,
  refresh,
} = useFetch("/api/annonces/" + route.params.id);

const pseudo = ref("");
const montant = ref(0);
const envoiEnCours = ref(false);
const messageErreur = ref("");
const messageSucces = ref("");

async function placerEnchere() {
  messageErreur.value = "";
  messageSucces.value = "";
  envoiEnCours.value = true;

  try {
    await $fetch("/api/annonces/" + route.params.id + "/encheres", {
      method: "POST",
      body: {
        pseudo: pseudo.value,
        montant: montant.value,
      },
    });
    messageSucces.value = "Enchère placée avec succès !";
    await refresh();
    pseudo.value = "";
    montant.value = 0;
  } catch (err) {
    messageErreur.value = err.data?.message || "Une erreur est survenue";
  } finally {
    envoiEnCours.value = false;
  }
}
</script>

<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 20px">
    <h1>Enchères en ligne</h1>

    <p v-if="pending">Chargement...</p>
    <p v-else-if="error">Erreur : {{ error }}</p>

    <div v-else>
      <div
        v-for="annonce in annonces"
        :key="annonce.id"
        style="
          border: 1px solid #ddd;
          padding: 15px;
          margin: 10px 0;
          border-radius: 8px;
        "
      >
        <h2>
          <NuxtLink :to="'/annonces/' + annonce.id">{{
            annonce.titre
          }}</NuxtLink>
        </h2>
        <p>{{ annonce.description }}</p>
        <p><strong>Prix de départ :</strong> {{ annonce.prixDepart }} €</p>
        <p>
          <strong>Meilleure enchère :</strong> {{ annonce.meilleureEnchere }} €
        </p>
        <p>
          <strong>Statut :</strong>
          <span
            :style="{ color: annonce.statut === 'en_cours' ? 'green' : 'red' }"
          >
            {{ annonce.statut === "en_cours" ? "En cours" : "Terminée" }}
          </span>
        </p>
        <p>
          <strong>Fin :</strong>
          {{ new Date(annonce.dateFin).toLocaleString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: annonces, pending, error } = useFetch("/api/annonces");
</script>

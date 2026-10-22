import {
  getAnnonceById,
  meilleureEnchere,
  statutDe,
} from "../../service/annonces";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Identifiant manquant" });
  }

  const annonce = getAnnonceById(id);
  if (!annonce) {
    throw createError({ statusCode: 404, message: "Annonce introuvable" });
  }

  const historique = [...annonce.encheres].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return {
    id: annonce.id,
    titre: annonce.titre,
    description: annonce.description,
    prixDepart: annonce.prixDepart,
    pasEnchere: annonce.pasEnchere,
    meilleureEnchere: meilleureEnchere(annonce),
    dateFin: annonce.dateFin,
    statut: statutDe(annonce),
    encheres: historique,
  };
});

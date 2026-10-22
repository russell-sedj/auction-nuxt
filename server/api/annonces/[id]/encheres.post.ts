import {
  getAnnonceById,
  validerEnchere,
  ajouterEnchere,
  meilleureEnchere,
  statutDe,
} from "../../../service/annonces";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Identifiant manquant" });
  }

  const annonce = getAnnonceById(id);
  if (!annonce) {
    throw createError({ statusCode: 404, message: "Annonce introuvable" });
  }

  const body = await readBody(event);
  const erreur = validerEnchere(annonce, body?.pseudo, body?.montant);
  if (erreur) {
    throw createError({ statusCode: erreur.status, message: erreur.message });
  }

  ajouterEnchere(annonce, body.pseudo, body.montant);

  return {
    id: annonce.id,
    titre: annonce.titre,
    description: annonce.description,
    prixDepart: annonce.prixDepart,
    pasEnchere: annonce.pasEnchere,
    meilleureEnchere: meilleureEnchere(annonce),
    dateFin: annonce.dateFin,
    statut: statutDe(annonce),
    encheres: annonce.encheres,
  };
});

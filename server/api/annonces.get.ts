import { meilleureEnchere, statutDe, getAnnonces } from "../service/annonces";

export default defineEventHandler(() => {
  return getAnnonces().map((annonce) => ({
    id: annonce.id,
    titre: annonce.titre,
    description: annonce.description,
    prixDepart: annonce.prixDepart,
    meilleureEnchere: meilleureEnchere(annonce),
    dateFin: annonce.dateFin,
    statut: statutDe(annonce),
  }));
});

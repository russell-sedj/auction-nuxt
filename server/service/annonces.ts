import annoncesData from "../data/annonces.json";

type Annonce = {
  id: string;
  titre: string;
  description: string;
  prixDepart: number;
  pasEnchere: number;
  dateFin: string;
  encheres: { pseudo: string; montant: number; date: string }[];
};

let annonces: Annonce[] = annoncesData;

export function meilleureEnchere(annonce: Annonce): number {
  if (annonce.encheres.length === 0) {
    return annonce.prixDepart;
  }
  const montants = annonce.encheres.map((e) => e.montant);
  return Math.max(...montants);
}

export function statutDe(annonce: Annonce): string {
  return new Date(annonce.dateFin) > new Date() ? "en_cours" : "terminee";
}

export function getAnnonces(): Annonce[] {
  return annonces;
}

export function getAnnonceById(id: string): Annonce | undefined {
  return annonces.find((annonce) => annonce.id === id);
}

export function validerEnchere(
  annonce: Annonce,
  pseudo: string,
  montant: number,
) {
  if (!pseudo || !pseudo.trim()) {
    return { status: 400, message: "Le pseudo est requis" };
  }
  if (typeof montant !== "number" || !isFinite(montant) || montant <= 0) {
    return { status: 400, message: "Le montant doit être un nombre positif" };
  }
  if (new Date(annonce.dateFin) < new Date()) {
    return { status: 409, message: "L'annonce est terminée" };
  }
  const reference = meilleureEnchere(annonce);
  if (montant <= reference) {
    return {
      status: 400,
      message: "Le montant doit être supérieur à " + reference,
    };
  }
  if (montant < reference + annonce.pasEnchere) {
    return {
      status: 400,
      message:
        "Le montant doit être au moins " + (reference + annonce.pasEnchere),
    };
  }
  return null;
}

export function ajouterEnchere(
  annonce: Annonce,
  pseudo: string,
  montant: number,
) {
  annonce.encheres.push({
    pseudo,
    montant,
    date: new Date().toISOString(),
  });
}

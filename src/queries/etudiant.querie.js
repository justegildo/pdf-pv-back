const addEtudiant = 
    "INSERT INTO etudiant (nom_etudiant, prenom_etudiant, date_naissance, lieu_naissance, filiere, formation, annee_academique, campus, theme, type_document, nom_maitre, president_id, examinateur_id, rapporteur_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14 ) RETURNING id as id_etudiant";

const getAll = 
    "SELECT etudiant.*, membre_president.*, membre_rapporteur.*, membre_examinateur.*, ligne.* FROM etudiant JOIN ligne ON etudiant.id = ligne.etudiant_id LEFT JOIN membre_president ON etudiant.president_id = membre_president.id LEFT JOIN membre_rapporteur on etudiant.rapporteur_id = membre_rapporteur.id LEFT JOIN membre_examinateur on etudiant.examinateur_id = membre_examinateur.id"

const getById = 
    "SELECT etudiant.*, membre_president.*, membre_rapporteur.*, membre_examinateur.*, ligne.* FROM etudiant JOIN ligne ON etudiant.id = ligne.etudiant_id LEFT JOIN membre_president ON etudiant.president_id = membre_president.id LEFT JOIN membre_rapporteur on etudiant.rapporteur_id = membre_rapporteur.id LEFT JOIN membre_examinateur on etudiant.examinateur_id = membre_examinateur.id WHERE etudiant.id=$1"


module.exports = {
    addEtudiant,
    getAll,
    getById
}
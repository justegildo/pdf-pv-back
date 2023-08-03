const addLigne = 
    "INSERT INTO ligne (date_soutenance, heure_soutenance, resultat, mention, note, etudiant_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id as id_ligne";
    

module.exports = {
    addLigne
}
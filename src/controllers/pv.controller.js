const db = require("../config/dbConfig");
const presidentQueries = require('../queries/president.querie');
const rapporteurQueries = require('../queries/rapporteur.querie');
const examinateurQueries = require('../queries/examinateur.querie');
const etudiantQueries = require('../queries/etudiant.querie');
const ligneQueries = require('../queries/ligne.querie');
const nodemailer = require('nodemailer');

const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const PizZip = require("pizzip");
const path = require("path");
const moment = require('moment');


// Configurer les informations d'envoi d'e-mail
const mailConfig = {
    host: "smtp.gmail.com",
        port: 587,
        secure: false,
        service: 'gmail',
        auth: {
            user: 'dossousedjrogildas@gmail.com', // replace with your own email
            pass: 'icsdmparqmlkjmfw' // replace with your own email password
        },
        tls: {
            rejectUnauthorized: false
        }
};

// Fonction pour envoyer un e-mail d'alerte en cas d'erreur
function sendErrorEmail(error) {
    // Configurer le transporteur pour envoyer l'e-mail
    const transporter = nodemailer.createTransport(mailConfig);
  
    // Configurer les destinataires de l'e-mail
    const mailOptions = {
      from: 'dossousedjrogildas@gmail.com',
      to: 'gildasdossou76@gmail.com', // Mettez ici l'adresse e-mail du développeur
      subject: 'Erreur dans l\'application Node.js',
      text: `Une erreur s'est produite : ${error.message}`,
    };
  
    // Envoyer l'e-mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', err);
      } else {
        console.log('E-mail d\'alerte envoyé :', info.response);
      }
    });

}

// Mettre en place le gestionnaire d'erreurs global pour capturer les erreurs non gérées
process.on('uncaughtException', (error) => {
    console.error('Erreur non gérée :', error);
    sendErrorEmail(error);
});






module.exports.addPresident = (req, res) => {
    const {
        nom_president,
        prenom_president,
        grade_president

    } = req.body

    //console.log(req.body);
    db.query(presidentQueries.addPresident,
        [
            nom_president,
            prenom_president,
            grade_president

        ], (error, results) => {
            if (error) throw error;
            res.status(201).send(results.rows[0]) //send("Président ajouté avec succès !");
        })

}


module.exports.addRapporteur = (req, res) => {
    const {
        nom_rapporteur,
        prenom_rapporteur,
        grade_rapporteur
    } = req.body

    //console.log(req.body);
    db.query(rapporteurQueries.addRapporteur,
        [
            nom_rapporteur,
            prenom_rapporteur,
            grade_rapporteur

        ], (error, results) => {
            if (error) throw error;
            res.status(201).send(results.rows[0]) //send("Rapporteur ajouté avec succès !");
        })
}


module.exports.addExaminateur = (req, res) => {
    const {
        nom_examinateur,
        prenom_examinateur,
        grade_examinateur

    } = req.body

    //console.log(req.body);
    db.query(examinateurQueries.addExaminateur,
        [
            nom_examinateur,
            prenom_examinateur,
            grade_examinateur

        ], (error, results) => {
            if (error) throw error;
            res.status(201).send(results.rows[0]) //send("Examinateur ajouté avec succès !");
        })
}

module.exports.addLigne = (req, res) => {
    const {
        date_soutenance,
        heure_soutenance,
        resultat,
        mention,
        note,
        etudiant_id

    } = req.body

    //console.log(req.body);
    db.query(ligneQueries.addLigne,
        [
            date_soutenance,
            heure_soutenance,
            resultat,
            mention,
            note,
            etudiant_id

        ], (error, results) => {
            if (error) throw error;
            res.status(201).send(results.rows[0]) //send();
        })
}


module.exports.addEtudiant = (req, res) => {
    const {
        nom_etudiant,
        prenom_etudiant,
        date_naissance,
        lieu_naissance,
        filiere,
        formation,
        annee_academique,
        campus,
        theme,
        type_document,
        nom_maitre,
        president_id,
        examinateur_id,
        rapporteur_id

    } = req.body

    //console.log(req.body);
    db.query(etudiantQueries.addEtudiant,
        [
            nom_etudiant,
            prenom_etudiant,
            date_naissance,
            lieu_naissance,
            filiere,
            formation,
            annee_academique,
            campus,
            theme,
            type_document,
            nom_maitre,
            president_id,
            examinateur_id,
            rapporteur_id

        ], (error, results) => {
            if (error) throw error;
            res.status(201).send(results.rows[0]) //send("Etudiant ajouté avec succès !");
        })
}


module.exports.getAllPv = async(req, res) => {
    try {
        // Récupérer les données de votre table
        const result = await db.query(etudiantQueries.getAll);
        const data = result.rows;
        console.log(data);

        for (const entry of data) {
            const dateNais = entry.date_naissance ? moment(entry.date_naissance) : null;
            const formattedDateNais = dateNais ? dateNais.format('DD/MM/YYYY') : '';
            //const formattedDateSoute = moment(entry.date_soutenance).format('DD/MM/YYYY');
            const dateSoutenance = entry.date_soutenance ? moment(entry.date_soutenance) : null;
            const formattedDateSoute = dateSoutenance ? dateSoutenance.format('DD/MM/YYYY') : '';


            const content = fs.readFileSync(
                path.resolve(__dirname, "../fichiers/pv.docx"),
                "binary"
            );

            const zip = new PizZip(content);

            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            doc.render({
                nomPrenEtu: entry.nom_etudiant + ' ' + entry.prenom_etudiant ? (entry.nom_etudiant + ' ' + entry.prenom_etudiant) : '',
                dateNaiEtu: formattedDateNais ? formattedDateNais : '',
                lieuNaiEtu: entry.lieu_naissance ? entry.lieu_naissance : '',
                fil: entry.filiere ? entry.filiere : '',
                fildet: entry.filiere_detail ? entry.filiere_detail : '',
                aa: entry.annee_academique ? entry.annee_academique : '',
                //formation: entry.formation,
                du: entry.formation ? (entry.formation === 'DUT' ? '☑' : '☐') : '☐',
                li: entry.formation ? (entry.formation === 'Licence' ? '☑' : '☐') : '☐',
                ma: entry.formation ? (entry.formation === 'Master' ? '☑' : '☐') : '☐',
                cam: entry.campus ? entry.campus : '',
                the: entry.theme ? entry.theme : '',
                //typeDocument: entry.type_document,
                mem: entry.type_document === 'Mémoire' ? '☑' : '☐',
                rap: entry.type_document === 'Rapport' ? '☑' : '☐',
                nomMaitreMemoire: entry.nom_maitre ? entry.nom_maitre : '',
                nomPrenPre: entry.nom_president + ' ' + entry.prenom_president ? (entry.nom_president + ' ' + entry.prenom_president) : '',
                gradePre: entry.grade_president ? entry.grade_president : '',
                nomRap: entry.nom_rapporteur + ' ' + entry.prenom_rapporteur ? (entry.nom_rapporteur + ' ' + entry.prenom_rapporteur) : '',
                gradeRap: entry.grade_rapporteur ? entry.grade_rapporteur : '',
                nomExam: entry.nom_examinateur + ' ' + entry.prenom_examinateur ? entry.nom_examinateur + ' ' + entry.prenom_examinateur : '',
                gradeExam: entry.grade_examinateur ? entry.grade_examinateur : '',
                ds: formattedDateSoute ? formattedDateSoute: '',
                hs: entry.heure_soutenance ? entry.heure_soutenance : '',
                //resultat: entry.resultat ? '☑' : '☐',
                accepte: entry.resultat === 'Accepté' ? '☑' : '☐',
                refuse: entry.resultat === 'Refusé' ? '☑' : '☐',
                reserve: entry.resultat === 'Reservé' ? '☑' : '☐',
                //mention: entry.mention,
                pa: entry.mention === 'Passable' ? '☑' : '☐',
                ab: entry.mention === 'Assez-Bien' ? '☑' : '☐',
                b: entry.mention === 'Bien' ? '☑' : '☐',
                tb: entry.mention === 'Très-Bien' ? '☑' : '☐',
                ho: entry.mention === 'Honorable' ? '☑' : '☐',
                note: entry.note ? entry.note : '',
            });

            const buf = doc.getZip().generate({
                type: "nodebuffer",
                compression: "DEFLATE",
            });

            const fileName = `${entry.nom_etudiant}_${entry.prenom_etudiant}.docx`;
            fs.writeFileSync(path.resolve(__dirname, "../fichiers/" + fileName), buf);
        }

        console.log("Génération des fichiers terminée.");

    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}


module.exports.getByIdPv = (req, res) => {
    const id = parseInt(req.params.id);
    db.query(etudiantQueries.getById, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
}

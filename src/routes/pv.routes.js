const router = require('express').Router();
const pvController = require("../controllers/pv.controller")

router.post('/add-president', pvController.addPresident)

router.post('/add-rapporteur', pvController.addRapporteur)

router.post('/add-examinateur', pvController.addExaminateur)

router.post('/add-etudiant', pvController.addEtudiant)

router.post('/add-ligne', pvController.addLigne)



router.get('/', pvController.getAllPv)

router.get('/:id', pvController.getByIdPv)

module.exports = router;
const express = require("express");
const book =  require("../controllers/sach.controller");
const nxb = require("../controllers/nhaxuatban.controller");
const nv = require("../controllers/nhanvien.controller");
const docgia = require("../controllers/docgia.controller");
const muonsach = require("../controllers/theodoimuonsach.controller");
const router = express.Router();

//Theo doi muon sach route
router.route("/muonsach")
    .post(muonsach.create)
    .delete(muonsach.deleteAll)
router.route("/muonsach/:id")
    .put(muonsach.update)
    .delete(muonsach.delete)
router.route("/muonsach/find/:id")
    .get(muonsach.findOne)
router.route("/muonsach/find")
    .get(muonsach.findAll)

//Doc gia route
router.route("/docgia")
    .post(docgia.create)
router.route("/docgia/:id")
    .put(docgia.update)
router.route("/docgia/login/")
    .post(docgia.login)
router.route("/docgia/find/:id")
    .get(docgia.findById)

//NV route
router.route("/nv")
    .post(nv.create)
router.route("/nv/:id")
    .put(nv.update)
router.route("/nv/login/")
    .post(nv.login)
router.route("/nv/find/:id")
    .get(nv.findById)

// Book route
router.route("/admin/book")
    .post(book.create)
    .delete(book.deleteAll)

router.route("/admin/book/:id")
    .put(book.update)
    .delete(book.delete)

router.route("/book/find")
    .get(book.findAll)

router.route("/book/find/:id")
    .get(book.findOne)

//Nha xuat ban route
router.route("/admin/nxb")
    .post(nxb.create)
    .delete(nxb.deleteAll)

router.route("/admin/nxb/:id")
    .put(nxb.update)
    .delete(nxb.delete)

router.route("/nxb/find")
    .get(nxb.findAll)

router.route("/nxb/find/:id")
    .get(nxb.findOne)

module.exports = router;

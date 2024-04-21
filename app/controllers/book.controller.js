const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tao va luu 1 sach moi
exports.create = async (req, res, next) => {
    if (!req.body?.ten) {
        return next(new ApiError(400, "Ten khong duoc de trong"));
    }

    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.create(req.body);
        return res.send(document)
    }   catch (error) {
        return next(
            new ApiError(500, "Da xay ra loi khi tao sach")
        );
    }
};

// Tim tat ca sach
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const bookService = new BookService(MongoDB.client);
        const {ten} = req.query;
        if (ten) {
            documents = await bookService.findByName(ten);
        } else {
            documents = await bookService.find({});
        }
    }   catch (error) {
        return next (
            new ApiError(500, "Da xay ra loi khi truy xuat sach")
        );
    }
    return res.send(documents);
};

// Tim 1 cuon sach co id
exports.findOne = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Khong tim thay sach"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Loi khi truy suat sach voi id=${req.params.id}`
            )
        );
    }
};

// Cap nhat sach theo id rong yeu cau
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return next(new ApiError(400, "Du lieu can cap nhat khong duoc de trong"));
    }

    try {
      const bookService = new BookService(MongoDB.client);
      const document = await bookService.update(req.params.id, req.body);
      if (!document) {
        return next(new ApiError(404, "Khong tim thay sach"));
      }
      return res.send({message: "Sach da duoc cap nhat thanh cong"});
    } catch (error) {
      return next(
        new ApiError(500, `Loi cap nhat sach voi id=${req.params.id}`)
      );
    }
};

// Xoa 1 sach co id duoc chi dinh trong yeu cau
exports.delete = async (req, res, next) => {
    try {
      const bookService = new BookService(MongoDB.client);
      const document = await bookService.delete(req.params.id);
      if (!document) {
        return next(new ApiError(404, "Khong tim thay sach"));
      }
      return res.send({ message: "Sach da duoc xoa thanh cong" });
    } catch (error) {
      return next(
        new ApiError(500, `Khong the xoa sach voi id=${req.params.id}`)
      );
    }
};

// Xoa tat ca sach yeu thich cua 1 nguoi dung tu CSDL
exports.deleteAll = async (req, res, next) => {
    try {
      const bookService = new BookService(MongoDB.client);
      const deleteCount = await bookService.deleteAll();
      return res.send({
        message: `${deleteCount} sach da duoc xoa thanh cong`,
      })
    } catch (error) {
      return next(
        new ApiError(500, "Da xay ra loi khi xoa tat ca sach")
      );
    }
};
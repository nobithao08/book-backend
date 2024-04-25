const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const MuonSachService = require("../services/theodoimuonsach.service");
const BookService = require("../services/sach.service");
const DocGiaService = require("../services/docgia.service");

exports.create = async (req, res, next) => {
    const muonSachService = new MuonSachService(MongoDB.client);
    const docGiaService = new DocGiaService(MongoDB.client);
    try {
        const docgia = await docGiaService.findById(req.body.maDocGia);
        if (!docgia) {
            return next(
                new ApiError(405, "Mã sách hoặc mã độc giả không tồn tại")
            );
        }
        const document = await muonSachService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi khi tại theo dõi mượn sách")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const muonSachService = new MuonSachService(MongoDB.client);
        documents = await muonSachService.find({});
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const muonSachService = new MuonSachService(MongoDB.client);
        const document = await muonSachService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi tìm kiếm id=${req.params.id}`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Dữ liệu cần cập nhật không được để trống'));
    }

    try {
        const muonSachService = new MuonSachService(MongoDB.client);
        const bookService = new BookService(MongoDB.client);
        const docGiaService = new DocGiaService(MongoDB.client);
        const book = await bookService.findById(req.body.maSach);
        const docgia = await docGiaService.findById(req.body.maDocGia);
        if (!book || !docgia) {
            return next(
                new ApiError(405, "Mã sách hoặc mã độc giả không tồn tại")
            );
        }
        const document = await muonSachService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, 'Không tìm thấy'));
        }
        return res.send({ message: "Đã cập nhật thành công" });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi cập nhật với id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const muonSachService = new MuonSachService(MongoDB.client);
        const document = await muonSachService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, 'Không tìm thấy'));
        }
        return res.send({ message: "Đã xóa thành công." });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi xóa id= ${req.params.id}`));
    }
}

exports.deleteAll = async (_req, res, next) => {
    try {
        const muonSachService = new MuonSachService(MongoDB.client);
        const deleteCount = await muonSachService.deleteAll();
        return res.send({
            message: `${deleteCount} đã xóa`
        });
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi")
        );
    }
};

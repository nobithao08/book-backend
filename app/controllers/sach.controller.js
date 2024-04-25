const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const NhanVienService = require("../services/nhanvien.service");
const BookService = require("../services/sach.service");
const NxbService = require("../services/nhaxuatban.service");

exports.create = async (req, res, next) => {
    if (!req.body?.tenSach) {
        return next(new ApiError(400, "Không có tên sách"));
    }

    try {
        const nxbService = new NxbService(MongoDB.client);
        const bookService = new BookService(MongoDB.client);
        const maNxb = await nxbService.findById(req.body.maNxb);
        if (!maNxb) {
            return next(
                new ApiError(405, "Mã NXB không tồn tại.")
            );
        }
        const document = await bookService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo sách")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const bookService = new BookService(MongoDB.client);
        const { tenSach } = req.query;
        if (tenSach) {
            documents = await bookService.findByName(tenSach);
        } else {
            documents = await bookService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi truy xuất sách")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy sách"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi truy xuất sách với id=${req.params.id}`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Dữ liệu cần cập nhật không được để trống'));
    }

    try {
        const bookService = new BookService(MongoDB.client);
        const nxbService = new NxbService(MongoDB.client);
        const document = await bookService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, 'Không tìm thấy sách'));
        }
        const maNxb = await nxbService.findById(req.body.maNxb);
        if (!maNxb) {
            return next(
                new ApiError(405, "Mã NXB không tồn tại.")
            );
        }
        return res.send({ message: "Sách đã được cập nhật thành công" });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi cập nhật sách với id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, 'Không tìm thấy sách'));
        }
        return res.send({ message: "Sách đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa sách với id= ${req.params.id}`));
    }
}

exports.deleteAll = async (_req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const deleteCount = await bookService.deleteAll();
        return res.send({
            message: `${deleteCount} sách đã được xóa`
        });
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả sách")
        );
    }
};

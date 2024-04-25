const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const NxbService = require("../services/nhaxuatban.service");

exports.create = async (req, res, next) => {
    try {
        const nxbService = new NxbService(MongoDB.client);
        const document = await nxbService.create(req.body);

        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo nhà xuất bản")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const nxbService = new NxbService(MongoDB.client);
        const { tenNxb } = req.query;
        if (tenNxb) {
            documents = await nxbService.findByName(tenNxb);
        } else {
            documents = await nxbService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi truy xuất nhà xuất bản")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const nxbService = new NxbService(MongoDB.client);
        const document = await nxbService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi truy xuất nhà xuất bản với id=${req.params.id}`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Dữ liệu cần cập nhật không được để trống'));
    }

    try {
        const nxbService = new NxbService(MongoDB.client);
        const document = await nxbService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, 'Không tìm tháy nhà xuất bản'));
        }
        return res.send({ message: "Nhà xuất bản đã được cập nhật thành công" });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi cập nhật nhà xuất bản với id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const nxbService = new NxbService(MongoDB.client);
        const document = await nxbService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, 'Không tìm thấy nhà xuất bản'));
        }
        return res.send({ message: "Nhà xuất bản đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa nhà xuất bản với id= ${req.params.id}`));
    }
}

exports.deleteAll = async (_req, res, next) => {
    try {
        const nxbService = new NxbService(MongoDB.client);
        const deleteCount = await nxbService.deleteAll();
        return res.send({
            message: `${deleteCount} nhà xuất bản đã bị xóa`
        });
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả nhà xuất bản")
        );
    }
};

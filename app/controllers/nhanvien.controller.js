const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const NhanVienService = require("../services/nhanvien.service");
const CryptoJS = require('crypto-js');

exports.create = async (req, res, next) => {
    try {
        const nhanVienService = new NhanVienService(MongoDB.client);
        const isexits = await nhanVienService.findById(req.body.MSNV);
        if (isexits != null) return next(new ApiError(409, 'Tài khoản đã tồn tại'));
        const document = await nhanVienService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi khi tạo mới nhân viên")
        );
    }
};
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Dữ liệu cần cập nhật không được để trống'));
    }

    try {
        const nhanVienService = new NhanVienService(MongoDB.client);
        const document = await nhanVienService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, 'Nhân viên không tồn tại'));
        }
        return res.send({ message: "Nhân viên đã được cập nhật thành công" });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi cập nhật nhân viên với id=${req.params.id}`)
        );
    }
};
exports.login = async (req, res, next) => {
    try {
        const nhanVienService = new NhanVienService(MongoDB.client);
        const NV = await nhanVienService.findById(req.body.MSNV);
        console.log(req.body.password);
        if (!NV) {
            return next(new ApiError(404, 'MSNV không đúng!'));
        }
        else {
            const decryptedPassword = CryptoJS.AES.decrypt(NV.password, "Bookrentstore", { iv: "BookrentstoreIV" }).toString(CryptoJS.enc.Utf8);
            console.log(decryptedPassword);
            if (decryptedPassword === req.body.password) {
                return res.send(NV._id);
            }
            else {
                return next(new ApiError(404, 'Mật khẩu không đúng!'));
            }
        }
    }
    catch (error) {
        return next(
            new ApiError(500, "Lỗi đăng nhập!")
        );
    }
}
exports.findById = async (req, res, next) => {
    const nhanVienService = new NhanVienService(MongoDB.client);
    try {
        const nv = await nhanVienService.findById(req.params.id);
        if (!nv) {
            return next(
                new ApiError(405, "Nhân viên không tồn tại!")
            );
        }
        else {
            return res.send(nv);
        }
    }
    catch (error) {
        return next(
            new ApiError(502, "Lỗi tìm kiếm nhân viên!")
        );
    }
} 

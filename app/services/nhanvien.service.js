const CryptoJS = require('crypto-js');
class NhanVienService {
    constructor(client) {
        this.NV = client.db().collection("NhanVien");
    }
    extractNvData(payload) {
        const nv = {
            _id: payload.MSNV,
            password: payload.password,
            hovatenNV: payload.hovatenNV,
            chucVu: payload.chucVu,
            diaChi: payload.diaChi,
            sdt: payload.sdt,
        };
        Object.keys(nv).forEach(
            (key) => nv[key] === undefined && delete nv[key]
        );
        return nv;
    }

    async create(payload) {
        const nv = this.extractNvData(payload);
        const encrypted = CryptoJS.AES.encrypt(nv.password, "Bookrentstore", { iv: "BookrentstoreIV" }).toString();
        nv.password = encrypted;
        const result = await this.NV.insertOne(
            nv,
            { returnDocument: "after", upsert: true },
        );
        return result;
    }

    async findById(id) {
        return await this.NV.findOne({
            _id: id
        });
    }
    async update(id, payload) {
        const filter = {
            _id: id,
        };
        const update = this.extractNvData(payload);
        const result = await this.NV.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.NV.findOneAndDelete({
            _id: id,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.NV.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = NhanVienService;

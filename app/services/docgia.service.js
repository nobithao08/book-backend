const CryptoJS = require('crypto-js');

class DocGiaService {
    constructor(client) {
        this.DocGia = client.db().collection("DocGia");
    }
    extractdocgiaData(payload) {
        const docgia = {
            _id: payload.maDocGia,
            password: payload.password,
            hoLot: payload.hoLot,
            ten: payload.ten,
            phai: payload.phai,
            diaChi: payload.diaChi,
            dienThoai: payload.dienThoai,
        };
        Object.keys(docgia).forEach(
            (key) => docgia[key] === undefined && delete docgia[key]
        );
        return docgia;
    }

    async create(payload) {
        const docgia = this.extractdocgiaData(payload);
        const encrypted = CryptoJS.AES.encrypt(docgia.password, "Bookrentstore", { iv: "BookrentstoreIV" }).toString();
        docgia.password = encrypted;
        const result = await this.DocGia.insertOne(
            docgia,
            { returnDocument: "after", upsert: true },
        );
        return result;
    }

    async findById(id) {
        return await this.DocGia.findOne({
            _id: id
        });
    }
    async updatePassword(id, newPassword) {
        const filter = {
            _id: id,
        };
        newPassword = CryptoJS.AES.encrypt(newPassword, "Bookrentstore", { iv: "BookrentstoreIV" }).toString();
        const result = await this.DocGia.findOneAndUpdate(
            filter,
            { $set: {password:newPassword} },
            { returnDocument: "after" }
        );
        return result;
    }
    async update(id, payload) {
        const filter = {
            _id: id,
        };
        const update = this.extractdocgiaData(payload);
        if(update.password)
        {
            update.password = CryptoJS.AES.encrypt(update.password, "Bookrentstore", { iv: "BookrentstoreIV" }).toString();
        }
        const result = await this.DocGia.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.DocGia.findOneAndDelete({
            _id: id,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.DocGia.deleteMany({});
        return result.deletedCount;
    }
    async decryptPassword(id){
        const docgia = await this.DocGia.findOne({_id:id});
        docgia.password = CryptoJS.AES.decrypt(docgia.password, "Bookrentstore", { iv: "BookrentstoreIV" }).toString(CryptoJS.enc.Utf8);
        return docgia.password;
    }
}
module.exports = DocGiaService;

const { ObjectId } = require("mongodb");
class MuonSachService{
    constructor(client) {
        this.Data= client.db().collection("TheoDoiMuonSach");
    }
    extractData(payload){
        const data = {
            maDocGia:payload.maDocGia,
            maSach: payload.maSach,
            ngayMuon: payload.ngayMuon,
            ngayTra: payload.ngayTra,
            trangThai: payload.trangThai
        }
        Object.keys(data).forEach(
            (key) => data[key] === undefined && delete data[key]
        );
        return data;
    }
    async create(payload) {
        const data = this.extractData(payload);
        const result = await this.Data.insertOne(
            data,
            { returnDocument: "after", upsert: true },
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.Data.find(filter);
            return await cursor.toArray();
        }


    async findById(id) {
        return await this.Data.find({
            maDocGia: id,
        }).toArray();
    }
    async update(id, payload) {
        const filter = {
            _id:  ObjectId.isValid(id) ? new  ObjectId(id) : null,
        };
        const update = this.extractData(payload);
        const result = await this.Data.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Data.findOneAndDelete({
            maDocGia: id,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Data.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = MuonSachService;
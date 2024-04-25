class NxbService{
    constructor(client) {
        this.Nxb = client.db().collection("NhaXuatBan");
    }
    extractNxbData(payload){
        const Nxb = {
            _id: payload.maNxb,
            tenNxb: payload.tenNxb,
            diaChi: payload.diaChi,
        }
        Object.keys(Nxb).forEach(
            (key) => Nxb[key] === undefined && delete Nxb[key]
        );
        return Nxb;
    }
    async create(payload) {
        const nxb = this.extractNxbData(payload);
        const result = await this.Nxb.insertOne(
            nxb,
            { returnDocument: "after", upsert: true },
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.Nxb.find(filter);
            return await cursor.toArray();
        }

    async findByName(tenNxb) {
        return await this.Nxb.find({
            TenNxb: { $regex: new RegExp(tenNxb), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Nxb.findOne({
            _id: id
        });
    }
    async update(id, payload) {
        const filter = {
            _id: id,
        };
        const update = this.extractNxbData(payload);
        const result = await this.Nxb.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Nxb.findOneAndDelete({
            _id: id,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Nxb.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = NxbService;
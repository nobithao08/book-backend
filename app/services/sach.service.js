class BookService {
    constructor(client) {
        this.Book = client.db().collection("Sach");
    }
    extractBookData(payload) {
        const book = {
            _id: payload.masach,
            tenSach: payload.tenSach,
            donGia: payload.donGia,
            soQuyen: payload.soQuyen,
            namXuatBan: payload.namXuatBan,
            maNxb: payload.maNxb,
            tacGia: payload.tacGia,
        };
        Object.keys(book).forEach(
            (key) => book[key] === undefined && delete book[key]
        );
        return book;
    }

    async create(payload) {
        const book = this.extractBookData(payload);
        console.log(book);
        const result = await this.Book.insertOne(
            book,
            { returnDocument: "after", upsert: true },
        );
        console.log(result);
        return result;
    }

    async find(filter) {
        const cursor = await this.Book.find(filter);
            return await cursor.toArray();
        }

    async findByName(tensach) {
        return await this.Book.find({
            tensach: { $regex: new RegExp(tensach), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Book.findOne({
            _id: id
        });
    }
    async update(id, payload) {
        const filter = {
            _id: id,
        };
        const update = this.extractBookData(payload);
        const result = await this.Book.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Book.findOneAndDelete({
            _id: id,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Book.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = BookService;

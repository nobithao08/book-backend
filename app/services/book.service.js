const { ObjectId } = require("mongodb");

class BookService {
    constructor(client) {
        this.Book = client.db().collection("book");
    }

    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractConactData(payload) {
        const book = {
            ten: payload.ten,
            hinhanh: payload.hinhanh,
            gia: payload.gia,
            soquyen: payload.soquyen,
            namxb: payload.namxb,
            maxb: payload.maxb,
        };
        // Remove undefined fields
        Object.keys(book).forEach(
            (key) => book[key] === undefined && delete book[key]
        );
        return book;
    }

    async create(payload) {
        const book = this.extractConactData(payload);
        const result = await this.Book.findOneAndUpdate(
            book,
            { $set: { favorite: book.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.Book.find(filter);
        return await cursor.toArray();
    }

    async findByName(ten) {
        return await this.find({
            ten: { $regex: new RegExp(ten), $options: "i"},
        });
    }

    async findById(id) {
        return await this.Book.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.Book.findOneAndUpdate(
            filter,
            { $set: update },
            { new: true }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Book.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Book.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = BookService;
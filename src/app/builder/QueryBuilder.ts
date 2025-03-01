import { Query } from "mongoose";

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, unknown>;
    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    search(searchableFields: string[]) {
        const searchTerm = this?.query?.searchTerm
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map(item => {
                    return {
                        [item]: { $regex: searchTerm, $options: 'i' }
                    }
                })
            })
        }
        return this
    }
    filter() {
        const { searchTerm, limit, page, fields, sort, ...queryObject } = this.query;
        this.modelQuery = this.modelQuery.find(queryObject);
        return this
    };
    sort() {
        const sort = this.query.sort ? (this.query.sort as string).split(',').join(' ') : '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort as string);
        return this;
    };
    paginate() {
        const page = this.query.page ? Number(this.query.page) : 1;
        const limit = this.query.limit ? Number(this.query.limit) : 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this
    }
    fields() {
        const fields = this.query.fields ? (this.query.fields as string).split(',').join(' ') : '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this
    }
    async countTotal() {
        const totalQueries = this.modelQuery.getFilter();
        const total = await this.modelQuery.model.countDocuments(totalQueries);
        const page = this.query.page ? Number(this.query.page) : 1;
        const limit = this.query.limit ? Number(this.query.limit) : 10;
        const totalPage = Math.ceil(total / limit)
        return {
            page, limit, total, totalPage
        }
    }

}


export default QueryBuilder;
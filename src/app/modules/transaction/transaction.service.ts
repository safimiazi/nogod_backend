import QueryBuilder from "../../builder/QueryBuilder";
import { transactionSearchableFields } from "./transaction.constant";
import { transactionModel } from "./transaction.model";



const getAllTransectionFromDB = async (query: Record<string, unknown>, userId: string) => {
    const userQuery = new QueryBuilder(transactionModel.find({ sender_id: userId, }), query)
      .search(transactionSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const result = await userQuery.modelQuery.populate("user_id") 
    .exec();
    const meta = await userQuery.countTotal();
    return {
      result,
      meta,
    };
  };

export const transactionServices = {
    getAllTransectionFromDB
}
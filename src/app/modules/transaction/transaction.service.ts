import QueryBuilder from '../../builder/QueryBuilder';
import { agentModel } from '../agent/agent.model';
import { transactionSearchableFields } from './transaction.constant';
import { transactionModel } from './transaction.model';

const getAllTransectionFromDB = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  const userQuery = new QueryBuilder(
    transactionModel.find({ sender_id: userId, transaction_type: query.transaction_type }),
    query,
  )
    .search(transactionSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery
    .populate('receiver_id')
    .populate('sender_id')
    .exec();
  const meta = await userQuery.countTotal();
  return {
    result,
    meta,
  };
};


const getAgentTransactions = async (agentId: string) => {
    try {
      // Find the agent by their ID
      const agent = await agentModel.findById(agentId);
  
      if (!agent) {
        throw new Error("Agent not found");
      }
  
      // Fetch all transactions where the agent is the sender or receiver
      const transactions = await transactionModel.find({
        $or: [
          { sender_id: agent.user_id }, // Transaction where the agent is the sender
          { receiver_id: agent.user_id }, // Transaction where the agent is the receiver
        ]
      }).populate("sender_id").populate("receiver_id")
      .sort({ created_at: -1 });
  
      return transactions;
    } catch (error) {
      throw new Error("Error fetching agent's transactions");
    }
  };

export const transactionServices = {
  getAllTransectionFromDB, getAgentTransactions
};

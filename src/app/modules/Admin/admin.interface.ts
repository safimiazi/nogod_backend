import { Model, Types } from 'mongoose';

export type TAdmin = {
  id: string;
  user: Types.ObjectId;
  total_income: number;
  total_money_in_system: number;
  isDeleted: boolean;
};

export interface AdminModel extends Model<TAdmin> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TAdmin | null>;
}

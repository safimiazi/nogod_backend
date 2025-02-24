/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Admin } from '../modules/Admin/admin.model';
import { USER_ROLE } from '../modules/User/user.constant';
import { User } from '../modules/User/user.model';

const seedAdmin = async () => {
  const user = {
    name: 'Md Mohibulla Miazi shafi',
    pin: '12345',
    mobile: '01956867166',
    email: 'mohibullamiazi@gmail.com',
    nid: '1234567890',
    balance: 0,
    role: USER_ROLE.admin,
    isDeleted: false,
  };

  // ✅ Check if admin exists BEFORE starting a transaction
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.admin });
  if (isSuperAdminExists) {
    console.log('Admin user already exists');
    return;
  }

  // ✅ Check if email already exists BEFORE starting a transaction
  const isEmailExists = await User.findOne({ email: user.email });
  if (isEmailExists) {
    throw new Error('Email already exists. Please use a different email.');
  }

  // Start MongoDB session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create the user inside the transaction
    const [adminUser] = await User.create([user], { session });

    console.log(`New admin user created with ID: ${adminUser._id}`);

    // Create the admin document inside the transaction
    const payload = {
      user: adminUser._id,
      total_income: 0,
      total_money_in_system: 0,
    };

    await Admin.create([payload], { session });

    // ✅ Commit transaction
    await session.commitTransaction();
    console.log('Admin user and admin record created successfully');
  } catch (error: any) {
    console.error('Error during transaction:', error.message);

    // ✅ Abort transaction only if commit didn't happen
    await session.abortTransaction();
  } finally {
    // ✅ Always end session properly
    await session.endSession();
  }
};

export default seedAdmin;

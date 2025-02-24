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

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if admin already exists
    const isSuperAdminExists = await User.findOne({ role: USER_ROLE.admin });
    if (isSuperAdminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Check if email already exists
    const isEmailExists = await User.findOne({ email: user.email });
    if (isEmailExists) {
      throw new Error('Email already exists. Please use a different email.');
    }

    // Create the user document
    const adminUser = await User.create([user], { session });
    console.log(adminUser[0]._id);
    // Prepare payload for Admin model
    const payload = {
      user: adminUser[0]._id,
      total_income: 0, // Use valid values here, not empty strings
      total_money_in_system: 0, // Use valid values
    };

    // Create the admin record
    await Admin.create([payload], { session });

    // Commit the transaction
    await session.commitTransaction();
    console.log('Admin user and admin record created successfully');
  } catch (error: any) {
    console.error('Error during transaction:', error.message);

    // Abort the transaction if something goes wrong
    await session.abortTransaction();
  } finally {
    // End the session whether the transaction was successful or not
    await session.endSession();
  }
};

export default seedAdmin;

import { Op } from 'sequelize';
import Capsule from '../models/capsule.js';
import asyncHandler from 'express-async-handler';

const expiresCapsule = asyncHandler(async () => {
    const limit = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);

    const updated = await Capsule.update(
        { expired: true },
        {
            where: {
                unlock_at: { [Op.lte]: limit },
                expired: false,
            },
        }
    );

    if (updated[0] > 0) {
        console.log(`Updated ${updated[0]} capsules to expired`);
    }
});

export default expiresCapsule;
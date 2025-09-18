const mongoose = require('mongoose');
const User = require('../models/users.model');
const Cost = require('../models/costs.model');

const CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];

exports.addCost = async (req, res) => {
  try {
    const { userid, description, category, sum, created_at } = req.body || {};

    const uid = Number(userid);
    const amount = Number(sum);

    // ולידציה בסיסית
    if (
      typeof description !== 'string' ||
      !description.trim() ||
      !CATEGORIES.includes(category) ||
      !Number.isInteger(uid) ||
      !Number.isFinite(amount)
    ) {

      return res.status(400).json({ error: 'bad parameters' });
    }

    // חסימת סכום שלילי
    if (amount < 0) {
      return res.status(400).json({ error: 'sum must be >= 0' });
    }

    
    let user;
    try {
      const queryOrDoc = await User.findOne({ id: uid });
      if (queryOrDoc && typeof queryOrDoc.lean === 'function') {
        user = await queryOrDoc.lean();
      } else {
        user = queryOrDoc; 
      }
    } catch (dbErr) {

      return res.status(404).json({ error: 'user not found' });
    }
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    let createdAt = created_at ? new Date(created_at) : new Date();
    if (isNaN(createdAt.getTime())) {
      return res.status(400).json({ error: 'bad created_at' });
    }
    const now = new Date();
    if (created_at && createdAt.getTime() < now.getTime()) {
      return res.status(400).json({ error: 'cannot add cost in the past' });
    }

    // יצירת העלות
    const doc = await Cost.create({
      userid: uid,
      description: description.trim(),
      category,
      sum: amount,
      created_at: createdAt,
    });

    return res.status(201).json({
      description: doc.description,
      category: doc.category,
      userid: doc.userid,
      sum: doc.sum,
      created_at: doc.created_at,
    });
  } catch (e) {

    if (e?.name === 'ValidationError') {
      return res.status(400).json({ error: 'bad parameters' });
    }
    return res.status(500).json({ error: 'internal error' });
  }
};

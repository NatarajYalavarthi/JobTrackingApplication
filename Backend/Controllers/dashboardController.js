const { Application } = require('../models');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const all = await Application.count({ where: { UserId: userId } });
    const offers = await Application.count({ where: { UserId: userId, status: 'Offer' } });
    const hired = await Application.count({ where: { UserId: userId, status: 'Hired' } });
    const rejected = await Application.count({ where: { UserId: userId, status: 'Rejected' } });
    res.json({ total: all, offers, hired, rejected });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Controllers/roundController.js
const { Application, Round } = require('../models');

exports.addRound = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const app = await Application.findByPk(req.params.applicationId);
    if (!app || app.status !== 'Interviewing') {
      return res.status(400).json({ error: 'Rounds allowed only when status is Interviewing' });
    }

    const round = await Round.create({
      title: req.body.title,
      notes: req.body.notes,
      ApplicationId: req.params.applicationId
    });

    res.status(201).json(round);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRoundsByApplication = async (req, res) => {
  try {
    const rounds = await Round.findAll({
      where: { ApplicationId: req.params.applicationId },
      order: [['createdAt', 'ASC']]
    });
    res.json(rounds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rounds' });
  }
};

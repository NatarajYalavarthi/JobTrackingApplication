const { Application } = require('../models');
const { User } = require('../models');
const sendEmails = require('../utils/sendEmail'); 


exports.createApp = async (req, res) => {
  try {
    const { title, company, status, resume, applied_date, jobpostingId } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check for duplicate using job_posting_id and userId
    const existingApp = await Application.findOne({
      where: {
        UserId: userId,
       jobpostingId
      }
    });

    if (existingApp) {
      return res.status(400).json({ error: 'You already applied for this job.' });
    }

    const app = await Application.create({
      jobpostingId,
      title,
      company,
      status,
      resume,
      applied_date: applied_date || new Date(),
      UserId: userId,
      userName: user.name,
      userEmail: user.email
    });

    res.json({ message: 'Application submitted', app });
  } catch (err) {
    console.error('Application error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.GetUserApps = async (req, res) => {
  try {
    const apps = await Application.findAll({
      // where: { UserId: req.user.id },
      attributes: ['id', 'title', 'company', 'status', 'resume', 'applied_date', 'userName', 'userEmail'] // Explicitly include these
    });

    res.json(apps);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateApp = async (req, res) => {
  try {
    // Only allow admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const app = await Application.findByPk(req.params.id, {
      include: ['User']
    });

    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { status } = req.body;
    await app.update({ status });

    // Send email to the applicant{useremail}
  await sendEmails(
  [app.User.email], // Wrap in array
  'Application Status Updated',
  `Hello ${app.User.name},<br><br>Your application for "<strong>${app.title}</strong>" is now marked as "<strong>${status}</strong>".`
);


    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status and send email' });
  }
};


exports.getSingleApp = async (req, res) => {
  try {
    const apps = await Application.findAll({
      where: {
        UserId: req.params.id,
      },
      attributes: ['jobpostingId', 'status', 'title', 'company','applied_date','userName','userEmail'],
    });

    res.json(apps);
  } catch (err) {
    console.error('Error fetching user applications:', err);
    res.status(500).json({ error: 'Server error' });
  }
};







const { Feedback, Application, User } = require('../models');
const sendEmails = require('../utils/sendEmail'); 

exports.addFeedback = async (req, res) => {
  try {
    // Create feedback
    const feedback = await Feedback.create({
      comments: req.body.comments,
      created_by: req.user.id,
      ApplicationId: req.params.applicationId
    });

    // Fetch the related application and user (applicant)
    const application = await Application.findByPk(req.params.applicationId, {
      include: ['User']
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Send feedback via email
    await sendEmails(
      [application.User.email],
      'New Feedback on Your Application',
      `Hello ${application.User.name},<br><br>You have received new feedback on your application for "<strong>${application.title}</strong>":<br><br><em>${req.body.comments}</em><br><br>Regards,<br>Team`
    );

    res.json(feedback);
  } catch (err) {
    console.error('Error adding feedback:', err);
    res.status(400).json({ error: err.message });
  }
};



exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      include: [
        {
          model: Application,
          include: [
            { model: User, attributes: ['name', 'email'] }
          ],
          attributes: ['id', 'title', 'company', 'userName']
        },
        {
          model: User,
          as: 'CreatedBy',
          attributes: ['name', 'email'] // Admin who gave feedback
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const result = feedbacks.map(fb => ({
      feedback: fb.comments,
      applicationId: fb.Application?.id,
      jobTitle: fb.Application?.title,
      company: fb.Application?.company,
      applicantName: fb.Application?.userName,
      applicantEmail: fb.Application?.User?.email,
      givenBy: fb.CreatedBy?.name,
      createdAt: fb.createdAt
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching all feedbacks:', err);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};



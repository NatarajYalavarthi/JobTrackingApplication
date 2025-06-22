const { JobPosting,Round  } = require('../models');
exports.createjobPosting = async (req, res) => {
  try {
    const { title, company, description, requirements, location, rounds  } = req.body;
    
    const createjobPosting = await JobPosting.create({
      title,
      company,
      description,
      requirements,
      location,
      posted_by: req.user.id
    });
    // if (rounds && rounds.length > 0) {
    //   const roundsWithAppId = rounds.map((round) => ({
    //     ...round,
    //     jobpostingId: createjobPosting.id 
    //   }));
    //   await Round.bulkCreate(roundsWithAppId);
    // }
    
    res.status(201).json(createjobPosting);
  } catch (error) {
    console.error('Job creation error:', error); 
    res.status(500).json({ message: 'Error creating job posting' });
  }
}

exports.getAllJobPostings = async (req, res) => {
    console.log(res)
  try {
    const jobPostings = await JobPosting.findAll({
      // include: [
      //   {
      //     model: Round,
      //     as: 'Rounds'
      //   }
      // ]
    });

    res.status(200).json(jobPostings);
  } catch (error) {
    console.error('Error fetching job postings:', error);
    res.status(500).json({ message: 'Failed to fetch job postings' });
  }
};

exports.updateJobPosting = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { title, company, description, requirements, location } = req.body;

    const job = await JobPosting.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

 if (job.posted_by !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({ message: 'Not authorized to update this job' });
}

    await job.update({
      title,
      company,
      description,
      requirements,
      location,
    });

    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Error updating job posting' });
  }
};
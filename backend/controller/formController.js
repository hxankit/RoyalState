import Form from '../models/formModel.js';

export const submitForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newForm = new Form({
      name,
      email,
      phone,
      message,
    });

    const savedForm = await newForm.save();

    res.json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all form submissions (Admin only)
export const getAllFormSubmissions = async (req, res) => {
  try {
    const { search, sortBy = '-createdAt', page = 1, limit = 20 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = {};

    // Search by name or email
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const total = await Form.countDocuments(query);
    const forms = await Form.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: forms,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch form submissions' 
    });
  }
};

// Delete a form submission (Admin only)
export const deleteFormSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    
    const form = await Form.findByIdAndDelete(id);
    
    if (!form) {
      return res.status(404).json({ 
        success: false,
        message: 'Form submission not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Form submission deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting form submission:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete form submission' 
    });
  }
};
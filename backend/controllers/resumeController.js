import Resume from '../models/resumeModel.js';
import fs from 'fs';
import path  from 'path';

export const createResume = async (req, res) => {
    try {
        const { title } = req.body;

        // Provide all required top-level fields for the schema
        // Ensure at least one valid education entry with all required fields
        let educationArr = Array.isArray(req.body.education) ? req.body.education : [];
        if (
            !educationArr.length ||
            !educationArr[0].degree ||
            !educationArr[0].institution ||
            !educationArr[0].graduationDate
        ) {
            educationArr = [
                {
                    degree: 'Degree',
                    institution: 'Institution',
                    graduationDate: new Date()
                }
            ];
        }

        const newResume = await Resume.create({
            userId: req.user.id,
            title: title || 'Untitled Resume',
            summary: req.body.summary || 'Summary goes here',
            thumbnail: req.body.thumbnail || 'default-thumbnail.png',
            education: educationArr,
            skills: req.body.skills || [
                { name: 'Skill', progress: 0 }
            ],
            template: req.body.template || {
                theme: 'default',
                colorPalette: ['#0D3B66', '#FAF0CA', '#F4D35E', '#EE964B', '#F95738']
            },
            profileInfo: req.body.profileInfo || {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: ''
            },
            contactInfo: req.body.contactInfo || {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: ''
            },
            experience: req.body.experience || [],
            projects: req.body.projects || [],
            certifications: req.body.certifications || [],
            languages: req.body.languages || [],
            interests: req.body.interests || []
        });
        await newResume.save();
        res.status(201).json(newResume);
    } catch (error) {
        res.status(500).json({ message: 'Error creating resume', error: error.message });
    }
};

//get function
export async function getUserResumes(req, res) {
    try {
        const resumes = await Resume.find({ userId: req.user.id }).sort({ UpdatedAt: -1 });
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resumes', error: error.message });
    }
}

//get resume by id

export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findOne({ userId: req.user.id, _id: id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume', error: error.message });
  }
};

//update resumes

export const updateResume = async (req, res) => {
    try{
        const resume = await Resume.findOne({
            userId: req.user.id,
            _id: req.params.id
        })

        if(!resume){
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Update the resume with the new data
        Object.assign(resume, req.body);
        const savedResume = await resume.save();
        res.status(200).json(savedResume);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating resume', error: error.message });
    }
};

//delete resume

export const deleteResume = async (req, res) => {
    try{
        const resume = await Resume.findOne({
             userId: req.user.id,
            _id: req.params.id
        })
         if(!resume){
            return res.status(404).json({ message: 'Resume not found' });
        }

        //create a upload folder and store the resume there
        const uploadsFolder= path.join(process.cwd(), 'uploads');

        //delete thumbnail function

        if(resume.thumbnailLink){
            const thumbnailPath = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
           if(fs.existsSync(thumbnailPath)){
               fs.unlinkSync(thumbnailPath);
           }
        }
        if(resume.profileInfo?.profilePreviewUrl){
            const profilePreviewPath = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
            if(fs.existsSync(profilePreviewPath)){
                fs.unlinkSync(profilePreviewPath);
            }
        }

        //delete resume doc
        const deleted = await Resume.findOneAndDelete({
            userId: req.user.id,
            _id: req.params.id
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json({ message: 'Resume deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting resume', error: error.message });
    }
    
}
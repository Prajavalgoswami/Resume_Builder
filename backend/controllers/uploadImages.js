import fs from 'fs';    
import path from 'path';

import Resume from '../models/resumeModel.js';
import upload from '../middleware/uploadMiddleware.js';

export const uploadResumeImages = async (req, res) => {
  try {
    //configure multer to handle images

    upload.fields([{ name : "thumbnail"}, { name : "profileImages"}])
    (req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading images', error: err.message });
      }

      const resumeId = req.params.id;

      const resume = await Resume.findOne({ userId: req.user.id, _id: resumeId });

      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }

      //use process cwd to locate uploads folder

      const uploadsFolder = path.join(process.cwd(), 'uploads');
      const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;

      const newThumbnail = req.files.thumbnail?.[0];
      const newProfileImage = req.files.profileImages?.[0];

      // Update the resume with the new image paths
        if (newThumbnail) {
            if(resume.thumbnailLink){
                const oldThumbnailPath = path.join(uploadsFolder, resume.thumbnailLink);
                if (fs.existsSync(oldThumbnailPath)) {
                    fs.unlinkSync(oldThumbnailPath);
                }
            }
            resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
        }

      
        //same for profilepreview image
        if (newProfileImage) {
            if (resume.profileInfo?.profilePreviewUrl) {
                const oldProfileImagePath = path.join(uploadsFolder, resume.profileInfo.profilePreviewUrl);
                if (fs.existsSync(oldProfileImagePath)) {
                    fs.unlinkSync(oldProfileImagePath);
                }
            }
            resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
        }

       await resume.save();
       res.status(200).json({ message: 'Images uploaded successfully',
                              thumbnailLink: resume.thumbnailLink,
                            profilePreviewUrl: resume.profileInfo.profilePreviewUrl });
    })
  } catch (error) {
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
};

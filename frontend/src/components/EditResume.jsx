import React, { useCallback, useEffect, useRef, useState } from 'react'
import Dashboard from '../pages/Dashboard'
import DashboardLayout from './DashboardLayout'
import { buttonStyles, containerStyles, iconStyles, statusStyles } from '../assets/dummystyle'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Check, Download, Loader2, Palette, Trash, Save } from 'lucide-react'
import { API_PATHS } from '../utils/apiPaths'
import toast from 'react-hot-toast'
import { Input, TitleInput } from "./Input.jsx";
import axiosInstance from '../utils/axiosInstance.js'
import { fixTailwindColors } from '../utils/color.js'
import { Chrome } from "lucide-react";   
import Resume1 from "../assets/Resume1.png";
import Resume2 from "../assets/Resume2.png";
import Resume3 from "../assets/Resume3.png";


import html2pdf from 'html2pdf.js'
import StepProgress from './StepProgress.jsx'
import {
  ProfileInfoForm,
  ContactInfoForm,
  WorkExperienceForm,
  EducationDetailsForm,
  SkillsInfoForm,
  ProjectDetailForm,
  CertificationInfoForm,
  AdditionalInfoForm,
} from './Forms.jsx'
import Modal from './Model.jsx'
import html2canvas from 'html2canvas'
import { dataURLtoFile } from '../utils/helper'
import TemplateOne from './TemplateOne.jsx'
import TemplateTwo from './TemplateTwo.jsx'
import TemplateThree from './TemplateThree.jsx'



//resize observer hook
const useResizeObserver = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useCallback((node) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setSize({ width, height });
      });
      resizeObserver.observe(node);
    }
  }, []);
  return { ref, size };
};
// Local renderer to choose a resume template
const RenderResume = ({ templateId, resumeData, containerWidth }) => {
  const id = (templateId || '').toLowerCase();
  switch (id) {
    case 'modern':
    case 'template-one':
    case 'one':
      return <TemplateOne resumeData={resumeData} containerWidth={containerWidth || 0} />;
    case 'simple':
    case 'template-two':
    case 'two':
      return <TemplateTwo resumeData={resumeData} containerWidth={containerWidth || 0} />;
    case 'classic':
    case 'template-three':
    case 'three':
      return <TemplateThree resumeData={resumeData} containerWidth={containerWidth || 0} />;
    default:
      return <TemplateOne resumeData={resumeData} containerWidth={containerWidth || 0} />;
  }
}
const EditResume = () => {

     const { resumeId } = useParams()
  const navigate = useNavigate()
  const resumeDownloadRef = useRef(null)
  const thumbnailRef = useRef(null)

  const [openThemeSelector, setOpenThemeSelector] = useState(false)
  const [openPreviewModal, setOpenPreviewModal] = useState(false)
  const [currentPage, setCurrentPage] = useState("profile-info")
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [completionPercentage, setCompletionPercentage] = useState(0)

  const { width: previewWidth, ref: previewContainerRef } = useResizeObserver();

  const [resumeData, setResumeData] = useState({
    title: "Professional Resume",
    thumbnailLink: "",
    profileInfo: {
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "modern",
      colorPalette: []
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interests: [""],
  })
  
  // Calculate completion percentage
  const calculateCompletion = () => {
    let completedFields = 0;
    let totalFields = 0;
    
    // Don't calculate if resumeData is not yet loaded
    if (!resumeData) return 0;

    // Profile Info
    totalFields += 3;
    if (resumeData.profileInfo.fullName) completedFields++;
    if (resumeData.profileInfo.designation) completedFields++;
    if (resumeData.profileInfo.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resumeData.contactInfo.email) completedFields++;
    if (resumeData.contactInfo.phone) completedFields++;

    // Work Experience
    resumeData.workExperience.forEach(exp => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resumeData.education.forEach(edu => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resumeData.skills.forEach(skill => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resumeData.projects.forEach(project => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resumeData.certifications.forEach(cert => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resumeData.languages.forEach(lang => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += resumeData.interests.length;
    completedFields += resumeData.interests.filter(i => i.trim() !== "").length;

    const percentage = Math.round((completedFields / totalFields) * 100);
    const validPercentage = isNaN(percentage) ? 0 : percentage;
    setCompletionPercentage(validPercentage);
    return validPercentage;
  };

  useEffect(() => {
    calculateCompletion();
  }, [resumeData]);

// Validate Inputs
const validateAndNext = (e) => {
  const errors = []

  switch (currentPage) {
    case "profile-info":
      const { fullName, designation, summary } = resumeData.profileInfo
      if (!fullName.trim()) errors.push("Full Name is required")
      if (!designation.trim()) errors.push("Designation is required")
      if (!summary.trim()) errors.push("Summary is required")
      break

    case "contact-info":
      const { email, phone } = resumeData.contactInfo
      if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Valid email is required.")
      if (!phone.trim() || !/^\d{10}$/.test(phone)) errors.push("Valid 10-digit phone number is required")
      break

    case "work-experience":
      resumeData.workExperience.forEach(({ company, role, startDate, endDate }, index) => {
        if (!company || !company.trim()) errors.push(`Company is required in experience ${index + 1}`)
        if (!role || !role.trim()) errors.push(`Role is required in experience ${index + 1}`)
        if (!startDate || !endDate) errors.push(`Start and End dates are required in experience ${index + 1}`)
      })
      break

    case "education-info":
      resumeData.education.forEach(({ degree, institution, startDate, endDate }, index) => {
        if (!degree.trim()) errors.push(`Degree is required in education ${index + 1}`)
        if (!institution.trim()) errors.push(`Institution is required in education ${index + 1}`)
        if (!startDate || !endDate) errors.push(`Start and End dates are required in education ${index + 1}`)
      })
      break

    case "skills":
      resumeData.skills.forEach(({ name, progress }, index) => {
        if (!name.trim()) errors.push(`Skill name is required in skill ${index + 1}`)
        if (progress < 1 || progress > 100)
          errors.push(`Skill progress must be between 1 and 100 in skill ${index + 1}`)
      })
      break

    case "projects":
      resumeData.projects.forEach(({ title, description }, index) => {
        if (!title.trim()) errors.push(`Project Title is required in project ${index + 1}`)
        if (!description.trim()) errors.push(`Project description is required in project ${index + 1}`)
      })
      break

    case "certifications":
      resumeData.certifications.forEach(({ title, issuer }, index) => {
        if (!title.trim()) errors.push(`Certification Title is required in certification ${index + 1}`)
        if (!issuer.trim()) errors.push(`Issuer is required in certification ${index + 1}`)
      })
      break

    case "additionalInfo":
      if (resumeData.languages.length === 0 || !resumeData.languages[0].name?.trim()) {
        errors.push("At least one language is required")
      }
      if (resumeData.interests.length === 0 || !resumeData.interests[0]?.trim()) {
        errors.push("At least one interest is required")
      }
      break

    default:
      break
  }

  if (errors.length > 0) {
    setErrorMsg(errors.join(", "))
    return
  }

  setErrorMsg("")
  goToNextStep()
}

const goToNextStep = () => {
  const pages = [
    "profile-info",
    "contact-info",
    "work-experience",
    "education-info",
    "skills",
    "projects",
    "certifications",
    "additionalInfo",
  ]

  if (currentPage === "additionalInfo") setOpenPreviewModal(true)

  const currentIndex = pages.indexOf(currentPage)
  if (currentIndex !== -1 && currentIndex < pages.length - 1) {
    const nextIndex = currentIndex + 1
    setCurrentPage(pages[nextIndex])

    const percent = Math.round((nextIndex / (pages.length - 1)) * 100)
    setProgress(percent)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
}
// take back to previous form or take back to /dashboard
const goBack = () => {
  const pages = [
    "profile-info",
    "contact-info",
    "work-experience",
    "education-info",
    "skills",
    "projects",
    "certifications",
    "additionalInfo",
  ]

  if (currentPage === "profile-info") navigate("/dashboard")

  const currentIndex = pages.indexOf(currentPage)
  if (currentIndex > 0) {
    const prevIndex = currentIndex - 1
    setCurrentPage(pages[prevIndex])

    const percent = Math.round((prevIndex / (pages.length - 1)) * 100)
    setProgress(percent)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
}

const renderForm = () => {
  switch (currentPage) {
    case "profile-info":
      return (
        <ProfileInfoForm
          profileData={resumeData?.profileInfo}
          updateSection={(key, value) => updateSection("profileInfo", key, value)}
          onNext={validateAndNext}
        />
      )

    case "contact-info":
      return (
        <ContactInfoForm
          contactInfo={resumeData?.contactInfo}
          updateSection={(key, value) => updateSection("contactInfo", key, value)}
        />
      )

    case "work-experience":
      return (
        <WorkExperienceForm
          workExperience={resumeData?.workExperience}
          updateArrayItem={(index, key, value) => {
            updateArrayItem("workExperience", index, key, value)
          }}
          addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
          removeArrayItem={(index) => removeArrayItem("workExperience", index)}
        />
      )

    case "education-info":
      return (
        <EducationDetailsForm
          educationInfo={resumeData?.education}
          updateArrayItem={(index, key, value) => {
            updateArrayItem("education", index, key, value)
          }}
          addArrayItem={(newItem) => addArrayItem("education", newItem)}
          removeArrayItem={(index) => removeArrayItem("education", index)}
        />
      )

    case "skills":
      return (
        <SkillsInfoForm
          skillsInfo={resumeData?.skills}
          updateArrayItem={(index, key, value) => {
            updateArrayItem("skills", index, key, value)
          }}
          addArrayItem={(newItem) => addArrayItem("skills", newItem)}
          removeArrayItem={(index) => removeArrayItem("skills", index)}
        />
      )

    case "projects":
      return (
        <ProjectDetailForm
          projectInfo={resumeData?.projects}
          updateArrayItem={(index, key, value) => {
            updateArrayItem("projects", index, key, value)
          }}
          addArrayItem={(newItem) => addArrayItem("projects", newItem)}
          removeArrayItem={(index) => removeArrayItem("projects", index)}
        />
      )

    case "certifications":
      return (
        <CertificationInfoForm
          certifications={resumeData?.certifications}
          updateArrayItem={(index, key, value) => {
            updateArrayItem("certifications", index, key, value)
          }}
          addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
          removeArrayItem={(index) => removeArrayItem("certifications", index)}
        />
      )

    case "additionalInfo":
      return (
        <AdditionalInfoForm
          languages={resumeData.languages}
          interests={resumeData.interests}
          updateArrayItem={(section, index, key, value) => updateArrayItem(section, index, key, value)}
          addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
          removeArrayItem={(section, index) => removeArrayItem(section, index)}
        />
      )

    default:
      return null
  }
}

  //update section state
  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  //update array item state
   const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]]

      if (key === null) {
        updatedArray[index] = value
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        }
      }

      return {
        ...prev,
        [section]: updatedArray,
      }
    })
  }

  // add array item state
  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }))
  }

  //remove array item state
  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]]
      updatedArray.splice(index, 1)
      return {
        ...prev,
        [section]: updatedArray,
      }
    })
  }

  //fetching the resume details using backend url
  const fetchResumeDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(resumeId))

      if (response.data && response.data.profileInfo) {
        const resumeInfo = response.data
        // sanitize server data: remove completely-empty placeholder entries so
        // completion calculation and validation are consistent with dashboard
        const sanitizeArray = (arr, requiredKeys = null) => {
          if (!Array.isArray(arr)) return []
          return arr.filter(item => {
            if (!item) return false
            // if requiredKeys provided, consider those fields; otherwise check all values
            const values = requiredKeys ? requiredKeys.map(k => item[k]) : Object.values(item)
            return values.some(v => {
              if (v === null || v === undefined) return false
              if (typeof v === 'string') return v.trim() !== ''
              if (typeof v === 'number') return v !== 0
              return true
            })
          })
        }

        const sanitized = {
          ...resumeInfo,
          workExperience: sanitizeArray(resumeInfo.workExperience, ['company','role','startDate','endDate','description']),
          education: sanitizeArray(resumeInfo.education, ['degree','institution','startDate','endDate']),
          skills: sanitizeArray(resumeInfo.skills, ['name','progress']),
          projects: sanitizeArray(resumeInfo.projects, ['title','description','github','liveDemo']),
          certifications: sanitizeArray(resumeInfo.certifications, ['title','issuer','year']),
          languages: sanitizeArray(resumeInfo.languages, ['name','progress']),
          interests: Array.isArray(resumeInfo.interests) ? resumeInfo.interests.filter(i => (i || '').toString().trim() !== '') : [],
        }

        setResumeData((prevState) => ({
          ...prevState,
          title: sanitized?.title || "Untitled",
          template: sanitized?.template || prevState?.template,
          profileInfo: sanitized?.profileInfo || prevState?.profileInfo,
          contactInfo: sanitized?.contactInfo || prevState?.contactInfo,
          workExperience: sanitized?.workExperience || [],
          education: sanitized?.education || [],
          skills: sanitized?.skills || [],
          projects: sanitized?.projects || [],
          certifications: sanitized?.certifications || [],
          languages: sanitized?.languages || [],
          interests: sanitized?.interests || [],
        }))

        // Immediately set completionPercentage based on sanitized data so Edit page
        // shows the same completion as Dashboard
        const tempResumeForCalc = {
          ...resumeInfo,
          ...sanitized,
        }
        const calc = (function calcLoc(r) {
          // reuse same logic as calculateCompletion but without setting state
          let completedFields = 0; let totalFields = 0;
          totalFields += 3; if (r.profileInfo?.fullName) completedFields++; if (r.profileInfo?.designation) completedFields++; if (r.profileInfo?.summary) completedFields++;
          totalFields += 2; if (r.contactInfo?.email) completedFields++; if (r.contactInfo?.phone) completedFields++;
          (r.workExperience||[]).forEach(exp => { totalFields +=5; if (exp.company) completedFields++; if (exp.role) completedFields++; if (exp.startDate) completedFields++; if (exp.endDate) completedFields++; if (exp.description) completedFields++; });
          (r.education||[]).forEach(edu => { totalFields +=4; if (edu.degree) completedFields++; if (edu.institution) completedFields++; if (edu.startDate) completedFields++; if (edu.endDate) completedFields++; });
          (r.skills||[]).forEach(skill => { totalFields +=2; if (skill.name) completedFields++; if (skill.progress>0) completedFields++; });
          (r.projects||[]).forEach(project => { totalFields +=4; if (project.title) completedFields++; if (project.description) completedFields++; if (project.github) completedFields++; if (project.liveDemo) completedFields++; });
          (r.certifications||[]).forEach(cert => { totalFields +=3; if (cert.title) completedFields++; if (cert.issuer) completedFields++; if (cert.year) completedFields++; });
          (r.languages||[]).forEach(lang => { totalFields +=2; if (lang.name) completedFields++; if (lang.progress>0) completedFields++; });
          totalFields += (r.interests?.length||0); completedFields += (r.interests?.filter(i=>i?.trim()!=='').length||0);
          const p = Math.round((completedFields/ totalFields)*100) || 0; return p;
        })(tempResumeForCalc)
        setCompletionPercentage(calc)
        // also set step progress bar to a best-effort mapping so visual feedback is consistent
        setProgress(calc)
      }
    } 
    catch (error) {
      console.error("Error fetching resume:", error)
      toast.error("Failed to load resume data")
    }
  }

  //it will helpl in choosing the preview  as well as helps in downloading the resume also save the resume as image
  const uploadResumeImages = async () => {
    try {
      setIsLoading(true)

      const thumbnailElement = thumbnailRef.current
      if (!thumbnailElement) {
        throw new Error("Thumbnail element not found")
      }

      const fixedThumbnail = fixTailwindColors(thumbnailElement)

      const thumbnailCanvas = await html2canvas(fixedThumbnail, {
        scale: 0.5,
        backgroundColor: "#FFFFFF",
        logging: false,
      })

      document.body.removeChild(fixedThumbnail)

      const thumbnailDataUrl = thumbnailCanvas.toDataURL("image/png")
      const thumbnailFile = dataURLtoFile(
        thumbnailDataUrl,
        `thumbnail-${resumeId}.png`
      )

      const formData = new FormData()
      formData.append("thumbnail", thumbnailFile)

      const uploadResponse = await axiosInstance.put(
        API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

      const { thumbnailLink } = uploadResponse.data
      await updateResumeDetails(thumbnailLink)

      toast.success("Resume Updated Successfully")
      navigate("/dashboard")
    } catch (error) {
      console.error("Error Uploading Images:", error)
      toast.error("Failed to upload images")
    } finally {
      setIsLoading(false)
    }
  }

  // delete function to delete any resume
   const handleDeleteResume = async () => {
    try {
      setIsLoading(true)
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId))
      toast.success("Resume deleted successfully")
      navigate("/dashboard")
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast.error("Failed to delete resume")
    } finally {
      setIsLoading(false)
    }
  }

// this will help in updating the resumes . and put  will help in updation on backend
const updateResumeDetails = async (thumbnailLink) => {
    try {
      setIsLoading(true)

      // Calculate completion before saving
      const currentCompletion = calculateCompletion();
      
      await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), {
        ...resumeData,
        thumbnailLink: thumbnailLink || "",
        completion: currentCompletion,
      })
    } catch (err) {
      console.error("Error updating resume:", err)
      toast.error("Failed to update resume details")
    } finally {
      setIsLoading(false)
    }
  }

   //download function
    const downloadPDF = async () => {
    const element = resumeDownloadRef.current;
    if (!element) {
      toast.error("Failed to generate PDF. Please try again.");
      return;
    }
  
    setIsDownloading(true);
    setDownloadSuccess(false);
    const toastId = toast.loading("Generating PDFâ€¦");
  
    const override = document.createElement("style");
    override.id = "__pdf_color_override__";
    override.textContent = `
      * {
        color: #000 !important;
        background-color: #fff !important;
        border-color: #000 !important;
      }
    `;
    document.head.appendChild(override);
  
    // type of how it will look when downloaded
    try {
      // Clone the element and remove any transform/scale so html2canvas captures natural layout
      const clone = element.cloneNode(true);
      clone.id = "__pdf_clone__";
      // reset transform/scale that may be applied for on-screen preview
      clone.style.transform = "none";
      clone.style.transformOrigin = "top left";
      // ensure clone has the correct width to render pages properly
      clone.style.width = `${element.scrollWidth}px`;
      clone.style.boxSizing = "border-box";
  // position on-screen but non-interactive so html2canvas can render it reliably
  clone.style.position = "fixed";
  clone.style.left = "0px";
  clone.style.top = "0px";
  clone.style.zIndex = "9999";
  clone.style.pointerEvents = "none";
  // ensure it's visible to the renderer (avoid display:none or opacity:0)
  clone.style.opacity = "1";
      document.body.appendChild(clone);

      await html2pdf()
        .set({
          margin:       0,
          filename:     `${resumeData.title.replace(/[^a-z0-9]/gi, "_")}.pdf`,
          image:        { type: "png", quality: 1.0 },
          html2canvas:  {
            scale:           2,
            useCORS:         true,
            backgroundColor: "#FFFFFF",
            logging:         false,
            windowWidth:     clone.scrollWidth,
          },
          jsPDF:        {
            unit:       "mm",
            format:     "a4",
            orientation:"portrait",
          },
          pagebreak: {
            mode: ['css', 'legacy']
          }
        })
        .from(clone)
        .save(); //save resume here then we download it

      toast.success("PDF downloaded successfully!", { id: toastId });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);

      // remove the clone after saving
      document.getElementById("__pdf_clone__")?.remove();

    } catch (err) {
      console.error("PDF error:", err);
      toast.error(`Failed to generate PDF: ${err.message}`, { id: toastId });

    } finally {
      document.getElementById("__pdf_color_override__")?.remove();
      // ensure clone removed in case of error
      document.getElementById("__pdf_clone__")?.remove();
      setIsDownloading(false);
    }
  };

  //theme selector function
  const updateTheme = (theme) => {
    setResumeData(prev => ({
      ...prev,
      template: {
        theme: theme,
        colorPalette: []
      }
    }));
  }

  // Autosave functionality
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (resumeId) {
      fetchResumeDetailsById()
    }
  }, [resumeId])

  // Autosave when resumeData changes
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // Prevent autosave from running immediately after initial load — wait until
    // user has the data and the initial load flag is cleared.
    if (!resumeId || !resumeData) return;
    if (initialLoadRef.current) {
      // first change after fetchResumeDetailsById will set dataLoaded and clear this flag
      initialLoadRef.current = false;
      setDataLoaded(true);
      return;
    }

    // Only autosave when data has been loaded and user makes changes
    if (dataLoaded) {
      const timer = setTimeout(async () => {
        try {
          await updateResumeDetails();
          console.log('Resume autosaved');
        } catch (err) {
          console.error('Autosave failed:', err);
        }
      }, 2000); // Save 2 seconds after last change

      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [resumeData, dataLoaded]);

  // Update completion percentage whenever data changes
  useEffect(() => {
    calculateCompletion();
  }, [resumeData]); 

  return (
  <DashboardLayout>
      <div className={containerStyles.main}>

        <div className={containerStyles.header}>
          <TitleInput title={resumeData.title} setTitle={(value) => setResumeData((prev) => ({ ...prev, title: value }))} />
          <div className='flex flex-wrap items-center gap-3'>
            <button onClick={() => setOpenThemeSelector(true)} className={buttonStyles.theme}>
              <Palette size={16} />
              <span className='text-sm'>Theme</span>
            </button>
            <button onClick={handleDeleteResume} className={buttonStyles.delete} disabled={isLoading}>
              <Trash size={16} />
              <span className='text-sm'>Delete</span>
            </button>
            <button onClick={() => setOpenPreviewModal(true)} className={buttonStyles.download}>
              <Download size={16} />
              <span className='text-sm'>Preview</span>
            </button>
          </div>
        </div>

        {/* Theme Selector Modal */}
        {openThemeSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-[800px] w-full">
              <h2 className="text-lg font-semibold mb-4">Choose a Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  className={`flex flex-col items-center p-4 rounded border transition-all hover:shadow-lg ${resumeData.template.theme === 'template-one' ? 'bg-purple-100 border-purple-400' : 'border-gray-200 hover:border-purple-200'}`}
                  onClick={() => { updateTheme('template-one'); setOpenThemeSelector(false); }}
                >
                  <img src={Resume1} alt="Template One" className="w-full h-auto mb-2 rounded shadow" />
                  <span>Template One</span>
                </button>
                <button
                  className={`flex flex-col items-center p-4 rounded border transition-all hover:shadow-lg ${resumeData.template.theme === 'template-two' ? 'bg-purple-100 border-purple-400' : 'border-gray-200 hover:border-purple-200'}`}
                  onClick={() => { updateTheme('template-two'); setOpenThemeSelector(false); }}
                >
                  <img src={Resume2} alt="Template Two" className="w-full h-auto mb-2 rounded shadow" />
                  <span>Template Two</span>
                </button>
                <button
                  className={`flex flex-col items-center p-4 rounded border transition-all hover:shadow-lg ${resumeData.template.theme === 'template-three' ? 'bg-purple-100 border-purple-400' : 'border-gray-200 hover:border-purple-200'}`}
                  onClick={() => { updateTheme('template-three'); setOpenThemeSelector(false); }}
                >
                  <img src={Resume3} alt="Template Three" className="w-full h-auto mb-2 rounded shadow" />
                  <span>Template Three</span>
                </button>
              </div>
              <div className="flex justify-center mt-6">
                <button 
                  className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors" 
                  onClick={() => setOpenThemeSelector(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* step progress */}
      {/* You can add your step progress bar here */}

     
      </div>

      <div className={containerStyles.grid}>
        <div className={containerStyles.formContainer}>
          <StepProgress progress={progress} />
          {renderForm()}
          <div className=' p-4 sm:p-6'>
            {errorMsg && (
              <div className={statusStyles.error}>
                <AlertCircle size={16} />
                {errorMsg}
              </div>
            )}
            <div className=' flex flex-wrap items-center justify gap-3'>
              <button className={buttonStyles.back} onClick={goBack} disabled={isLoading}>
                <ArrowLeft size={16} />
                Back
              </button>
                <button className={buttonStyles.next} onClick={validateAndNext} disabled={isLoading}>
                  {currentPage === "additionalInfo" && <Download size={16}/>}
                  {currentPage === "additionalInfo" ? "Preview & Download" : "Next"}
                  {currentPage === "additionalInfo" && <ArrowLeft size={16} className='rotate-180'/>}
                </button>
            </div>
          </div>
        </div>

        <div className='hidden lg:block'>
          <div className={containerStyles.previewContainer}>
            <div className='text-center mb-4'>
              <div className={statusStyles.completionBadge}>
                <div className={iconStyles.pulseDot}></div>
                <span>Preview - {completionPercentage}% Complete</span>
              </div>
            </div>
            <div className='preview-container relative' ref={previewContainerRef}>
              <div className={containerStyles.previewInner}>
                <RenderResume key={`preview-${resumeData?.template?.theme}`}
                templateId={resumeData?.template?.theme || ""}
                resumeData={resumeData}
                containerWidth={previewWidth} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Modal isOpen={openPreviewModal} onClose={() => setOpenPreviewModal(false)}
      title={resumeData.title}
      showActionBtn
      actionBtnText={isDownloading ? "Generating..." : downloadSuccess ? "Downloaded!" : "Download PDF"} 
       
       actionBtnIcon={
        isDownloading ? (
          <Loader2 size={16} className='animate-spin'/>

        ): 
        downloadSuccess ? (
          <Check size={16} className='text-white'/>

        ): (
          <Download size={16}/>
        )
       }
       onActionClick={downloadPDF}>
        <div className='relative'>
          <div className='text-center mb-4'>
            <div className={statusStyles.modalBadge}>
              <div className={iconStyles.pulseDot}>
                <span>Completion: {completionPercentage}%</span>
              </div>
            </div>
            
            <div className={containerStyles.pdfPreview}>
              <div ref={resumeDownloadRef} className='a4-wrapper'>
                <div className='w-full h-full'>
                  <RenderResume key={`pdf-${resumeData?.template?.theme}`}
                   templateId={resumeData?.template?.theme || ""}
                   resumeData={resumeData}
                   containerWidth={0} />
                </div>
              </div>
            </div>
          </div>
        </div>
        </Modal>

        <div style={{display:"none"}} ref={thumbnailRef}>
          <div className={containerStyles.hiddenThumbnail}>
            <RenderResume key={`thumb-${resumeData?.template?.theme}`}
            templateId={resumeData?.template?.theme || ""}
            resumeData={resumeData}
            containerWidth={0} />
          </div>
        </div>
    </DashboardLayout>
  )
}


export default EditResume

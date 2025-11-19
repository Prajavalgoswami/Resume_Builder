"use client";
import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../utils/helper";

const sectionTitleClass =
  "text-base font-bold uppercase tracking-wide mb-1 pb-1 border-b border-gray-300";

const TemplateTwo = ({ resumeData = {}, containerWidth }) => {
  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    languages = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    interests = [],
  } = resumeData;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current && containerWidth > 0) {
      const actualWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualWidth);
      setScale(containerWidth / actualWidth);
    }
  }, [containerWidth]);

  return (
    <div
      ref={resumeRef}
      className="resume-section p-4 bg-white font-sans text-black max-w-4xl mx-auto"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : undefined,
      }}
    >
      {/* Header Section */}
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          {profileInfo.fullName}
        </h1>
        <p className="text-sm text-gray-600 font-medium mb-2">
          {profileInfo.designation}
        </p>
        <div className="flex flex-wrap justify-center gap-1 text-[11px] text-gray-700">
          {contactInfo.phone && <span>{contactInfo.phone}</span>}
          {contactInfo.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="hover:underline text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              {contactInfo.email}
            </a>
          )}
          {contactInfo.linkedin && (
            <a
              href={contactInfo.linkedin}
              className="hover:underline text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          )}
          {contactInfo.github && (
            <a href={contactInfo.github} className="hover:underline text-blue-600" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}
          {contactInfo.website && (
            <a href={contactInfo.website} className="hover:underline text-blue-600" target="_blank" rel="noopener noreferrer">
              Portfolio
            </a>
          )}
        </div>
      </div>

      <hr className="border-gray-300 mb-2" />

      {/* Summary */}
      {profileInfo.summary && (
        <section className="text-center mb-4">
          <h2 className={sectionTitleClass}>Summary</h2>
          <p className="text-[11px] text-gray-800 leading-tight">
            {profileInfo.summary}
          </p>
        </section>
      )}

      {/* All other sections left-aligned */}
      <div className="text-left">
        {/* Experience */}
        {workExperience.length > 0 && (
          <section className="mb-2">
            <h2 className={sectionTitleClass}>Experience</h2>
            <div className="space-y-2">
              {workExperience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <h3 className="font-semibold text-[12px] text-gray-800">{exp.role}</h3>
                  <p className="italic text-[11px] text-gray-600">
                    {exp.company} | {formatYearMonth(exp.startDate)} - {formatYearMonth(exp.endDate)}
                  </p>
                  {exp.location && (
                    <p className="text-[11px] text-gray-600">{exp.location}</p>
                  )}
                  {exp.technologies && (
                    <p className="bg-gray-100 text-[10px] font-mono px-1.5 py-0.5 rounded inline-block">
                      {exp.technologies}
                    </p>
                  )}
                  <ul className="mt-0.5 text-[12px] text-gray-700 list-disc list-inside">
                    {exp.description?.split("\n").map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-2">
            <h2 className={sectionTitleClass}>Projects</h2>
            <div className="space-y-2">
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-1">
                  <h3 className="font-semibold text-[12px] text-gray-800">{proj.title}</h3>
                  {proj.link && (
                    <a href={proj.link} className="text-blue-600 text-[11px] hover:underline" target="_blank" rel="noopener noreferrer">
                      {proj.linkType || "Link"}
                    </a>
                  )}
                  {proj.technologies && (
                    <p className="bg-gray-100 text-[10px] font-mono px-1.5 py-0.5 rounded inline-block">
                      {proj.technologies}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-700">{proj.description}</p>
                  <div className="flex gap-1 mt-0.5 pt-1 text-[11px]">
                    {proj.github && (
                      <a href={proj.github} className="hover:underline text-blue-600" target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    )}
                    {proj.liveDemo && (
                      <a href={proj.liveDemo} className="hover:underline text-blue-600" target="_blank" rel="noopener noreferrer">
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-2">
            <h2 className={sectionTitleClass}>Education</h2>
            <div className="space-y-1">
              {education.map((edu, idx) => (
                <div key={idx} className="space-y-0.5">
                  <h3 className="font-semibold text-[12px] text-gray-800">{edu.degree}</h3>
                  <p className="italic text-[11px] text-gray-600">
                    {edu.institution} | {formatYearMonth(edu.startDate)} - {formatYearMonth(edu.endDate)}
                  </p>
                  {edu.courses && (
                    <p className="text-[11px]">
                      <strong>Courses:</strong> {edu.courses}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-2">
            <h2 className={sectionTitleClass}>Skills</h2>
            <ul className="text-[11px] text-gray-800 flex flex-wrap gap-1">
              {skills.map((skill, idx) => (
                <li key={idx} className="w-fit">{skill.name}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mb-2">
            <h2 className={sectionTitleClass}>Certifications</h2>
            <div className="space-y-2">
              {certifications.map((cert, idx) => (
                <div key={idx}>
                  {/* Use shared CertificationInfo component for consistent layout */}
                  <div className="mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{cert.title}</h3>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-sm text-gray-600 font-medium flex-1 text-left">{cert.issuer}</p>
                      {cert.year && (
                        <div className={`text-xs font-bold text-white px-3 py-1 rounded-lg`} style={{ backgroundColor: '#6b7280' }}>
                          {cert.year}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages & Interests */}
        {(languages.length > 0 || interests.length > 0) && (
          <section className="mb-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {languages.length > 0 && (
                <div>
                  <h2 className={sectionTitleClass}>Languages</h2>
                  <ul className="flex flex-wrap gap-1 text-[11px] text-gray-700">
                    {languages.map((lang, idx) => (
                      <li key={idx} className="bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {lang.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {interests.length > 0 && interests.some(Boolean) && (
                <div>
                  <h2 className={sectionTitleClass}>Interests</h2>
                  <ul className="flex flex-wrap gap-1 text-[11px] text-gray-700">
                    {interests.filter(Boolean).map((int, idx) => (
                      <li key={idx} className="bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {int}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TemplateTwo;

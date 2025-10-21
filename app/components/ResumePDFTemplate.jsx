// app/components/ResumePDFTemplate.js
// Generate HTML template for PDF Resume

export const generateResumeHTML = (formData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume - ${formData.fullName || 'Resume'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      background: #ffffff;
      color: #2D3748;
      line-height: 1.6;
    }
    
    .container {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      margin: 0 auto;
      background: white;
    }
    
    /* Header Section */
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
    }
    
    .name {
      font-size: 42px;
      font-weight: bold;
      color: #2D3748;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    
    .job-title {
      font-size: 18px;
      color: #4A5568;
      margin-bottom: 15px;
    }
    
    .contact-row {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 15px;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #4A5568;
    }
    
    .icon {
      font-size: 14px;
    }
    
    /* Divider */
    .divider {
      height: 1px;
      background: #CBD5E0;
      margin: 25px 0;
    }
    
    /* Section */
    .section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #2D3748;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 15px;
      border-bottom: 2px solid #2D3748;
      padding-bottom: 5px;
    }
    
    .body-text {
      font-size: 13px;
      color: #4A5568;
      line-height: 1.8;
      text-align: justify;
    }
    
    /* Experience Items */
    .experience-item {
      margin-bottom: 20px;
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    
    .institution {
      font-size: 14px;
      color: #2D3748;
      font-weight: 600;
    }
    
    .year {
      font-size: 13px;
      color: #718096;
      font-style: italic;
    }
    
    .position {
      font-size: 14px;
      font-weight: bold;
      color: #2D3748;
      margin-bottom: 8px;
    }
    
    /* Skills Grid */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 10px;
    }
    
    .skill-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .bullet {
      font-size: 16px;
      color: #2D3748;
      font-weight: bold;
    }
    
    .skill-text {
      font-size: 13px;
      color: #4A5568;
    }
    
    /* Footer */
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 30px;
      background: #4A5568;
    }
    
    /* Print Styles */
    @media print {
      .container {
        margin: 0;
        padding: 15mm;
      }
      
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header Section -->
    <div class="header">
      <h1 class="name">${formData.fullName || 'YOUR NAME'}</h1>
      <p class="job-title">${formData.jobType || 'Professional Title'}</p>
      
      <div class="contact-row">
        ${formData.phone ? `
          <div class="contact-item">
            <span class="icon">📞</span>
            <span>${formData.phone}</span>
          </div>
        ` : ''}
        ${formData.email ? `
          <div class="contact-item">
            <span class="icon">✉</span>
            <span>${formData.email}</span>
          </div>
        ` : ''}
        ${formData.location ? `
          <div class="contact-item">
            <span class="icon">📍</span>
            <span>${formData.location}</span>
          </div>
        ` : ''}
      </div>
    </div>

    <div class="divider"></div>

    <!-- About Me Section -->
    ${formData.summary ? `
      <div class="section">
        <h2 class="section-title">ABOUT ME</h2>
        <p class="body-text">${formData.summary}</p>
      </div>
      <div class="divider"></div>
    ` : ''}

    <!-- Education Section -->
    ${formData.educationLevel ? `
      <div class="section">
        <h2 class="section-title">EDUCATION</h2>
        
        <div class="experience-item">
          <div class="experience-header">
            <span class="institution">${formData.educationLevel}</span>
            <span class="year">2020-2024</span>
          </div>
          <p class="position">Degree Program</p>
          <p class="body-text">
            Completed ${formData.educationLevel} with focus on professional development 
            and practical skills applicable to ${formData.jobType || 'the industry'}.
          </p>
        </div>
      </div>
      <div class="divider"></div>
    ` : ''}

    <!-- Work Experience Section -->
    ${(formData.employer || formData.experience) ? `
      <div class="section">
        <h2 class="section-title">WORK EXPERIENCE</h2>
        
        <div class="experience-item">
          <div class="experience-header">
            <span class="institution">${formData.employer || 'Company Name'}</span>
            <span class="year">${formData.experience ? `${formData.experience} years experience` : '2023 - Present'}</span>
          </div>
          <p class="position">${formData.jobType || 'Position Title'}</p>
          <p class="body-text">
            ${formData.summary || 'Responsible for various professional duties including project management, team collaboration, and delivering high-quality results in a fast-paced environment.'}
          </p>
        </div>

        ${formData.experience && parseInt(formData.experience) > 2 ? `
          <div class="experience-item">
            <div class="experience-header">
              <span class="institution">Previous Company</span>
              <span class="year">2020 - 2023</span>
            </div>
            <p class="position">Junior ${formData.jobType || 'Position'}</p>
            <p class="body-text">
              Gained foundational experience and developed key skills in the field.
              Collaborated with senior team members on various projects.
            </p>
          </div>
        ` : ''}
      </div>
      <div class="divider"></div>
    ` : ''}

    <!-- Skills Section -->
    ${formData.skills && formData.skills.length > 0 ? `
      <div class="section">
        <h2 class="section-title">SKILLS</h2>
        <div class="skills-grid">
          ${formData.skills.map(skill => `
            <div class="skill-item">
              <span class="bullet">•</span>
              <span class="skill-text">${skill}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Footer -->
    <div class="footer"></div>
  </div>
</body>
</html>
  `;
};
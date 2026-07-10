'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, MessageSquare, PlusCircle, LogOut, CheckCircle, 
  AlertTriangle, Code, Layers, Edit, Briefcase, ChevronRight, X, ShieldAlert
} from 'lucide-react';
import styles from './dashboard.module.css';
import { API_BASE_URL } from '@/config';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  content: string;
  createdAt: string;
}

interface ProjectItem {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string;
  category: string;
  githubUrl: string;
  liveUrl: string;
}

interface SkillItem {
  id: number;
  name: string;
  category: string;
  level: number;
}

interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  isIntern: boolean;
  order: number;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'messages' | 'project' | 'skill' | 'experience'>('messages');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit target states
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(null);

  // Form States - Project
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projLongDesc, setProjLongDesc] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projCat, setProjCat] = useState('Go Backend');
  const [projGit, setProjGit] = useState('');
  const [projLive, setProjLive] = useState('');

  // Form States - Skill
  const [skillName, setSkillName] = useState('');
  const [skillCat, setSkillCat] = useState('Languages');
  const [skillLevel, setSkillLevel] = useState(85);

  // Form States - Experience
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expLocation, setExpLocation] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expIsIntern, setExpIsIntern] = useState(false);
  const [expOrder, setExpOrder] = useState(1);

  // Status message
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      window.location.href = '/login';
      return;
    }
    setToken(savedToken);
    
    // Fetch initial datasets
    Promise.all([
      fetchMessages(savedToken),
      fetchProjects(),
      fetchSkills(),
      fetchExperiences()
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  const fetchMessages = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/messages`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.data)) {
          setMessages(data.data);
        } else if (data && Array.isArray(data)) {
          setMessages(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch contact messages', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        } else if (data && Array.isArray(data)) {
          setProjects(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/skills`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.data)) {
          setSkills(data.data);
        } else if (data && Array.isArray(data)) {
          setSkills(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch skills', err);
    }
  };

  const fetchExperiences = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/experience`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.data)) {
          setExperiences(data.data);
        } else if (data && Array.isArray(data)) {
          setExperiences(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch experience list', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const startEditProject = (p: ProjectItem) => {
    setEditingProjectId(p.id);
    setProjTitle(p.title);
    setProjDesc(p.description);
    setProjLongDesc(p.longDescription || '');
    setProjTech(p.technologies || '');
    setProjCat(p.category);
    setProjGit(p.githubUrl || '');
    setProjLive(p.liveUrl || '');
    setStatusMsg({ text: `Editing project: "${p.title}"`, type: 'info' });
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setProjTitle('');
    setProjDesc('');
    setProjLongDesc('');
    setProjTech('');
    setProjCat('Go Backend');
    setProjGit('');
    setProjLive('');
    setStatusMsg({ text: '', type: '' });
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg({ text: '', type: '' });

    const isEdit = editingProjectId !== null;
    const url = isEdit 
      ? `${API_BASE_URL}/api/dashboard/projects/${editingProjectId}`
      : `${API_BASE_URL}/api/dashboard/projects`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: projTitle,
          description: projDesc,
          longDescription: projLongDesc,
          technologies: projTech,
          category: projCat,
          githubUrl: projGit,
          liveUrl: projLive,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Operation failed');
      }

      setStatusMsg({ 
        text: isEdit ? 'Project updated successfully!' : 'Project created successfully!', 
        type: 'success' 
      });

      cancelEditProject();
      fetchProjects();
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Error occurred', type: 'error' });
    }
  };

  const startEditSkill = (s: SkillItem) => {
    setEditingSkillId(s.id);
    setSkillName(s.name);
    setSkillCat(s.category);
    setSkillLevel(s.level);
    setStatusMsg({ text: `Editing skill: "${s.name}"`, type: 'info' });
  };

  const cancelEditSkill = () => {
    setEditingSkillId(null);
    setSkillName('');
    setSkillCat('Languages');
    setSkillLevel(85);
    setStatusMsg({ text: '', type: '' });
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg({ text: '', type: '' });

    const isEdit = editingSkillId !== null;
    const url = isEdit
      ? `${API_BASE_URL}/api/dashboard/skills/${editingSkillId}`
      : `${API_BASE_URL}/api/dashboard/skills`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: skillName,
          category: skillCat,
          level: Number(skillLevel),
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Operation failed');
      }

      setStatusMsg({
        text: isEdit ? 'Skill updated successfully!' : 'Skill created successfully!',
        type: 'success'
      });

      cancelEditSkill();
      fetchSkills();
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Error occurred', type: 'error' });
    }
  };

  const startEditExperience = (e: ExperienceItem) => {
    setEditingExperienceId(e.id);
    setExpTitle(e.title);
    setExpCompany(e.company);
    setExpLocation(e.location || '');
    setExpPeriod(e.period);
    setExpDesc(e.description || '');
    setExpIsIntern(e.isIntern);
    setExpOrder(e.order);
    setStatusMsg({ text: `Editing experience: "${e.title} at ${e.company}"`, type: 'info' });
  };

  const cancelEditExperience = () => {
    setEditingExperienceId(null);
    setExpTitle('');
    setExpCompany('');
    setExpLocation('');
    setExpPeriod('');
    setExpDesc('');
    setExpIsIntern(false);
    setExpOrder(1);
    setStatusMsg({ text: '', type: '' });
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg({ text: '', type: '' });

    const isEdit = editingExperienceId !== null;
    const url = isEdit
      ? `${API_BASE_URL}/api/dashboard/experience/${editingExperienceId}`
      : `${API_BASE_URL}/api/dashboard/experience`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: expTitle,
          company: expCompany,
          location: expLocation,
          period: expPeriod,
          description: expDesc,
          isIntern: expIsIntern,
          order: Number(expOrder),
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Operation failed');
      }

      setStatusMsg({
        text: isEdit ? 'Experience updated successfully!' : 'Experience created successfully!',
        type: 'success'
      });

      cancelEditExperience();
      fetchExperiences();
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Error occurred', type: 'error' });
    }
  };
  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete project');
      }
      setStatusMsg({ text: 'Project deleted successfully!', type: 'success' });
      fetchProjects();
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Error occurred', type: 'error' });
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete skill');
      }
      setStatusMsg({ text: 'Skill deleted successfully!', type: 'success' });
      fetchSkills();
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Error occurred', type: 'error' });
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this experience timeline entry?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/experience/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete experience');
      }
      setStatusMsg({ text: 'Experience deleted successfully!', type: 'success' });
      fetchExperiences();
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Error occurred', type: 'error' });
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete message');
      }
      setStatusMsg({ text: 'Contact message deleted successfully!', type: 'success' });
      fetchMessages(token!);
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Error occurred', type: 'error' });
    }
  };
  const getTagClass = (category: string) => {
    if (category.toLowerCase().includes('go')) return styles.tagCyan;
    if (category.toLowerCase().includes('.net')) return styles.tagBlue;
    return styles.tagPurple;
  };

  if (loading || !token) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-primary)' }}>
        <h3>Loading Admin Panel Dashboard...</h3>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Dark Sidebar Panel */}
      <div className={styles.sidebar}>
        <div className={styles.logoSection}>
          <h1>
            Dnyanesh CMS <span className={styles.logoDot}></span>
          </h1>
        </div>

        <nav className={styles.navGroup}>
          <button
            onClick={() => { setActiveTab('messages'); setStatusMsg({ text: '', type: '' }); }}
            className={`${styles.navItem} ${activeTab === 'messages' ? styles.navActive : ''}`}
          >
            <MessageSquare size={18} /> Inquiries ({messages.length})
          </button>

          <button
            onClick={() => { setActiveTab('project'); setStatusMsg({ text: '', type: '' }); }}
            className={`${styles.navItem} ${activeTab === 'project' ? styles.navActive : ''}`}
          >
            <PlusCircle size={18} /> Projects ({projects.length})
          </button>

          <button
            onClick={() => { setActiveTab('skill'); setStatusMsg({ text: '', type: '' }); }}
            className={`${styles.navItem} ${activeTab === 'skill' ? styles.navActive : ''}`}
          >
            <Code size={18} /> Skills ({skills.length})
          </button>

          <button
            onClick={() => { setActiveTab('experience'); setStatusMsg({ text: '', type: '' }); }}
            className={`${styles.navItem} ${activeTab === 'experience' ? styles.navActive : ''}`}
          >
            <Briefcase size={18} /> Experience ({experiences.length})
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Workspace on Right */}
      <div className={styles.mainContent}>
        {/* Top Control Bar */}
        <div className={styles.topBar}>
          <div className={styles.welcomeText}>
            <h2>Admin Control Center</h2>
            <p>Deploy showcase parameters or review contact inquiries securely</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className={styles.adminBadge}>
              <span className={styles.badgePulse}></span> Administrator Active
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Row Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <h3>{messages.length}</h3>
              <p>Total Inquiries</p>
            </div>
            <div className={styles.statIcon}>
              <MessageSquare size={24} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <h3>{projects.length}</h3>
              <p>Showcase Projects</p>
            </div>
            <div className={styles.statIcon}>
              <Layers size={24} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <h3>{skills.length}</h3>
              <p>Technical Skills</p>
            </div>
            <div className={styles.statIcon}>
              <Code size={24} />
            </div>
          </div>
        </div>

        {/* Status Alerts Banners */}
        {statusMsg.text && (
          <div className={`${styles.statusBanner} ${
            statusMsg.type === 'success' ? styles.statusSuccess :
            statusMsg.type === 'error' ? styles.statusError : styles.statusInfo
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            {statusMsg.text}
          </div>
        )}

        {/* Working Card Container */}
        <div className={styles.contentWorkspace}>
          
          {/* Tab 1: Messages List */}
          {activeTab === 'messages' && (
            <div>
              <h3 className={styles.sectionHeading}>Contact Messages Inquiries</h3>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
                  <MessageSquare size={48} style={{ opacity: 0.25, marginBottom: '1rem' }} />
                  <p>No contact inquiries received yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {messages.map((msg) => (
                    <div key={msg.id} className={styles.messageCard}>
                      <div className={styles.messageHeader}>
                        <div>
                          <span className={styles.senderName}>{msg.name}</span>
                          <span className={styles.senderEmail}>({msg.email})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span className={styles.messageTime}>
                            {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button onClick={() => handleDeleteMessage(msg.id)} className={styles.deleteBtn} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}>
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className={styles.messageSubject}>
                        Subject: {msg.subject || 'No Subject'}
                      </div>
                      <p className={styles.messageContent}>{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Projects Panel */}
          {activeTab === 'project' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
              <form onSubmit={handleProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 className={styles.sectionHeading}>
                  {editingProjectId !== null ? 'Edit Project Details' : 'Add New Showcase Project'}
                </h3>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Project Title *</label>
                    <input
                      type="text"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="e.g. MSME Registration Portal"
                      required
                      className={styles.inputField}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Category *</label>
                    <select
                      value={projCat}
                      onChange={(e) => setProjCat(e.target.value)}
                      className={styles.selectField}
                    >
                      <option value="Go Backend">Go Backend</option>
                      <option value=".NET Backend">.NET Backend</option>
                      <option value="Full Stack">Full Stack</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Short Summary *</label>
                  <input
                    type="text"
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    placeholder="e.g. Developed workflow automation backend utilizing Go (Golang), Gin, and GORM."
                    required
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Detailed Description</label>
                  <textarea
                    value={projLongDesc}
                    onChange={(e) => setProjLongDesc(e.target.value)}
                    placeholder="Provide in-depth implementation details and database patterns"
                    rows={5}
                    className={styles.textareaField}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Technologies (Comma-separated)</label>
                  <input
                    type="text"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                    placeholder="e.g. Go, Gin, GORM, MySQL, AWS S3"
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>GitHub Code Repository URL</label>
                    <input
                      type="url"
                      value={projGit}
                      onChange={(e) => setProjGit(e.target.value)}
                      placeholder="https://github.com/..."
                      className={styles.inputField}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Live Deployment URL</label>
                    <input
                      type="url"
                      value={projLive}
                      onChange={(e) => setProjLive(e.target.value)}
                      placeholder="https://..."
                      className={styles.inputField}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className={styles.submitBtn}>
                    {editingProjectId !== null ? 'Save Changes' : 'Create Project'}
                  </button>

                  {editingProjectId !== null && (
                    <button type="button" onClick={cancelEditProject} className={styles.cancelBtn}>
                      <X size={16} /> Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Projects Table */}
              <div className={styles.tableSection}>
                <h3>Existing Showcase Projects</h3>
                <div className={styles.itemsList}>
                  {projects.map((p) => (
                    <div key={p.id} className={styles.itemRow}>
                      <div className={styles.itemInfo}>
                        <h4>{p.title}</h4>
                        <span>
                          <span className={`${styles.tag} ${getTagClass(p.category)}`}>{p.category}</span>
                          {p.technologies && `• ${p.technologies}`}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => startEditProject(p)} className={styles.editBtn}>
                          <Edit size={14} /> Edit
                        </button>
                        <button onClick={() => handleDeleteProject(p.id)} className={styles.deleteBtn}>
                          <X size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Skills Panel */}
          {activeTab === 'skill' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
              <form onSubmit={handleSkillSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 className={styles.sectionHeading}>
                  {editingSkillId !== null ? 'Edit Skill Details' : 'Add New Skill Parameter'}
                </h3>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Skill Name *</label>
                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="e.g. Kubernetes, Docker, ASP.NET Core"
                    required
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Category *</label>
                    <select
                      value={skillCat}
                      onChange={(e) => setSkillCat(e.target.value)}
                      className={styles.selectField}
                    >
                      <option value="Languages">Languages</option>
                      <option value="Frameworks/Libraries">Frameworks & Libraries</option>
                      <option value="Architecture">Architecture & Design</option>
                      <option value="Tools & Security">Tools & Security</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Expertise Level (0-100) *</label>
                    <input
                      type="number"
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(Number(e.target.value))}
                      min={0}
                      max={100}
                      required
                      className={styles.inputField}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className={styles.submitBtn}>
                    {editingSkillId !== null ? 'Save Changes' : 'Create Skill'}
                  </button>

                  {editingSkillId !== null && (
                    <button type="button" onClick={cancelEditSkill} className={styles.cancelBtn}>
                      <X size={16} /> Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Skills List Table */}
              <div className={styles.tableSection}>
                <h3>Existing Technical Skills</h3>
                <div className={styles.itemsList}>
                  {skills.map((s) => (
                    <div key={s.id} className={styles.itemRow}>
                      <div className={styles.itemInfo}>
                        <h4>{s.name}</h4>
                        <span>{s.category} • Expertise Level: {s.level}%</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => startEditSkill(s)} className={styles.editBtn}>
                          <Edit size={14} /> Edit
                        </button>
                        <button onClick={() => handleDeleteSkill(s.id)} className={styles.deleteBtn}>
                          <X size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Experience Panel */}
          {activeTab === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
              <form onSubmit={handleExperienceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 className={styles.sectionHeading}>
                  {editingExperienceId !== null ? 'Edit Experience Details' : 'Add New Work Experience'}
                </h3>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Job Title *</label>
                    <input
                      type="text"
                      value={expTitle}
                      onChange={(e) => setExpTitle(e.target.value)}
                      placeholder="e.g. Go Developer / Dot Net Intern"
                      required
                      className={styles.inputField}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Company Name *</label>
                    <input
                      type="text"
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      placeholder="e.g. Choice Tech Lab"
                      required
                      className={styles.inputField}
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Location</label>
                    <input
                      type="text"
                      value={expLocation}
                      onChange={(e) => setExpLocation(e.target.value)}
                      placeholder="e.g. Pune, India"
                      className={styles.inputField}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Duration / Period *</label>
                    <input
                      type="text"
                      value={expPeriod}
                      onChange={(e) => setExpPeriod(e.target.value)}
                      placeholder="e.g. Jun 2026 – Present"
                      required
                      className={styles.inputField}
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup} style={{ justifyContent: 'center' }}>
                    <div className={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        id="isIntern"
                        checked={expIsIntern}
                        onChange={(e) => setExpIsIntern(e.target.checked)}
                        className={styles.checkboxInput}
                      />
                      <label htmlFor="isIntern" style={{ cursor: 'pointer', fontWeight: 600 }}>Is Internship Role?</label>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Sorting Order (lower numbers show first)</label>
                    <input
                      type="number"
                      value={expOrder}
                      onChange={(e) => setExpOrder(Number(e.target.value))}
                      required
                      min={1}
                      className={styles.inputField}
                    />
                  </div>
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Description / Key Responsibilities (Newlines split points)</label>
                  <textarea
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    placeholder="Enter achievements. Use newlines to separate bullet points."
                    rows={6}
                    className={styles.textareaField}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className={styles.submitBtn}>
                    {editingExperienceId !== null ? 'Save Changes' : 'Create Experience'}
                  </button>

                  {editingExperienceId !== null && (
                    <button type="button" onClick={cancelEditExperience} className={styles.cancelBtn}>
                      <X size={16} /> Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Experience timeline entries */}
              <div className={styles.tableSection}>
                <h3>Existing Work History Timeline</h3>
                <div className={styles.itemsList}>
                  {experiences.map((exp) => (
                    <div key={exp.id} className={styles.itemRow}>
                      <div className={styles.itemInfo}>
                        <h4>{exp.title} at {exp.company}</h4>
                        <span>
                          {exp.period} • Order: {exp.order}
                          {exp.isIntern && <span className={`${styles.tag} ${styles.tagPurple}`}>Internship</span>}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => startEditExperience(exp)} className={styles.editBtn}>
                          <Edit size={14} /> Edit
                        </button>
                        <button onClick={() => handleDeleteExperience(exp.id)} className={styles.deleteBtn}>
                          <X size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

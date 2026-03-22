import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { Project } from './types';
import { Plus, Trash2, CheckCircle, Clock, List } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', url: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      return;
    }

    const projectsRef = collection(db, 'users', user.uid, 'projects');
    const q = query(projectsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectList: Project[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Project));
      setProjects(projectList);
    });

    return unsubscribe;
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newProject.title) return;

    await addDoc(collection(db, 'users', user.uid, 'projects'), {
      ...newProject,
      status: 'planned',
      createdAt: new Date().toISOString(),
    });
    setNewProject({ title: '', description: '', url: '' });
  };

  const updateStatus = async (id: string, status: Project['status']) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'projects', id), { status });
  };

  const deleteProject = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'projects', id));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <button onClick={handleSignIn} className="bg-black text-white px-6 py-3 rounded-xl font-medium">
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">DevTrack</h1>
        <button onClick={handleSignOut} className="text-stone-600 hover:text-black">Sign Out</button>
      </header>

      <form onSubmit={addProject} className="bg-white p-6 rounded-2xl shadow-sm mb-8">
        <input
          type="text"
          placeholder="Project Title"
          value={newProject.title}
          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
          className="w-full p-3 mb-4 border rounded-xl"
        />
        <textarea
          placeholder="Description"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          className="w-full p-3 mb-4 border rounded-xl"
        />
        <input
          type="text"
          placeholder="URL"
          value={newProject.url}
          onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
          className="w-full p-3 mb-4 border rounded-xl"
        />
        <button type="submit" className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2">
          <Plus size={20} /> Add Project
        </button>
      </form>

      <div className="grid gap-4">
        {projects.map((project) => (
          <motion.div key={project.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-2xl shadow-sm flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="text-stone-600">{project.description}</p>
              <a href={project.url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">{project.url}</a>
            </div>
            <div className="flex gap-2">
              <button onClick={() => updateStatus(project.id, 'planned')} className={`p-2 rounded-full ${project.status === 'planned' ? 'bg-stone-200' : ''}`}><List size={20} /></button>
              <button onClick={() => updateStatus(project.id, 'in-progress')} className={`p-2 rounded-full ${project.status === 'in-progress' ? 'bg-stone-200' : ''}`}><Clock size={20} /></button>
              <button onClick={() => updateStatus(project.id, 'completed')} className={`p-2 rounded-full ${project.status === 'completed' ? 'bg-stone-200' : ''}`}><CheckCircle size={20} /></button>
              <button onClick={() => deleteProject(project.id)} className="p-2 text-red-500"><Trash2 size={20} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const modules = [
  { title: "Basic\nCoding", description: "Let's learn the basics of Python.", color: "bg-red-800", textColor: "text-black", href: "/workspace/basic-coding" },
  { title: "AI\nCoding", description: "Unlock ML & AI.", color: "bg-purple-700", textColor: "text-white", href: "/workspace/ai-coding" },
  { title: "Tinker Orbits\nCoding", description: "Explore technology.", color: "bg-amber-800", textColor: "text-white", href: "/workspace/tinker-orbits" },
  { title: "STEMBOT\nCoding", description: "NLP & ML.", color: "bg-blue-600", textColor: "text-white", href: "/workspace/stembot" },
  { title: "STEM\nLIGHT", description: "STEM concepts.", color: "bg-indigo-900", textColor: "text-white", href: "/workspace/stem-light" },
  { title: "MIT APP\nInventor", description: "Create apps.", color: "bg-red-700", textColor: "text-white", href: "/workspace/mit-app" },
  { title: "Blockly\nGames", description: "Learn with games.", color: "bg-violet-600", textColor: "text-white", href: "/workspace/blockly-games" },
  { title: "Jupyter\nNotebook", description: "Data science.", color: "bg-orange-600", textColor: "text-white", href: "/workspace/jupyter" },
];

export default function DashboardPage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);

  /* ---------- LOAD PROJECTS ---------- */
  const loadProjects = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setProjects([]);
      return;
    }

    try {
      const res = await fetch(`/api/project/list?userId=${userId}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.error("Expected array, got:", data);
        setProjects([]);
      }
    } catch (err) {
      console.error("Load projects failed", err);
      setProjects([]);
    }
  };

  /* ---------- AUTH ---------- */
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) router.push("/login");
    else {
      setUserEmail(email);
      loadProjects();
    }
  }, []);

  /* ---------- CREATE PROJECT ---------- */
  const createProjectAndRedirect = async () => {
    const userId = localStorage.getItem("userId");

    if (!projectName.trim()) {
      alert("Project name required");
      return;
    }

    const res = await fetch("/api/project/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectName, userId }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Create project failed:", data);
      alert(data.message || "Failed to create project");
      return;
    }

    // ✅ success
    setShowModal(false);
    setProjectName("");
    setIsCreatingNewProject(false);

    router.push(`${selectedModule.href}?projectId=${data.projectId}`);
  };

  /* ---------- SELECT PROJECT ---------- */
  const openProject = (projectId: number) => {
    setShowModal(false);
    router.push(`${selectedModule.href}?projectId=${projectId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-950 to-blue-900 text-white px-6 py-4 flex justify-between">
        <h1 className="text-2xl font-light">
          AI Connect | <span className="font-normal">User Dashboard</span>
        </h1>
        <div className="text-sm flex items-center gap-2">
          {userEmail} <ChevronRight className="w-4 h-4" />
        </div>
      </header>

      {/* Modules */}
      <main className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {modules.map((module, index) => (
            <div
              key={index}
              className={`${module.color} ${module.textColor} rounded-2xl p-8 flex flex-col justify-between min-h-[320px] shadow-lg`}
            >
              <div>
                <h3 className="text-3xl font-light mb-4 whitespace-pre-line">
                  {module.title}
                </h3>
                <p>{module.description}</p>
              </div>

              <Button
                variant="outline"
                className="border-white text-white mt-6"
                onClick={() => {
                  setSelectedModule(module);
                  setIsCreatingNewProject(false); // 👈 reset UI mode
                  setShowModal(true);
                }}
              >
                Create <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-medium mb-4">
              {projects.length === 0 ? "Create Project" : "Select Project"}
            </h3>

            {/* IF NO PROJECTS */}
            {/* CREATE MODE */}
            {projects.length === 0 || isCreatingNewProject ? (
              <>
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Project Name"
                  className="w-full border px-3 py-2 rounded mb-4"
                />
                <Button
                  onClick={createProjectAndRedirect}
                  className="w-full"
                  disabled={!projectName.trim()}
                >
                  Create & Continue
                </Button>
              </>
            ) : (
              <>
                {projects.map((p) => (
                  <div
                    key={p.ProjectId}
                    className="border rounded p-3 mb-2 cursor-pointer hover:bg-gray-50"
                    onClick={() => openProject(p.ProjectId)}
                  >
                    {p.projectname}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => setIsCreatingNewProject(true)}
                >
                  + Create New Project
                </Button>
              </>
            )}

          </div>
        </div>
      )}
      {/* PROJECT LIST */}
<div className="max-w-7xl mx-auto mt-20">
  <h2 className="text-3xl font-light mb-6">
    Your Projects
  </h2>

  {projects.length === 0 ? (
    <div className="text-gray-500 text-lg">
      No projects created yet.
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.projectid ?? project.ProjectId}
          className="border rounded-xl p-5 shadow-sm hover:shadow-md cursor-pointer transition"
          onClick={() =>
            router.push(
              `/workspace/basic-coding?projectId=${
                project.projectid ?? project.ProjectId
              }`
            )
          }
        >
          <h3 className="text-xl font-medium mb-2">
            {project.projectname ?? project.ProjectName}
          </h3>

          <p className="text-sm text-gray-500">
            Created on{" "}
            {new Date(
              project.createdon ?? project.CreatedOn
            ).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )}
</div>

    </div>
  );
}

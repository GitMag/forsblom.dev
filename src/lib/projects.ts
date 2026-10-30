// Helpers over the projects collection, shared by the pages.
import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

/** Every project that is not hidden, in the order given by `order` in the front matter. */
export async function listProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", (p) => !p.data.hidden);
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export function projectUrl(project: Project): string {
  return `/projects/${project.id}/`;
}

/** The projects whose stack lists this skill (case-insensitive), for the links on the CV page. */
export function projectsUsing(skill: string, projects: Project[]): Project[] {
  const wanted = skill.toLowerCase();
  return projects.filter((p) => p.data.stack.some((item) => item.toLowerCase() === wanted));
}

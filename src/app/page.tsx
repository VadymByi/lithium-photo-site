import { prisma } from './../lib/prisma';

export default async function Home() {
  const projects = await prisma.project.findMany();

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Projects list</h1>
      {projects.length === 0 ? (
        <p>No any projects in the base</p>
      ) : (
        <pre>{JSON.stringify(projects, null, 2)}</pre>
      )}
    </main>
  );
}

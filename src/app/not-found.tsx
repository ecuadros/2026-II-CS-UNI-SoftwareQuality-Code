import Link from "next/link"

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-8 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Página no encontrada</h1>
      <p className="mt-4 text-zinc-600">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        className="mt-6 font-medium text-blue-600 underline-offset-4 hover:underline"
        href="/"
      >
        &larr; Volver al inicio
      </Link>
    </main>
  )
}

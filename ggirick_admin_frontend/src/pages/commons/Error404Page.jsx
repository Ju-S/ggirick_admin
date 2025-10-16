import { useNavigate } from "react-router-dom";

export default function Error404Page() {
  const navigate = useNavigate();

  return (
    <main className="h-screen p-4 pt-20 md:ml-64">
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="text-primary-600 dark:text-primary-500 mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
            페이지를 찾을 수 없습니다.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            불편을 드려 죄송합니다. 홈페이지로 돌아가 다시 시도해 주십시오.
          </p>
          <button
            type="button"
            onClick={() => navigate("/ggirick_wireframe")}
            className="w-40 text-center border border-gray-300 rounded-lg px-4 py-2 text-base font-medium text-gray-900 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            홈페이지로
          </button>
        </div>
      </div>
    </section>
    </main>
  );
}

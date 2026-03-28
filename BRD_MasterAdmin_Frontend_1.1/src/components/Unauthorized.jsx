import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <ShieldExclamationIcon className="h-7 w-7 text-red-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-900">
            Access Denied
          </h1>

          {/* Description */}
          <p className="mt-2 text-sm text-gray-600">
            You don’t have the required permissions to view this page.
            If you believe this is a mistake, please contact your administrator.
          </p>

          {/* Actions */}
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Go Back
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

import RiskBadge from "../ui/RiskBadge";
import { Link } from "react-router-dom";

export default function CasesTable({ data }) {
  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-gray-600 text-sm border-b">
              <th className="py-4 px-4 font-medium">Case ID</th>
              <th className="py-4 px-4 font-medium">Applicant</th>
              <th className="py-4 px-4 font-medium">Fraud Score</th>
              <th className="py-4 px-4 font-medium">AML</th>
              <th className="py-4 px-4 font-medium">Synthetic ID</th>
              <th className="py-4 px-4 font-medium">Updated</th>
              <th className="py-4 px-4 font-medium"></th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 text-sm font-medium">{item.id}</td>
                <td className="py-4 px-4 text-sm">{item.name}</td>

                <td className="py-4 px-4">
                  <RiskBadge score={item.fraudScore} />
                </td>

                <td className="py-4 px-4 text-sm">
                  {item.aml === "HIT" ? (
                    <span className="text-red-600 font-semibold">Sanction Hit</span>
                  ) : (
                    <span className="text-green-600">Clear</span>
                  )}
                </td>

                <td className="py-4 px-4 text-sm">
                  {item.synthetic === "SUSPECT" ? (
                    <span className="text-red-600 font-semibold">Suspect</span>
                  ) : (
                    <span className="text-green-600">Clean</span>
                  )}
                </td>

                <td className="py-4 px-4 text-sm text-gray-500">{item.updated}</td>

                <td className="py-4 px-4 text-sm">
                  <Link
                    to={`/cases/${item.id}`}
                    className="text-primary-blue font-medium hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
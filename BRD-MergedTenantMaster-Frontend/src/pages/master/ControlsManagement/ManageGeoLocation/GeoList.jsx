import React, { useEffect, useState } from "react";

export default function GeoList({ entity, onAdd, onEdit }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    // Fetch data dynamically based on entity
    // Replace this with your API calls
    setList([
      { id: 1, name: `${entity} 1` },
      { id: 2, name: `${entity} 2` },
    ]);
  }, [entity]);

  return (
    <div>
      <h2>{entity} List</h2>
      <button onClick={onAdd} style={{ marginBottom: "10px", padding: "8px 12px" }}>
        Add {entity}
      </button>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>{entity} Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>
                <button onClick={() => onEdit(item)} style={{ marginRight: "5px" }}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

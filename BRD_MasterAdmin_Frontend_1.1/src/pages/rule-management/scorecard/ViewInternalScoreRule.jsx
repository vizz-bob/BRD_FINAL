import React,{useEffect,useState} from "react";
import MainLayout from "../../../layout/MainLayout";
import {FiArrowLeft,FiEdit3} from "react-icons/fi";
import {useNavigate,useParams} from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

export default function ViewInternalScoreRule(){
  const navigate=useNavigate();
  const {id}=useParams();
  const [rule,setRule]=useState(null);

  useEffect(()=>{
    (async()=>{
      const res = await ruleManagementService.getInternalScoreRule(id);
      setRule(res);
    })();
  },[id]);

  if(!rule) return null;

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button onClick={()=>navigate(-1)} className="p-2 rounded-xl bg-gray-50"><FiArrowLeft/></button>
          <h1 className="text-2xl font-bold">View Internal Score Rule</h1>
        </div>
        <button onClick={()=>navigate(`/rule-management/scorecard/internal/edit/${id}`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-2">
          <FiEdit3/> Edit
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8 max-w-4xl space-y-6">
        <Info label="Parameter" value={rule.parameter}/>
        <Info label="Minimum Value" value={rule.min_value}/>
        <Info label="Weight (%)" value={rule.weight}/>
        <Info label="Risk Level" value={rule.risk_level}/>
        <Info label="Remarks" value={rule.remarks || "-"}/>

        <div>
          <label className="text-sm font-medium">Status</label>
          <div className="mt-2">
            <span className={`px-3 py-1 text-xs rounded-full ${
              rule.status==="ACTIVE"?"bg-green-100 text-green-700":"bg-red-100 text-red-600"
            }`}>
              {rule.status}
            </span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const Info=({label,value})=>(
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <p className="mt-1 text-sm text-gray-900">{value}</p>
  </div>
);

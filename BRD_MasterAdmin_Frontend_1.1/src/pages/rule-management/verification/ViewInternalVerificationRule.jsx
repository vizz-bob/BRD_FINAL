import React,{useEffect,useState} from "react";
import MainLayout from "../../../layout/MainLayout";
import {FiArrowLeft,FiEdit3} from "react-icons/fi";
import {useNavigate,useParams} from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

export default function ViewInternalVerificationRule(){
  const navigate=useNavigate();
  const {id}=useParams();
  const [rule,setRule]=useState(null);

  useEffect(()=>{
    (async()=>{
      const res = await ruleManagementService.getInternalVerificationRule(id);
      setRule(res);
    })();
  },[id]);

  if(!rule) return null;

  return(
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={()=>navigate(-1)} className="p-2 rounded-xl bg-gray-50"><FiArrowLeft/></button>
          <h1 className="text-2xl font-bold">View Internal Verification Rule</h1>
        </div>

        <button onClick={()=>navigate(`/rule-management/verification/internal/edit/${id}`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-2">
          <FiEdit3/> Edit
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <Detail label="Verification Type" value={rule.verification_type}/>
        <Detail label="Criteria" value={rule.criteria}/>
        <Detail label="Remarks" value={rule.remarks || "-"}/>

        <div>
          <p className="text-gray-500">Status</p>
          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${
            rule.status==="ACTIVE"?"bg-green-100 text-green-700":"bg-red-100 text-red-600"
          }`}>
            {rule.status}
          </span>
        </div>
      </div>
    </MainLayout>
  );
}

const Detail=({label,value})=>(
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium mt-1">{value}</p>
  </div>
);

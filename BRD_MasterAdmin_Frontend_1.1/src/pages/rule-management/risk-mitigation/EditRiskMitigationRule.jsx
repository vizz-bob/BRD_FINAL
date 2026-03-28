import React,{useEffect,useState} from "react";
import MainLayout from "../../../layout/MainLayout";
import {FiArrowLeft,FiSave} from "react-icons/fi";
import {useNavigate,useParams} from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

const SEVERITY=["low","medium","high"];
const STATUS=["ACTIVE","INACTIVE"];

export default function EditRiskMitigationRule(){
  const navigate=useNavigate();
  const {id}=useParams();
  const [form,setForm]=useState({
    risk_parameter:"",
    mitigation_action:"",
    severity:"",
    status:"ACTIVE",
    remarks:""
  });

  useEffect(()=>{
    (async()=>{
      const res = await ruleManagementService.getRiskMitigationRule(id);
      setForm({
        risk_parameter: res.risk_parameter,
        mitigation_action: res.mitigation_action,
        severity: res.severity,
        status: res.status,
        remarks: res.remarks || ""
      });
    })();
  },[id]);

  const handleChange=e=>{
    const {name,value}=e.target;
    setForm(p=>({...p,[name]:value}));
  };

  const handleSubmit=async e=>{
    e.preventDefault();

    await ruleManagementService.updateRiskMitigationRule(id,{
      risk_parameter: String(form.risk_parameter),
      mitigation_action: String(form.mitigation_action),
      severity: String(form.severity),
      status: String(form.status),
      remarks: String(form.remarks || "")
    });

    navigate("/rule-management/risk-mitigation");
  };

  return(
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={()=>navigate(-1)} className="p-2 rounded-xl bg-gray-50"><FiArrowLeft/></button>
        <h1 className="text-2xl font-bold">Edit Risk Mitigation Rule</h1>
      </div>

      <form onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">

        <Input label="Risk Parameter" name="risk_parameter" value={form.risk_parameter} onChange={handleChange} required/>
        <Input label="Mitigation Action" name="mitigation_action" value={form.mitigation_action} onChange={handleChange} required/>

        <Select label="Severity" name="severity" value={form.severity}
          onChange={handleChange} options={SEVERITY} required/>

        <Select label="Status" name="status" value={form.status}
          onChange={handleChange} options={STATUS}/>

        <Textarea label="Remarks" name="remarks" value={form.remarks} onChange={handleChange}
          className="md:col-span-2"/>

        <div className="md:col-span-2 flex justify-end">
          <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2">
            <FiSave/> Update Rule
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* UI Components */
const Input=({label,...props})=>(
  <div><label className="text-sm font-medium">{label}</label>
    <input {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border text-sm"/></div>
);

const Select=({label,options,...props})=>(
  <div><label className="text-sm font-medium">{label}</label>
    <select {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border text-sm">
      <option value="">Select</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Textarea=({label,...props})=>(
  <div><label className="text-sm font-medium">{label}</label>
    <textarea {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border text-sm"/></div>
);

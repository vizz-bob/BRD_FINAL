import React,{useEffect,useState} from "react";
import MainLayout from "../../../layout/MainLayout";
import {FiArrowLeft,FiSave} from "react-icons/fi";
import {useNavigate,useParams} from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

const AGENCY_TYPES=["Field Verification Agency","Legal Agency","Technical Agency"];
const VERIFICATION_STAGES=["Pre Sanction","Post Sanction","Disbursement"];
const STATUS=["ACTIVE","INACTIVE"];

export default function EditAgencyVerificationRule(){
  const navigate=useNavigate();
  const {id}=useParams();

  const [form,setForm]=useState(null);

  useEffect(()=>{
    (async()=>{
      const res = await ruleManagementService.getAgencyVerificationRuleById(id);
      setForm({
        agency_type: res.agency_type,
        verification_stage: res.verification_stage,
        report_type: res.report_type,
        turnaround_time: String(res.turnaround_time),
        status: res.status,
        remarks: res.remarks || ""
      });
    })();
  },[id]);

  if(!form) return null;

  const handleChange=e=>{
    const {name,value}=e.target;
    setForm(p=>({...p,[name]:value}));
  };

  const handleSubmit=async e=>{
    e.preventDefault();
    await ruleManagementService.updateAgencyVerificationRule(id,{
      agency_type: form.agency_type,
      verification_stage: form.verification_stage,
      report_type: form.report_type,
      turnaround_time: parseInt(form.turnaround_time),
      status: form.status,
      remarks: form.remarks || ""
    });
    navigate("/rule-management/verification/agency");
  };

  return(
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={()=>navigate(-1)} className="p-2 rounded-xl bg-gray-50"><FiArrowLeft/></button>
        <h1 className="text-2xl font-bold">Edit Agency Verification Rule</h1>
      </div>

      <form onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        <Select label="Agency Type" name="agency_type" value={form.agency_type} onChange={handleChange} options={AGENCY_TYPES} required/>
        <Select label="Verification Stage" name="verification_stage" value={form.verification_stage} onChange={handleChange} options={VERIFICATION_STAGES} required/>

        <Input label="Report Type" name="report_type" value={form.report_type} onChange={handleChange} required/>
        <Input label="Turnaround Time (hrs)" name="turnaround_time" type="number" value={form.turnaround_time} onChange={handleChange} required/>

        <Select label="Status" name="status" value={form.status} onChange={handleChange} options={STATUS}/>
        <Textarea label="Remarks" name="remarks" value={form.remarks} onChange={handleChange} className="md:col-span-2"/>

        <div className="md:col-span-2 flex justify-end">
          <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2">
            <FiSave/> Update Rule
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* UI */
const Input=({label,...props})=>(
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl outline-none text-sm"/>
  </div>
);
const Select=({label,options,...props})=>(
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl outline-none text-sm">
      <option value="">Select</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);
const Textarea=({label,...props})=>(
  <div>
    <label className="text-sm font-medium">{label}</label>
    <textarea {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl outline-none text-sm"/>
  </div>
);

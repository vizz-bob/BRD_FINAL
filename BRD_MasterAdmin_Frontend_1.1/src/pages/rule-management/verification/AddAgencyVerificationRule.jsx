import React,{useState} from "react";
import MainLayout from "../../../layout/MainLayout";
import {FiArrowLeft,FiSave} from "react-icons/fi";
import {useNavigate} from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

const STATUS=["ACTIVE","INACTIVE"];

export default function AddAgencyVerificationRule(){
  const navigate = useNavigate();
  const [form,setForm] = useState({
    agency_type:"",
    verification_stage:"",
    report_type:"",
    turnaround_time:"",
    status:"ACTIVE",
    remarks:""
  });

  const handleChange = e =>{
    const {name,value} = e.target;
    setForm(p=>({...p,[name]:value}));
  };

  const handleSubmit = async e =>{
    e.preventDefault();

    await ruleManagementService.createAgencyVerificationRule({
      agency_type: String(form.agency_type),
      verification_stage: String(form.verification_stage),
      report_type: String(form.report_type),
      turnaround_time: Number(form.turnaround_time),
      status: String(form.status),
      remarks: String(form.remarks || "")
    });

    navigate("/rule-management/verification/agency");
  };

  return(
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={()=>navigate(-1)} className="p-2 rounded-xl bg-gray-50"><FiArrowLeft/></button>
        <h1 className="text-2xl font-bold">Add Agency Verification Rule</h1>
      </div>

      <form onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        <Input label="Agency Type" name="agency_type" value={form.agency_type} onChange={handleChange} required/>
        <Input label="Verification Stage" name="verification_stage" value={form.verification_stage} onChange={handleChange} required/>

        <Input label="Report Type" name="report_type" value={form.report_type} onChange={handleChange} required/>
        <Input label="Turnaround Time (hrs)" name="turnaround_time" type="number"
          value={form.turnaround_time} onChange={handleChange} required/>

        <Select label="Status" name="status" value={form.status} onChange={handleChange} options={STATUS}/>
        <Textarea label="Remarks" name="remarks" value={form.remarks} onChange={handleChange} className="md:col-span-2"/>

        <div className="md:col-span-2 flex justify-end">
          <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2">
            <FiSave/> Save Rule
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

import React,{useState} from "react";
import MainLayout from "../../../layout/MainLayout";
import {FiArrowLeft,FiSave} from "react-icons/fi";
import {useNavigate} from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

const STATUS = ["ACTIVE","INACTIVE"];

export default function AddInternalVerificationRule(){
  const navigate = useNavigate();
  const [form,setForm] = useState({
    verification_type:"",
    criteria:"",
    status:"ACTIVE"
  });

  const handleChange = e => {
    const {name,value} = e.target;
    setForm(p=>({...p,[name]:value}));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    await ruleManagementService.createInternalVerificationRule({
      verification_type: String(form.verification_type),
      criteria: String(form.criteria),
      status: String(form.status)
    });

    navigate("/rule-management/verification/internal");
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={()=>navigate(-1)} className="p-2 rounded-xl bg-gray-50">
          <FiArrowLeft/>
        </button>
        <h1 className="text-2xl font-bold">Add Internal Verification Rule</h1>
      </div>

      <form onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        <Input label="Verification Type" name="verification_type"
          value={form.verification_type} onChange={handleChange} required/>

        <Select label="Status" name="status"
          value={form.status} onChange={handleChange} options={STATUS}/>

        <Textarea label="Verification Criteria" name="criteria"
          value={form.criteria} onChange={handleChange}
          className="md:col-span-2" required/>

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
const Input = ({label,...props})=>(
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border text-sm"/>
  </div>
);

const Select = ({label,options,...props})=>(
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border text-sm">
      <option value="">Select</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Textarea = ({label,...props})=>(
  <div>
    <label className="text-sm font-medium">{label}</label>
    <textarea {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border text-sm"/>
  </div>
);

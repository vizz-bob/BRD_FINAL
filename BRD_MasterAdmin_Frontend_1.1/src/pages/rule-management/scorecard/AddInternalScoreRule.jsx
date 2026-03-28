import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

const PARAMETERS = ["Bank Balance","Employment Stability","Residence Stability","Credit Vintage"];
const RISK_LEVELS = ["low","medium","high"];
const STATUS = ["ACTIVE","INACTIVE"];

export default function AddInternalScoreRule() {
  const navigate = useNavigate();

  const [form,setForm]=useState({
    parameter:"",
    min_value:"",
    weight:"",
    risk_level:"",
    status:"ACTIVE"
  });

  const handleChange=e=>{
    const {name,value}=e.target;
    setForm(p=>({...p,[name]:value}));
  };

const handleSubmit = async e => {
  e.preventDefault();

  const payload = {
    parameter: String(form.parameter),
    min_value: Number(form.min_value),
    weight: Number(form.weight),
    risk_level: String(form.risk_level),
    status: String(form.status)
  };

  await ruleManagementService.createInternalScoreRule(payload);
  navigate("/rule-management/scorecard/internal");
};



  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={()=>navigate(-1)} className="p-2 rounded-xl bg-gray-50">
          <FiArrowLeft/>
        </button>
        <h1 className="text-2xl font-bold">Add Internal Score Rule</h1>
      </div>

      <form onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">

        <Select label="Parameter" name="parameter" value={form.parameter}
          onChange={handleChange} options={PARAMETERS} required/>

        <Input label="Minimum Value" name="min_value" type="number"
          value={form.min_value} onChange={handleChange} required/>

        <Input label="Weight (%)" name="weight" type="number"
          value={form.weight} onChange={handleChange} required/>

        <Select label="Risk Level" name="risk_level" value={form.risk_level}
          onChange={handleChange} options={RISK_LEVELS} required/>

        <Select label="Status" name="status" value={form.status}
          onChange={handleChange} options={STATUS}/>

        <div className="md:col-span-2 flex justify-end">
          <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2">
            <FiSave/> Save Rule
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* UI Components */
const Input=({label,...props})=>(
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border text-sm"/>
  </div>
);

const Select=({label,options,...props})=>(
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border text-sm">
      <option value="">Select</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

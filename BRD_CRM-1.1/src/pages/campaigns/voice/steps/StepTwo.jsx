import React from 'react';
import { Upload, Mic, Volume2, FileText, Play } from 'lucide-react';

const StepTwo = ({ formData, setFormData, errors }) => {
  const handleChange = (field, value) => setFormData({ ...formData, [field]: value });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleChange('voiceSource', 'upload')}
          className={`p-4 border-2 rounded-xl text-left transition-all ${formData.voiceSource === 'upload' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100'}`}
        >
          <Upload className="w-6 h-6 text-indigo-600 mb-2" />
          <p className="font-bold text-gray-900">Upload MP3/WAV</p>
          <p className="text-xs text-gray-500">Use your own pre-recorded professional voiceover</p>
        </button>

        <button
          onClick={() => handleChange('voiceSource', 'tts')}
          className={`p-4 border-2 rounded-xl text-left transition-all ${formData.voiceSource === 'tts' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100'}`}
        >
          <FileText className="w-6 h-6 text-indigo-600 mb-2" />
          <p className="font-bold text-gray-900">Text-to-Speech</p>
          <p className="text-xs text-gray-500">Convert text script into a natural-sounding AI voice</p>
        </button>
      </div>

      {formData.voiceSource === 'upload' ? (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">
          <Volume2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Drag your audio file here or click to browse</p>
          <input 
            type="file" 
            accept="audio/*" 
            onChange={(e) => handleChange('audioFile', e.target.files[0])}
            className="mt-4 text-sm file:bg-indigo-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg"
          />
          {errors.audioFile && <p className="text-red-500 text-sm mt-2">{errors.audioFile}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={formData.ttsText || ''}
            onChange={(e) => handleChange('ttsText', e.target.value)}
            className="w-full p-4 border rounded-xl h-40 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Type your script here... e.g. Hello {{firstName}}, this is a reminder from..."
          />
          <div className="flex items-center gap-4">
            <select className="px-4 py-2 border rounded-lg text-s bg-white">
              <option>English (US) - Male</option>
              <option>English (US) - Female</option>
              <option>Hindi - Male</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">
              <Play className="w-4 h-4" /> Preview Audio
            </button>
          </div>
          {errors.ttsText && <p className="text-red-500 text-s">{errors.ttsText}</p>}
        </div>
      )}
    </div>
  );
};

export default StepTwo;
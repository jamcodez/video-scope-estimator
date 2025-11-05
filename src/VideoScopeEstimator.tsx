import { useState, useMemo } from 'react';
import { Calculator, Clock, Calendar } from 'lucide-react';

// Define types for better TypeScript support
type ProjectType = 'lecture' | 'editorial';
type LiftLevel = 'light' | 'medium' | 'heavy';

type QuotientMap = {
  [K in ProjectType]: {
    [L in LiftLevel]: number;
  };
};

const VideoScopeEstimator = () => {
  const [projectType, setProjectType] = useState<ProjectType>('lecture');
  const [finishedMinutes, setFinishedMinutes] = useState(40);
  const [editingLift, setEditingLift] = useState<LiftLevel>('medium');
  const [finishingLift, setFinishingLift] = useState<LiftLevel>('medium');
  const [hoursPerDay, setHoursPerDay] = useState(5);
  const [bufferPercent, setBufferPercent] = useState(10);

  // Quotient definitions by project type
  const editingQuotients: QuotientMap = {
    lecture: {
      light: 5.5,
      medium: 8,
      heavy: 12.5
    },
    editorial: {
      light: 11,
      medium: 14,
      heavy: 21.5
    }
  };

  const finishingQuotients: QuotientMap = {
    lecture: {
      light: 1.5,
      medium: 2.5,
      heavy: 3.5
    },
    editorial: {
      light: 2.5,
      medium: 3.5,
      heavy: 4.5
    }
  };

  // Calculate results
  const results = useMemo(() => {
    const editingQ = editingQuotients[projectType][editingLift];
    const finishingQ = finishingQuotients[projectType][finishingLift];
    
    const totalMinutes = finishedMinutes * (editingQ + finishingQ);
    const totalHours = totalMinutes / 60;
    const totalHoursWithBuffer = totalHours * (1 + bufferPercent / 100);
    const estimatedDays = Math.ceil(totalHoursWithBuffer / hoursPerDay);
    
    return {
      totalMinutes,
      totalHours,
      totalHoursWithBuffer,
      estimatedDays,
      editingTime: (finishedMinutes * editingQ) / 60,
      finishingTime: (finishedMinutes * finishingQ) / 60,
      editingQ,
      finishingQ
    };
  }, [finishedMinutes, editingLift, finishingLift, hoursPerDay, bufferPercent, projectType]);

  const getLiftColor = (lift: LiftLevel): string => {
    const colors: Record<LiftLevel, string> = {
      light: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      heavy: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[lift];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-slate-800">Video Editing Scope Estimator</h1>
          </div>
          <p className="text-slate-600">Calculate post-production time and calendar duration</p>
        </div>

        {/* Project Type Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Project Type</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setProjectType('lecture')}
              className={`p-4 rounded-lg border-2 transition-all ${
                projectType === 'lecture'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="font-semibold text-lg mb-1">Lecture / Traditional</div>
              <div className="text-sm opacity-80">
                Structured delivery, predictable pacing, slide integration
              </div>
            </button>
            <button
              onClick={() => setProjectType('editorial')}
              className={`p-4 rounded-lg border-2 transition-all ${
                projectType === 'editorial'
                  ? 'bg-purple-50 border-purple-500 text-purple-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="font-semibold text-lg mb-1">Editorial / Creative</div>
              <div className="text-sm opacity-80">
                Story-driven, MOS, roundtables, high editorial lift
              </div>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Project Parameters</h2>
            
            {/* Finished Minutes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Finished Video Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={finishedMinutes}
                onChange={(e) => setFinishedMinutes(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Editing Lift */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Editorial Lift Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'medium', 'heavy'] as LiftLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setEditingLift(level)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium capitalize transition-all ${
                      editingLift === level
                        ? getLiftColor(level) + ' border-current'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Light: {editingQuotients[projectType].light} min/min • Medium: {editingQuotients[projectType].medium} min/min • Heavy: {editingQuotients[projectType].heavy} min/min
              </p>
            </div>

            {/* Finishing Lift */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Finishing Complexity (Color/Audio)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'medium', 'heavy'] as LiftLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setFinishingLift(level)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium capitalize transition-all ${
                      finishingLift === level
                        ? getLiftColor(level) + ' border-current'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Light: {finishingQuotients[projectType].light} min/min • Medium: {finishingQuotients[projectType].medium} min/min • Heavy: {finishingQuotients[projectType].heavy} min/min
              </p>
            </div>

            {/* Hours Per Day */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Available Hours Per Day
              </label>
              <input
                type="number"
                min="1"
                max="12"
                step="0.5"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Buffer Percentage */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contingency Buffer: {bufferPercent}%
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={bufferPercent}
                onChange={(e) => setBufferPercent(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Time Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-slate-800">Time Breakdown</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600">Editing Time</span>
                  <span className="font-semibold text-slate-800">
                    {results.editingTime.toFixed(1)} hrs
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600">Finishing Time</span>
                  <span className="font-semibold text-slate-800">
                    {results.finishingTime.toFixed(1)} hrs
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600">Base Total</span>
                  <span className="font-semibold text-slate-800">
                    {results.totalHours.toFixed(1)} hrs
                  </span>
                </div>
                
                {bufferPercent > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-slate-600">Buffer (+{bufferPercent}%)</span>
                    <span className="font-semibold text-indigo-600">
                      +{(results.totalHoursWithBuffer - results.totalHours).toFixed(1)} hrs
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Final Estimates */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Final Estimate</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-indigo-200 text-sm mb-1">Total Effort</div>
                  <div className="text-4xl font-bold">
                    {results.totalHoursWithBuffer.toFixed(1)} <span className="text-2xl">hours</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-indigo-500">
                  <div className="text-indigo-200 text-sm mb-1">Calendar Duration</div>
                  <div className="text-4xl font-bold">
                    {results.estimatedDays} <span className="text-2xl">workday{results.estimatedDays !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-sm text-indigo-200 mt-2">
                    Based on {hoursPerDay} hrs/day availability
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <h3 className="font-medium text-slate-800 mb-2">Quick Summary</h3>
              <p className="text-sm text-slate-600">
                A <span className="font-semibold">{finishedMinutes}-minute</span>{' '}
                <span className={`font-semibold px-1.5 py-0.5 rounded ${
                  projectType === 'lecture' ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {projectType}
                </span> video with{' '}
                <span className={`font-semibold px-1.5 py-0.5 rounded ${getLiftColor(editingLift)}`}>
                  {editingLift}
                </span>{' '}
                editing ({results.editingQ} min/min) and{' '}
                <span className={`font-semibold px-1.5 py-0.5 rounded ${getLiftColor(finishingLift)}`}>
                  {finishingLift}
                </span>{' '}
                finishing ({results.finishingQ} min/min) will take approximately{' '}
                <span className="font-semibold">{results.totalHoursWithBuffer.toFixed(1)} hours</span>{' '}
                ({results.estimatedDays} workdays at {hoursPerDay} hrs/day).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoScopeEstimator;
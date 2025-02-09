import React from 'react';

interface CheckPoint {
  id: number;
  title: string;
  timestamp: string;
  description: string;
}

interface KnowledgeChecksProps {
  checkPoints: CheckPoint[];
}

const KnowledgeChecks: React.FC<KnowledgeChecksProps> = ({ checkPoints }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-[#612665] mb-4">Knowledge Checks</h2>
      <div className="space-y-4">
        {checkPoints.map((point) => (
          <div key={point.id} className="border-l-4 border-[#612665] pl-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-gray-900">{point.title}</h3>
              <span className="text-sm text-gray-500">{point.timestamp}</span>
            </div>
            <p className="text-sm text-gray-600">{point.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeChecks; 
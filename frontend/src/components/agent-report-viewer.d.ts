import React from 'react';

export interface AgentReportViewerProps {
  report: string;
  agentName: string;
  onClose: () => void;
}

export const AgentReportViewer: React.FC<AgentReportViewerProps>;

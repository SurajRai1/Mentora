import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { ProgressReport } from '../../types/progress';
import { Download, AlertCircle } from 'lucide-react';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Times-Roman'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10
  },
  stat: {
    marginBottom: 5,
    fontSize: 12
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    minHeight: 25,
    alignItems: 'center'
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    padding: 5,
    textAlign: 'left'
  }
});

const ProgressReportPDF = ({ report }: { report: ProgressReport }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Progress Report</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Report Period</Text>
        <Text style={styles.stat}>
          From: {new Date(report.startDate).toLocaleDateString()}
        </Text>
        <Text style={styles.stat}>
          To: {new Date(report.endDate).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Study Statistics</Text>
        <Text style={styles.stat}>Total Study Time: {report.stats.totalStudyTime} minutes</Text>
        <Text style={styles.stat}>Total Sessions: {report.stats.totalSessions}</Text>
        <Text style={styles.stat}>Average Session Length: {report.stats.averageSessionLength} minutes</Text>
        <Text style={styles.stat}>Average Sessions per Week: {report.stats.averageSessionsPerWeek}</Text>
        {report.stats.mostProductiveDay && (
          <Text style={styles.stat}>Most Productive Day: {report.stats.mostProductiveDay}</Text>
        )}
        {report.stats.mostStudiedSubject && (
          <Text style={styles.stat}>Most Studied Subject: {report.stats.mostStudiedSubject}</Text>
        )}
      </View>

      {report.subjectProgress.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject Progress</Text>
          {report.subjectProgress.map((subject, index) => (
            <View key={index} style={styles.stat}>
              <Text>• {subject.subject}</Text>
              <Text>  - Total Time: {subject.totalTime} minutes</Text>
              <Text>  - Sessions: {subject.sessionsCompleted}</Text>
              <Text>  - Average Rating: {subject.averageRating.toFixed(1)}/5</Text>
            </View>
          ))}
        </View>
      )}

      {report.insights.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          {report.insights.map((insight, index) => (
            <Text key={index} style={styles.stat}>• {insight.title}</Text>
          ))}
        </View>
      )}

      {report.recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {report.recommendations.map((rec, index) => (
            <Text key={index} style={styles.stat}>• {rec.title}</Text>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

interface ProgressReportsProps {
  report: ProgressReport;
}

export const ProgressReports: React.FC<ProgressReportsProps> = ({ report }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileName = `progress-report-${report.startDate.split('T')[0]}-to-${report.endDate.split('T')[0]}.pdf`;

  const handleDownload = async () => {
    try {
      setLoading(true);
      setError(null);
      const blob = await pdf(<ProgressReportPDF report={report} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-900">Progress Report</h3>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Preparing PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>Report Period: {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}</p>
          <p>Generated: {new Date(report.generatedAt).toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Study Statistics</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Total Study Time: {report.stats.totalStudyTime} minutes</li>
              <li>Total Sessions: {report.stats.totalSessions}</li>
              <li>Average Session: {report.stats.averageSessionLength} minutes</li>
              <li>Sessions per Week: {report.stats.averageSessionsPerWeek.toFixed(1)}</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Subject Progress</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {report.subjectProgress.map((subject, index) => (
                <li key={index}>
                  {subject.subject}: {subject.sessionsCompleted} sessions, {subject.averageRating.toFixed(1)}/5 avg rating
                </li>
              ))}
            </ul>
          </div>
        </div>

        {report.insights.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Key Insights</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {report.insights.map((insight, index) => (
                <li key={index}>{insight.title}</li>
              ))}
            </ul>
          </div>
        )}

        {report.recommendations.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {report.recommendations.map((rec, index) => (
                <li key={index}>{rec.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}; 
// src/utils/exportUtils.ts
export const handleExport = async (
    format: 'csv' | 'pdf',
    timeRange: string,
    analyticsService: any,
    setError: (error: string | null) => void
  ) => {
    try {
      const blob = await analyticsService.exportData(format, timeRange);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-data.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(`Failed to export data as ${format.toUpperCase()}`);
    }
  };
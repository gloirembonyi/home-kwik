// import React from 'react';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/base/alert";
// import { Button } from "@/components/ui/base/button";
// import { monitoring } from '@/lib/monitoring';

// // TypeScript types for props and state
// interface Props {
//   children: React.ReactNode;
// }

// interface State {
//   hasError: boolean;
//   error?: Error;
// }

// export class ErrorBoundary extends React.Component<Props, State> {
//   // Initial state with no errors
//   state: State = {
//     hasError: false
//   };

//   // Update state when an error is thrown
//   static getDerivedStateFromError(error: Error): State {
//     return { hasError: true, error };
//   }

//   // Log error details to the monitoring service
//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     monitoring.errorBoundaryHandler(
//       {
//         message: error.message,
//         stack: errorInfo.componentStack,
//         severity: 'critical'
//       },
//       "additionalInfo" // Replace this with the actual required argument if known
//     );
//   }

//   // Method to reset error state and reload the page
//   handleRetry = () => {
//     this.setState({ hasError: false, error: undefined });
//     window.location.reload();
//   };

//   // Render an error alert or the children components
//   render() {
//     if (this.state.hasError) {
//       return (
//         <Alert variant="destructive" className="max-w-md mx-auto my-8">
//           <AlertTitle>Something went wrong</AlertTitle>
//           <AlertDescription>
//             <div className="space-y-4">
//               <p>An error occurred while rendering this component.</p>
//               {this.state.error && (
//                 <pre className="text-sm bg-gray-100 p-2 rounded">
//                   {this.state.error.message}
//                 </pre>
//               )}
//               <Button variant="outline" onClick={this.handleRetry}>
//                 Retry
//               </Button>
//             </div>
//           </AlertDescription>
//         </Alert>
//       );
//     }

//     return this.props.children;
//   }
// }

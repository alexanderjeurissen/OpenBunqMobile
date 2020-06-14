import React, { ErrorInfo, Component, ReactNode } from 'react'
import ObjType from '../types/obj_type';
import { IonAlert } from '@ionic/react';

interface ErrorBoundaryProps {
  children: ReactNode
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ObjType> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, showAlert: true, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // NOTE: Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
  }

  render() {
    const { showAlert, hasError, error } = this.state;

    if (hasError === true) {
      // You can render any custom fallback UI
       return <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => this.setState({ showAlert: false })}
          header={'Something went wrong'}
          message={error.toString()}
          buttons={['OK']}
        />
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;

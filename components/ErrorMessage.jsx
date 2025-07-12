import { Alert } from 'react-bootstrap';

const ErrorMessage = ({ message }) => (
  <Alert variant="danger" className="mt-4">
    <i className="bx bxs-error-circle me-2"></i>
    Error loading academic years: <strong>{message}</strong>
  </Alert>
);
export default ErrorMessage;